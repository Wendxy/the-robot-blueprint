import { buttonGroup, diagram, slider } from "./controls";
import { jointMotion, numberedJoint } from "./joint-motion";
import { sevenAxisArm } from "./seven-axis-arm";

type Point = { x: number; y: number };
const radians = Math.PI / 180;
const leftPivot = { x: 51, y: 129 };
const rightPivot = { x: 159, y: 129 };

function endpoint(p: Point, length: number, angle: number): Point {
  return { x: p.x + length * Math.cos(angle), y: p.y - length * Math.sin(angle) };
}

function fourBar(angle: number) {
  const crank = endpoint(leftPivot, 43, angle * radians);
  const dx = rightPivot.x - crank.x;
  const dy = rightPivot.y - crank.y;
  const distance = Math.hypot(dx, dy);
  // The moving joint lies at the upper intersection of two fixed-radius circles.
  const along = (96 ** 2 - 76 ** 2 + distance ** 2) / (2 * distance);
  const across = Math.sqrt(96 ** 2 - along ** 2);
  const rocker = {
    x: crank.x + (along * dx + across * dy) / distance,
    y: crank.y + (along * dy - across * dx) / distance,
  };
  return [leftPivot, crank, rocker, rightPivot];
}

function rod(a: Point, b: Point, color: string, fixed = false) {
  const coords = `x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"`;
  return `<g class="link-bar"><line ${coords} stroke="#405b48" stroke-width="11"/><line ${coords} stroke="${color}" stroke-width="8" class="link-fill"/>${fixed ? `<line ${coords} stroke="#687763" stroke-width="3" stroke-dasharray="2 5"/>` : ""}</g>`;
}

function pin(p: Point, handle?: number) {
  const draggable = handle !== undefined;
  return `<g class="joint-pin" transform="translate(${p.x} ${p.y})" ${draggable ? `data-handle="${handle}"` : ""}>
    <circle class="pin-face" r="6.8" stroke="#405b48" stroke-width="1.5" fill="${draggable ? "#e4b780" : "#d4dfce"}"/>
    <circle r="2.4" fill="#526653"/>${draggable ? '<circle r="12" fill="transparent"/>' : ""}
  </g>`;
}

function mount(p: Point) {
  return `<path d="M${p.x-12} ${p.y+14}l8-15h8l8 15z" fill="#b8c8b1" stroke="#667b62"/>`;
}

function angleControl(root: HTMLElement, name: string, min: number, max: number, initial: number, change: (v: number) => void) {
  return slider(root, name, min, max, initial, "°", change).querySelector("input")!;
}

function dragHandles(svg: SVGSVGElement, move: (index: number, p: Point) => void) {
  let handle: number | undefined;
  svg.addEventListener("pointerdown", e => {
    const target = (e.target as Element).closest("[data-handle]");
    if (!target || !e.isPrimary || e.button !== 0) return;
    handle = Number(target.getAttribute("data-handle"));
    svg.setPointerCapture(e.pointerId);
  });
  svg.addEventListener("pointermove", e => {
    if (handle === undefined || !svg.hasPointerCapture(e.pointerId)) return;
    const matrix = svg.getScreenCTM();
    if (matrix) move(handle, new DOMPoint(e.clientX, e.clientY).matrixTransform(matrix.inverse()));
  });
  svg.addEventListener("lostpointercapture", () => { handle = undefined; });
}

function setAngle(input: HTMLInputElement, value: number) {
  input.value = String(Math.round(value));
  input.dispatchEvent(new Event("input"));
}

function bearing(a: Point, b: Point) {
  return Math.atan2(a.y - b.y, b.x - a.x) / radians;
}

function openArm(root: HTMLElement) {
  root.insertAdjacentHTML("beforeend", diagram("0 -11 212 204", "An open arm with three movable joints and a gripper", '<g data-links></g>'));
  const drawing = root.querySelector("[data-links]")!;
  const angles = [65, -55, 30];
  const lengths = [36, 29, 23];
  const base = { x: 104, y: 91 };
  let points: Point[] = [];
  function draw() {
    points = [base];
    let direction = 0;
    let links = "";
    angles.forEach((angle, i) => {
      direction += angle;
      const end = endpoint(points[i], lengths[i], direction * radians);
      links += rod(points[i], end, ["#8ea996", "#b4c9ab", "#c9d7be"][i]);
      points.push(end);
    });
    const tip = points[3];
    const grip = `<g data-handle="2" transform="translate(${tip.x} ${tip.y}) rotate(${-direction})">
      <rect x="-5" y="-4" width="8" height="8" rx="1.5" fill="#e4b780" stroke="#405b48"/>
      <path d="m2 -2 4 -4h5m-9 8 4 4h5" fill="none" stroke="#576a54" stroke-width="2"/>
      <circle r="12" fill="transparent"/></g>`;
    drawing.innerHTML = mount(base) + links + grip + pin(base) + points.slice(1, 3).map((p, i) => pin(p, i)).join("");
  }
  const inputs = ["Shoulder", "Elbow", "Wrist"].map((name, i) =>
    angleControl(root, name, -150, 150, angles[i], value => { angles[i] = value; draw(); }));
  dragHandles(root.querySelector("svg")!, (i, p) => {
    const parentAngle = angles.slice(0, i).reduce((sum, angle) => sum + angle, 0);
    const relative = bearing(points[i], p) - parentAngle;
    setAngle(inputs[i], ((relative + 540) % 360) - 180);
  });
  draw();
}

function fourBarDrawing([a,b,c,d]: Point[], numbered: boolean) {
  const bars = mount(a) + mount(d) + rod(a,d,"#c8ccba",true) +
    rod(a,b,"#91ad98") + rod(b,c,"#b4c9ab") + rod(c,d,"#a2b6a0");
  if (!numbered) return bars + pin(a) + pin(c) + pin(d) + pin(b,0);

  const marker = endpoint(a, 18, bearing(a,b) * radians);
  const guide = `<circle cx="${a.x}" cy="${a.y}" r="18" fill="none" stroke="#aa8458" stroke-width=".85"/>
    <line x1="${a.x}" y1="${a.y}" x2="${marker.x}" y2="${marker.y}" stroke="#a26836" stroke-width="1.9"/>
    <circle cx="${marker.x}" cy="${marker.y}" r="2.4" fill="#c58d4e" stroke="#694827" stroke-width=".8"/>`;
  return bars + guide + numberedJoint(a.x,a.y,1,"Input pivot",true) +
    numberedJoint(b.x,b.y,2,"Crank and coupler",false) + numberedJoint(c.x,c.y,3,"Coupler and rocker",false) +
    numberedJoint(d.x,d.y,4,"Output pivot",false);
}

function linkageDiagram(root: HTMLElement) {
  root.insertAdjacentHTML("beforeend", diagram("0 0 212 182", "Four-bar linkage with two grounded pivots and one movable input", '<g data-links></g>'));
  return root.querySelector("[data-links]")!;
}

function linkage(root: HTMLElement, output: HTMLOutputElement) {
  const drawing = linkageDiagram(root);
  function draw(angle: number) {
    const pivots = fourBar(angle);
    drawing.innerHTML = fourBarDrawing(pivots, false);
    const [, , c, d] = pivots;
    output.value = Math.round(bearing(d, c)) + "°";
  }
  const input = angleControl(root, "Input angle", 20, 150, 66, draw);
  dragHandles(root.querySelector("svg")!, (_, p) => setAngle(input, bearing(leftPivot, p)));
  draw(input.valueAsNumber);
}

function calculatorLinkage(root: HTMLElement) {
  const drawing = linkageDiagram(root);
  root.insertAdjacentHTML("beforeend", '<div class="arm-picker">Driving joint<span class="fixed-driver">1 · Input pivot</span></div>');
  function draw(angle: number) { drawing.innerHTML = fourBarDrawing(fourBar(angle), true); }
  const input = angleControl(root, "Joint angle", 20, 150, 66, draw);
  root.insertAdjacentHTML("beforeend", '<p class="shape-caption">The brass spoke turns with the input link. The other three joints follow as the loop moves.</p>');
  draw(input.valueAsNumber);
  return jointMotion(root, input);
}

export function mystery(root: HTMLElement) {
  root.innerHTML = '<div class="joint-pair dof-pair"><div class="joint-card"><h4>Open-chain arm</h4></div><div class="joint-card"><h4>Four-bar linkage</h4></div></div>';
  const [arm, loop] = root.querySelectorAll<HTMLElement>(".joint-card");
  openArm(arm);
  const readout = document.createElement("p");
  readout.className = "shape-caption";
  const output = document.createElement("output");
  output.setAttribute("aria-label", "Output link angle from horizontal");
  output.setAttribute("aria-live", "off");
  readout.append("Output link angle · ", output);
  linkage(loop, output);
  loop.append(readout);
}

const examples = [
  {
    name: "Seven-joint arm", draw: sevenAxisArm, space: 6, links: 8, joints: 7,
    description: "Each joint angle can be set independently along the open chain.",
    notes: [
      "A free link in space can translate along three axes and rotate about three axes.",
      "Count the fixed base and the seven moving links. The gripper is rigidly attached to the final link.",
      "Follow the numbered pivots from the base to the tool. Each connects two neighbouring links.",
      "Each of the seven revolute joints allows one rotation, giving a sum of seven.",
    ],
  },
  {
    name: "Four-bar linkage", draw: calculatorLinkage, space: 3, links: 4, joints: 4,
    description: "Moving the input link sets the other joint angles along this closed loop.",
    notes: [
      "A free link in the plane has two translations and one rotation.",
      "Count the three moving bars and the fixed bar between the grounded pivots.",
      "Each corner of the loop is a revolute joint connecting two links.",
      "Each of the four pivots allows one rotation. Closing the loop couples those four angles.",
    ],
  },
];

export function calculator(root: HTMLElement) {
  root.innerHTML = '<div class="calc-modes"></div><div data-examples></div>';
  const container = root.querySelector("[data-examples]")!;
  const panels = examples.map(example => {
    const panel = document.createElement("div");
    panel.className = "dof-calc";
    panel.innerHTML = '<div class="dof-model"></div><div class="dof-calculation"><div class="calc-terms"></div><p class="calc-note" aria-live="polite"></p><p class="calc-equation"></p><p class="calc-explanation"></p></div>';
    container.append(panel);
    const model = panel.querySelector<HTMLElement>(".dof-model")!;
    const stopMotion = example.draw(model);
    const {space, links, joints} = example;
    // Every joint in these two examples is revolute and contributes one freedom.
    const freedoms = joints;
    const mobility = space * (links - 1 - joints) + freedoms;
    const inputs = [
      `m = ${space} · Free-body DOF`, `N = ${links} · Links`,
      `J = ${joints} · Joints`, `Σ fᵢ = ${freedoms} · Joint freedoms`,
    ];
    buttonGroup(panel.querySelector(".calc-terms")!, inputs, "Explore the formula terms", i => {
      model.dataset.highlight = [space === 3 ? "plane" : "space", "links", "joints", "joints"][i];
      panel.querySelector(".calc-note")!.textContent = example.notes[i];
    });
    panel.querySelector(".calc-equation")!.textContent = `M = ${space}(${links} − 1 − ${joints}) + ${freedoms} = ${mobility} DOF`;
    panel.querySelector(".calc-explanation")!.textContent = example.description;
    return { panel, stopMotion };
  });
  buttonGroup(root.querySelector(".calc-modes")!, examples.map(e => e.name), "Choose a mechanism", i => {
    panels.forEach(({ panel, stopMotion }, index) => {
      panel.hidden = index !== i;
      if (panel.hidden) stopMotion();
    });
  });
}
