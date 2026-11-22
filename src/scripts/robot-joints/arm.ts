import { buttonGroup, diagram, slider } from "../robot-shapes/controls";
import { jointMotion, numberedJoint } from "../robot-shapes/joint-motion";

const names = ["Shoulder", "Elbow", "Wrist"];
const lengths = [50, 40, 30];
const axisLines = '<path d="M-125 0H125m-4-3 4 3-4 3M0 125V-125m-3 4 3-4 3 4" fill="none" stroke="#a7b5a0"/><g class="diagram-label"><text x="116" y="14">X</text><text x="7" y="-115">Y</text></g>';

export function robotArm(root: HTMLElement, coordinates: boolean) {
  root.innerHTML = diagram("-131 -131 262 262", "Three-link arm viewed from above", (coordinates ? axisLines : "") + '<g data-arm></g>') +
    '<div class="arm-modes"></div><div class="arm-select"></div><div class="shape-sliders"></div><p class="shape-caption"></p>';
  const controls = root.querySelector<HTMLElement>(".shape-sliders")!;
  const drawing = root.querySelector("[data-arm]")!;
  const caption = root.querySelector(".shape-caption")!;
  const angles = [30, 45, -20];
  let selected = 0, highlightLinks = false;
  function draw() {
    let x = 0, y = 0, heading = 0;
    let bars = "", pins = "";
    lengths.forEach((length,i) => {
      heading += angles[i];
      const theta = heading * Math.PI / 180;
      const nextX = x + length*Math.cos(theta), nextY = y - length*Math.sin(theta);
      const coords = `x1="${x}" y1="${y}" x2="${nextX}" y2="${nextY}"`;
      bars += `<g stroke-linecap="round"><line ${coords} stroke="#405b48" stroke-width="9"/><line ${coords} stroke="${highlightLinks ? "#dfb885" : ["#8fa995","#acc2a4","#c0d1b7"][i]}" stroke-width="6.5"/></g>`;
      pins += numberedJoint(x,y,i+1,names[i],!coordinates && i===selected,!coordinates);
      x = nextX;
      y = nextY;
    });
    const guides = coordinates ? `<path d="M0 ${y}H${x}V0" fill="none" stroke="#a7754a" stroke-dasharray="3 3"/>` : "";
    const tool = `<g transform="translate(${x} ${y}) rotate(${-heading})"><path d="M-5-2l5-3h5m-10 7 5 3h5" fill="none" stroke="#425c46" stroke-width="2"/><circle r="2.3" fill="#b48350"/></g>`;
    drawing.innerHTML = guides + '<path class="arm-base" d="m-12 12 8-15h8l8 15z" fill="#a4b79e" stroke="#526b54"/>' + bars + tool + pins;
    if (coordinates) {
      const signedHeading = ((heading + 540) % 360) - 180;
      caption.textContent = `Gripper   X = ${Number(x.toFixed(1))} mm   ·   Y = ${Number((-y).toFixed(1))} mm   ·   Heading = ${signedHeading}°`;
    } else {
      caption.textContent = [
        "The shoulder carries the upper arm, forearm and gripper.",
        "The elbow carries the forearm and gripper. The upper arm stays in place.",
        "The wrist turns the last link and gripper while the shoulder and elbow stay in place.",
      ][selected];
    }
  }
  if (coordinates) {
    names.forEach((name,i) => slider(controls,`${i+1} · ${name}`,-150,150,angles[i],"°",v => { angles[i]=v; draw(); }));
    controls.insertAdjacentHTML("afterend", '<p class="joint-dimensions">Links from shoulder to gripper · 50 mm, 40 mm, 30 mm</p>');
  } else {
    buttonGroup(root.querySelector(".arm-modes")!, ["Links", "Joints"], "Highlight arm parts", i => {
      highlightLinks = i === 0;
      root.dataset.part = highlightLinks ? "links" : "joints";
      draw();
    });
    const input = slider(controls,"Joint angle",-150,150,angles[0],"°",value => { angles[selected] = value; draw(); }).querySelector("input")!;
    const select = buttonGroup(root.querySelector(".arm-select")!, names.map((n,i) => `${i+1} · ${n}`), "Driving joint", i => {
      selected = i;
      input.value = String(angles[i]);
      input.dispatchEvent(new Event("input"));
    });
    jointMotion(root,input,select);
  }
  draw();
}
