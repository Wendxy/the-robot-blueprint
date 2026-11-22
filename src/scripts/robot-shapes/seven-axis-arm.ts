import { diagram, slider } from "./controls";
import { jointMotion, numberedJoint } from "./joint-motion";
import type { Vector } from "./projection";

const joints = [
  { name: "Base swivel", axis: "z", length: 16, angle: -22 },
  { name: "Shoulder bend", axis: "y", length: 33, angle: -21 },
  { name: "Upper-arm roll", axis: "z", length: 17, angle: 16 },
  { name: "Elbow bend", axis: "y", length: 32, angle: 102 },
  { name: "Forearm roll", axis: "z", length: 15, angle: 16 },
  { name: "Wrist bend", axis: "y", length: 13, angle: 25 },
  { name: "Tool roll", axis: "z", length: 10, angle: -22 },
] as const;

type Frame = [Vector, Vector, Vector];

function combine(a: Vector, b: Vector, scaleA: number, scaleB: number): Vector {
  return [scaleA*a[0] + scaleB*b[0], scaleA*a[1] + scaleB*b[1], scaleA*a[2] + scaleB*b[2]];
}

// Rotate the child frame about the joint's local axis, then extend its link along local Z.
function rotate([x,y,z]: Frame, axis: "y" | "z", degrees: number): Frame {
  const angle = degrees * Math.PI / 180;
  const c = Math.cos(angle), s = Math.sin(angle);
  return axis === "z"
    ? [combine(x,y,c,s), combine(x,y,-s,c), z]
    : [combine(x,z,c,-s), y, combine(x,z,s,c)];
}

function screen([x,y,z]: Vector) {
  return [.89*x - .45*y, .18*x + .36*y - .92*z];
}

function line(a: Vector, b: Vector, stroke: string, width: number, cls = "") {
  const [x1,y1] = screen(a), [x2,y2] = screen(b);
  return `<line class="${cls}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-linecap="round" stroke-width="${width}"/>`;
}

// Show the local rotation plane and a marker fixed to the outgoing link.
function rotationGuide(pivot: Vector, frame: Frame, axis: "y" | "z", length: number) {
  const center = axis === "z" ? combine(pivot,frame[2],1,length / 2) : pivot;
  const normal = axis === "y" ? frame[1] : frame[2];
  const radial = axis === "y" ? frame[2] : frame[0];
  const tangent = axis === "y" ? frame[0] : frame[1];
  const ring = Array.from({ length: 65 }, (_, i) => {
    const t = i * Math.PI / 32;
    const direction = combine(radial,tangent,Math.cos(t),Math.sin(t));
    return screen(combine(center,direction,1,11)).join(",");
  });
  const marker = combine(center,radial,1,11);
  const [x,y] = screen(marker);
  return `<g pointer-events="none"><polyline points="${ring.join(" ")}" fill="none" stroke="#aa8458" stroke-width=".85"/>
    <g stroke-dasharray="2 2">${line(combine(pivot,normal,1,-18),combine(pivot,normal,1,18),"#865c32",1.2)}</g>
    ${line(center,marker,"#a26836",1.9)}
    <circle cx="${x}" cy="${y}" r="2.4" fill="#c58d4e" stroke="#694827" stroke-width=".8"/></g>`;
}

export function sevenAxisArm(root: HTMLElement) {
  // Use the opening pose’s framing for every joint and angle.
  root.innerHTML = diagram("-67.6782 -106.3516 135.3564 135.3564", "Spatial robot arm with seven numbered revolute joints and a fixed base", '<g data-arm></g>') +
    '<label class="arm-picker">Driving joint<select></select></label><div data-angle></div><p class="shape-caption">The dashed line marks the joint axis. The brass dot turns with the link.</p>';
  const svg = root.querySelector("svg")!;
  const drawing = root.querySelector("[data-arm]")!;
  const picker = root.querySelector("select")!;
  const caption = root.querySelector(".shape-caption")!;
  const defaultCaption = caption.textContent;

  joints.forEach((joint,i) => picker.add(new Option(`${i+1} · ${joint.name}`, String(i))));
  const angles: number[] = joints.map(j => j.angle);
  function draw() {
    const active = picker.selectedIndex;
    let frame: Frame = [[1,0,0], [0,1,0], [0,0,1]];
    let end: Vector = [0,0,7];
    const pivots: Vector[] = [];
    const pieces: string[] = [];
    let guide = "";
    joints.forEach((joint,i) => {
      pivots.push(end);
      frame = rotate(frame, joint.axis, angles[i]);
      if (i === active) {
        guide = rotationGuide(end, frame, joint.axis, joint.length);
      }
      const tip = combine(end, frame[2], 1, joint.length);
      pieces.push(line(end,tip,"#405b48",7.8), line(end,tip,i%2 ? "#adc3a7" : "#8fa995",5.8,"link-fill"));
      end = tip;
    });

    // The two jaws belong to the rigid tool. Their orientation makes tool roll visible.
    for (const side of [-1,1]) {
      const jaw = combine(end,frame[0],1,side*5);
      const tip = combine(jaw,frame[2],1,7);
      pieces.push(line(end,jaw,"#4f604e",2),line(jaw,tip,"#4f604e",2));
      if (side === 1) {
        const [x,y] = screen(tip);
        pieces.push(`<circle cx="${x}" cy="${y}" r="1.5" fill="#b87a3c"/>`);
      }
    }
    const pins = pivots.map((p,i) => {
      const [x,y] = screen(p);
      return numberedJoint(x, y, i+1, joints[i].name, i === active, true);
    });
    drawing.innerHTML = '<path d="m-16 0 12-6 21 4 0 6-12 6-21-4z" fill="#94aa91" stroke="#405b48" class="arm-base"/><path d="m-16 0 21 4 12-6m-12 6v6" fill="none" stroke="#667e63"/>' + pieces.join("") + guide + pins.filter((_,i) => i !== active).join("") + pins[active];
  }
  const row = slider(root.querySelector("[data-angle]")!, "Joint angle", -150, 150, angles[0], "°", angle => {
    angles[picker.selectedIndex] = angle;
    draw();
  });
  const input = row.querySelector("input")!;
  function selectJoint() {
    const i = picker.selectedIndex;
    caption.textContent = i === 2 || i === 4
      ? `Joint ${i+1} twists the link along its length. Watch the brass spoke turn between ${i+1} and ${i+2}. Both joint centres lie on the rotation axis and stay in place.`
      : defaultCaption;
    input.value = String(angles[i]);
    input.dispatchEvent(new Event("input"));
  }
  picker.addEventListener("change", selectJoint);
  svg.addEventListener("click", e => {
    const pin = (e.target as Element).closest("[data-arm-joint]");
    if (pin) {
      picker.selectedIndex = Number(pin.getAttribute("data-arm-joint"));
      selectJoint();
    }
  });
  draw();
  return jointMotion(root, input, index => {
    picker.selectedIndex = index;
    selectJoint();
  });
}
