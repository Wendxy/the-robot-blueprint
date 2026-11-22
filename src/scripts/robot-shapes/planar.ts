import { diagram, slider } from "./controls";

type Point = { x: number; y: number };
type ArmPose = { shoulder: number; elbow?: number };
const base: Point = { x: 205, y: 137 };
const upper = 72, forearm = 48;
const radians = Math.PI / 180;
const obstacle = { x: 253, y: 102, r: 17 };

function endOf(start: Point, length: number, angle: number): Point {
  return { x: start.x + length * Math.cos(angle), y: start.y - length * Math.sin(angle) };
}

function armDrawing() {
  return `<g class="drawn-arm">
    <g data-upper><rect x="0" y="-5" width="${upper}" height="10" rx="4" fill="#93ad98"/></g>
    <g data-lower><rect x="0" y="-4" width="${forearm}" height="8" rx="4" fill="#b9cdb4"/><circle r="7" fill="#d9e4d5"/><circle r="2" fill="#6e8874"/></g>
    <circle cx="${base.x}" cy="${base.y}" r="10" fill="#e0e8da"/><circle cx="${base.x}" cy="${base.y}" r="4" fill="#739079"/>
    <g data-grip fill="none"><path d="m-7 0 2-5 8 0m-10 5 2 5h8"/><circle r="2" fill="#ac7650"/></g>
  </g>`;
}

function drawArm(root: HTMLElement, pose: ArmPose) {
  const elbow = endOf(base, upper, pose.shoulder);
  const angle = pose.shoulder + (pose.elbow ?? 0);
  const tip = pose.elbow === undefined ? elbow : endOf(elbow, forearm, angle);
  function transform(selector: string, p: Point, a: number) {
    root.querySelector(selector)!.setAttribute("transform", `translate(${p.x} ${p.y}) rotate(${-a / radians})`);
  }
  transform("[data-upper]", base, pose.shoulder);
  transform("[data-lower]", elbow, angle);
  root.querySelector("[data-lower]")!.setAttribute("visibility", pose.elbow === undefined ? "hidden" : "visible");
  transform("[data-grip]", tip, angle);
  return tip;
}

function tabletop(id: string) {
  return `<defs><pattern id="${id}" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".85" fill="#abbca8"/></pattern></defs>
    <rect width="420" height="274" fill="#f9f8ef"/><rect width="420" height="274" fill="url(#${id})"/>`;
}

export function builder(root: HTMLElement) {
  root.innerHTML = diagram("0 0 420 274", "Top view of a planar robot arm, with its workspace and gripper trail",
    tabletop("builder-grid") + `<circle data-work cx="${base.x}" cy="${base.y}" fill="none" stroke="#abc5a1"/><g data-trail fill="#a26843"></g>` + armDrawing()) +
    '<div class="shape-control-row"><button type="button" class="robot-button secondary" aria-pressed="false">Add elbow joint</button><span class="shape-key"><i></i>Reachable positions <i class="trail-key"></i>Gripper trail</span></div><div class="shape-sliders"></div><p class="shape-caption" aria-live="polite"></p>';
  const controls = root.querySelector<HTMLElement>(".shape-sliders")!;
  const change = root.querySelector("button")!;
  const work = root.querySelector("[data-work]")!;
  const trail = root.querySelector("[data-trail]")!;
  let shoulder = 30, elbow = 50, two = false;
  function draw() {
    const tip = drawArm(root, { shoulder: shoulder * radians, elbow: two ? elbow * radians : undefined });
    const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    dot.setAttribute("cx", String(tip.x));
    dot.setAttribute("cy", String(tip.y));
    dot.setAttribute("r", "2");
    trail.append(dot);
    if (trail.childElementCount > 220) trail.firstElementChild!.remove();
  }
  slider(controls, "Shoulder angle", -180, 180, shoulder, "°", v => { shoulder = v; draw(); });
  const elbowRow = slider(controls, "Elbow angle", -180, 180, elbow, "°", v => { elbow = v; draw(); });
  function setMode() {
    elbowRow.hidden = !two;
    change.textContent = two ? "Remove elbow joint" : "Add elbow joint";
    change.setAttribute("aria-pressed", String(two));
    // A full turn of the first link traces a circle. A second free joint sweeps an annulus.
    work.setAttribute("r", String(upper));
    work.setAttribute("stroke-width", String(two ? 2 * forearm : 2.5));
    work.setAttribute("opacity", two ? ".52" : "1");
    root.querySelector(".shape-caption")!.textContent = two
      ? "2 DOF · The elbow changes the gripper’s distance from the base. The gripper can reach the shaded band."
      : "1 DOF · The gripper stays one link length from the base, tracing the green circle.";
    trail.replaceChildren();
    draw();
  }
  change.addEventListener("click", () => { two = !two; setMode(); });
  setMode();
}

function hitsPost(a: Point, b: Point) {
  const dx = b.x - a.x, dy = b.y - a.y;
  const t = Math.max(0, Math.min(1, ((obstacle.x - a.x) * dx + (obstacle.y - a.y) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(a.x + t * dx - obstacle.x, a.y + t * dy - obstacle.y) <= obstacle.r + 5;
}

function reach(target: Point): { state: "outside" | "blocked" | "reachable"; pose?: ArmPose } {
  const x = target.x - base.x, y = base.y - target.y;
  const distance = Math.hypot(x, y);
  if (distance < upper - forearm || distance > upper + forearm) return { state: "outside" };
  if (Math.hypot(target.x - obstacle.x, target.y - obstacle.y) <= obstacle.r + 9) return { state: "blocked" };
  const cosElbow = (distance * distance - upper * upper - forearm * forearm) / (2 * upper * forearm);
  const bend = Math.acos(Math.max(-1, Math.min(1, cosElbow)));
  // The same point admits an elbow on either side of the base-to-cup line.
  for (const elbow of [bend, -bend]) {
    const shoulder = Math.atan2(y, x) - Math.atan2(forearm * Math.sin(elbow), upper + forearm * Math.cos(elbow));
    const joint = endOf(base, upper, shoulder);
    if (!hitsPost(base, joint) && !hitsPost(joint, target)) return { state: "reachable", pose: { shoulder, elbow } };
  }
  return { state: "blocked" };
}

function reachMap() {
  // Draw contiguous runs from the same feasibility test used while dragging.
  const rows: string[] = [];
  for (let y = base.y - 120; y <= base.y + 120; y += 2) {
    let start: number | undefined;
    for (let x = base.x - 120; x <= base.x + 122; x += 2) {
      const inside = reach({ x, y }).state === "reachable";
      if (inside && start === undefined) start = x;
      if (!inside && start !== undefined) {
        rows.push(`M${start - 1} ${y - 1}h${x - start}v2H${start - 1}Z`);
        start = undefined;
      }
    }
  }
  return rows.join("");
}

export function cupChallenge(root: HTMLElement) {
  root.innerHTML = diagram("0 0 420 274", "Table with a robot arm, cup and fixed round post", tabletop("cup-grid") +
    `<path data-region fill="#c8ddc0" opacity=".85"/><circle cx="${obstacle.x}" cy="${obstacle.y}" r="${obstacle.r}" fill="#b4a38a" stroke="#685a49" stroke-width="2"/>
    <text class="diagram-label" x="${obstacle.x}" y="${obstacle.y - 24}" text-anchor="middle">Post</text>` + armDrawing() +
    '<g data-cup><title>Cup</title><circle r="17" fill="transparent"/><path d="M7-4q14-2 9 6-2 3-7 1" fill="none" stroke="#765034" stroke-width="3"/><circle r="10" fill="#e8c7a5" stroke="#765034" stroke-width="2"/><circle r="6" fill="#916746"/></g>') +
    '<div class="shape-control-row"><button class="robot-button secondary" type="button" aria-pressed="false">Show reachable region</button></div><p class="shape-caption" aria-live="polite"></p>';
  const svg = root.querySelector("svg")!;
  // Expose the table as a keyboard control as well as a pointer surface.
  svg.removeAttribute("role");
  const cup = root.querySelector<SVGGElement>("[data-cup]")!;
  cup.setAttribute("tabindex", "0");
  cup.setAttribute("role", "button");
  cup.setAttribute("aria-label", "Move cup with arrow keys. Use Enter to return it to its starting position.");
  const home = { x: 135, y: 87 };
  let target = { ...home };
  const status = root.querySelector(".shape-caption")!;
  const descriptions = {
    reachable: "Reachable · The gripper can meet the cup with both links clear of the post.",
    outside: "Outside the workspace · The arm cannot extend or fold far enough to reach the cup.",
    blocked: "Blocked · The post occupies space needed by the cup or the arm in this pose.",
  };
  function move(x: number, y: number) {
    target = { x: Math.max(15, Math.min(400, x)), y: Math.max(15, Math.min(259, y)) };
    cup.setAttribute("transform", `translate(${target.x} ${target.y})`);
    const result = reach(target);
    if (result.pose) drawArm(root, result.pose);
    root.dataset.reach = result.state;
    if (status.textContent !== descriptions[result.state]) status.textContent = descriptions[result.state];
  }
  move(home.x, home.y);
  function follow(e: PointerEvent) {
    const matrix = svg.getScreenCTM();
    if (!matrix) return;
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(matrix.inverse());
    move(p.x, p.y);
  }
  svg.addEventListener("pointerdown", e => {
    if (!e.isPrimary || e.button !== 0) return;
    svg.setPointerCapture(e.pointerId);
    cup.focus({ preventScroll: true });
    follow(e);
  });
  svg.addEventListener("pointermove", e => { if (svg.hasPointerCapture(e.pointerId)) follow(e); });
  const directions: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
  cup.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); move(home.x, home.y); return; }
    const step = directions[e.key];
    if (!step) return;
    e.preventDefault();
    move(target.x + 4 * step[0], target.y + 4 * step[1]);
  });
  const toggle = root.querySelector("button")!;
  const region = root.querySelector("[data-region]")!;
  toggle.addEventListener("click", () => {
    const on = toggle.getAttribute("aria-pressed") === "false";
    if (on && !region.hasAttribute("d")) region.setAttribute("d", reachMap());
    region.setAttribute("visibility", on ? "visible" : "hidden");
    toggle.setAttribute("aria-pressed", String(on));
    toggle.textContent = on ? "Hide reachable region" : "Show reachable region";
  });
}
