import { diagram, buttonGroup, slider } from "./controls";

const parts = [
  { name: "Base", note: "The mounting plate holds the shoulder in place and transfers the arm’s load to the workbench.", shape: '<path d="m66 162 53 0 15 13-3 9H54l-2-9z"/><path d="M52 175h82"/><circle cx="64" cy="176" r="2"/><circle cx="123" cy="176" r="2"/>', leader: "63,173 36,173 36,151", x: 23, y: 145 },
  { name: "Links", note: "These rigid members span the distance between joints. Their lengths help determine how far the gripper can reach.", shape: '<path d="m80 151 42-84 18 9-41 84z"/><path d="m132 63 103-28 5 16-103 29z"/><path d="m246 38 44 31-7 11-47-28z"/>', leader: "110,111 131,127 159,127", x: 163, y: 131 },
  { name: "Joints", note: "These pivots let neighbouring links rotate relative to each other. Here the shoulder, elbow and wrist each have a rotary joint.", shape: '<circle cx="91" cy="150" r="19"/><circle cx="131" cy="71" r="15"/><circle cx="239" cy="44" r="12"/>', leader: "238,32 239,16 257,16", x: 261, y: 20 },
  { name: "Actuator", note: "An electric motor at the shoulder supplies torque to turn the link. The motor provides the drive and the joint guides the motion.", shape: '<path d="M62 137h21q12 13 0 26H62q-12-13 0-26z"/><ellipse cx="62" cy="150" rx="6" ry="13"/><path d="M66 141h12m-12 6h14m-14 6h14"/>', leader: "63,137 46,106 19,106", x: 14, y: 99 },
  { name: "Sensor", note: "The encoder on the elbow measures its angle. The controller uses that reading to check where the arm actually is.", shape: '<circle cx="131" cy="71" r="8"/><path d="M131 63v4m6 0-3 2"/><circle cx="131" cy="71" r="2"/>', leader: "129,62 111,31 70,31", x: 67, y: 25 },
  { name: "End effector", note: "The gripper contacts the workpiece. A different task might call for a suction cup or a welding torch on the same wrist.", shape: '<path d="m282 65 14 7-7 13-14-7z"/><path d="m279 79-4 18 9 5 4-6-5-3 2-10zm12 3 8 11 6-3 3 6-11 6-14-17z"/>', leader: "305,94 330,105 362,105", x: 314, y: 122 },
];

export function anatomy(root: HTMLElement) {
  const layers = parts.map((p, i) => `<g data-part="${i}" class="anatomy-part">${p.shape}</g>`).join("");
  const labels = parts.map((p, i) => `<g data-part="${i}" class="part-label"><polyline points="${p.leader}"/><text x="${p.x}" y="${p.y}">${p.name}</text></g>`).join("");
  root.innerHTML = diagram("0 0 412 201", "Side view of an industrial arm with six labelled parts", `<path class="bench-line" d="M18 185h374"/>${layers}${labels}`) +
    '<div class="part-picker"></div><p class="shape-caption" aria-live="polite"></p>';
  const groups = root.querySelectorAll<SVGElement>("[data-part]");
  const select = buttonGroup(root.querySelector(".part-picker")!, parts.map(p => p.name), "Arm parts", i => {
    groups.forEach(g => g.classList.toggle("part-active", Number(g.dataset.part) === i));
    root.querySelector(".shape-caption")!.textContent = parts[i].note;
  });
  for (const group of groups) {
    group.addEventListener("pointerenter", e => { if (e.pointerType === "mouse") select(Number(group.dataset.part)); });
    group.addEventListener("click", () => select(Number(group.dataset.part)));
  }
}

export function playground(root: HTMLElement) {
  root.innerHTML = '<div class="joint-pair"></div><label class="shape-toggle"><input type="checkbox"> Show movement axes</label>';
  const pair = root.querySelector(".joint-pair")!;
  const pivot = '<path d="m30 99 12-29h18l13 29z" fill="#91a891"/><g data-moving><rect x="45" y="61" width="72" height="12" rx="6" fill="#bbcfb6"/><circle cx="112" cy="67" r="7" fill="#caad87"/></g><circle cx="50" cy="67" r="9" fill="#d8e3d2"/>';
  const slide = '<path d="M15 77h118v8H15z" fill="#a5b8a3"/><path d="M20 85h9v10h-9zm99 0h9v10h-9z"/><g data-moving><rect x="17" y="58" width="31" height="19" rx="4" fill="#b4c9af"/><path d="M25 58V46h14v12z" fill="#d3b48e"/></g>';
  const rotationAxis = '<path d="M22 56a29 29 0 0 1 37-16m-6-7 7 8-11 1"/><circle cx="50" cy="67" r="4"/><circle cx="50" cy="67" r="1" fill="currentColor"/>';
  const slideAxis = '<path d="M17 32h112m-6-5 7 5-7 5M23 27l-7 5 7 5"/>';
  for (const kind of ["Revolute", "Prismatic"]) {
    const rotates = kind === "Revolute";
    const card = document.createElement("div");
    card.className = "joint-card";
    card.innerHTML = `<h4>${kind} joint</h4>` + diagram("0 0 150 110", kind + " mechanism", `<g class="mechanism">${rotates ? pivot : slide}</g><g class="motion-axis">${rotates ? rotationAxis : slideAxis}</g>`);
    pair.append(card);
    const moving = card.querySelector("[data-moving]")!;
    function draw(v: number) {
      moving.setAttribute("transform", rotates ? `rotate(${-v} 50 67)` : `translate(${v * .77} 0)`);
    }
    const initial = rotates ? 28 : 40;
    slider(card, rotates ? "Joint angle" : "Travel", rotates ? -30 : 0, rotates ? 90 : 100, initial, rotates ? "°" : " mm", draw);
    draw(initial);
  }
  const toggle = root.querySelector("input[type=checkbox]") as HTMLInputElement;
  toggle.addEventListener("change", () => root.classList.toggle("axes-visible", toggle.checked));
}
