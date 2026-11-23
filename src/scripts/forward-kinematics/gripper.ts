import { buttonGroup, diagram, slider } from "../robot-shapes/controls";
import { project, rigidTransform, type Vector } from "../robot-shapes/projection";

type Transform = (p: Vector) => Vector;
const depth = ([x,y,z]: Vector) => x+y+z*.72/.87;
const faces = [[0,1,2,3],[4,5,6,7],[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7]];
const sage = ["#92a892","#c8d8bf","#a5bba4","#91ad98","#a5bba4","#91ad98"];
const brass = ["#bf9364","#efd3ac","#dfb782","#cea277","#dfb782","#cea277"];

function box(low: Vector, high: Vector, palette: string[], transform: Transform) {
  const [x,y,z] = low, [u,v,w] = high;
  const corners: Vector[] = [[x,y,z],[u,y,z],[u,v,z],[x,v,z],[x,y,w],[u,y,w],[u,v,w],[x,v,w]];
  const vertices = corners.map(transform);
  return faces.map((face,i) => {
    const points = face.map(j => vertices[j]);
    return {depth:points.reduce((sum,p) => sum+depth(p),0),
      svg:`<polygon points="${points.map(p => project(p).join(",")).join(" ")}" fill="${palette[i]}"/>`};
  }).sort((a,b) => a.depth-b.depth).map(f => f.svg).join("");
}

function path(a: Vector,b: Vector) {
  return `<path d="M${project(a)} L${project(b)}"/>`;
}
function axes(transform: Transform, length: number, local: boolean) {
  const base = transform([0,0,0]);
  return ["X","Y","Z"].map((name,i) => {
    const direction: Vector = [0,0,0];
    direction[i] = length;
    const end = transform(direction);
    const [x,y] = project(end);
    return path(base,end) + `<text x="${x+3}" y="${y-3}">${name}${local ? "′" : ""}</text>`;
  }).join("");
}

export function gripperPose(root: HTMLElement) {
  const grid = [];
  for (let v=-60; v<=60; v+=15) grid.push(path([v,-60,0],[v,60,0]),path([-60,v,0],[60,v,0]));
  root.innerHTML = diagram("80 1 244 205","Gripper holding a cube above fixed world axes",
    `<g class="point-grid">${grid.join("")}</g><g class="fk-axes">${axes(p=>p,72,false)}</g><g data-grip-scene></g>`) +
    '<div class="fk-modes"></div><div class="shape-sliders" data-translation></div><div class="shape-sliders" data-rotation></div>' +
    '<div class="shape-control-row"><label class="shape-toggle"><input type="checkbox">Show local axes</label><button type="button" class="robot-button secondary">Reset pose</button></div>';
  const scene = root.querySelector("[data-grip-scene]")!;
  const toggle = root.querySelector<HTMLInputElement>('[type="checkbox"]')!;
  const translation = root.querySelector<HTMLElement>("[data-translation]")!;
  const rotation = root.querySelector<HTMLElement>("[data-rotation]")!;
  const position: Vector = [0,0,54], angles: Vector = [-12,16,-20];

  function draw() {
    const transform = rigidTransform(position,angles);
    const jaws = [
      box([-17,-7,-11],[-11,7,18],sage,transform),
      box([-11,-11,-11],[11,11,11],brass,transform),
      box([11,-7,-11],[17,7,18],sage,transform),
    ];
    // The jaws flank the cube along local X; the palm and wrist sit above them along local Z.
    // Order these disjoint layers along the viewing direction before painting their faces.
    if (depth(transform([1,0,0])) < depth(position)) jaws.reverse();
    const layers = [jaws.join(""),box([-17,-9,18],[17,9,26],sage,transform),
      box([-7,-6,26],[7,6,34],sage,transform)];
    if (depth(transform([0,0,1])) < depth(position)) layers.reverse();
    const ground: Vector = [position[0],position[1],0];
    const [x,y] = project(ground);
    scene.innerHTML = `<ellipse cx="${x}" cy="${y}" rx="11" ry="4" fill="#d3dfca"/>
      <g class="point-drop">${path(ground,position)}</g><g class="drawn-arm">${layers.join("")}</g>` +
      (toggle.checked ? `<g class="fk-axes fk-local-axes">${axes(transform,44,true)}</g>` : "");
  }
  ["X","Y","Z"].forEach((name,i) => slider(translation,name,i===2 ? 36 : -32,i===2 ? 80 : 32,position[i]," mm",v => { position[i]=v; draw(); }));
  ["Roll","Pitch","Yaw"].forEach((name,i) => slider(rotation,name,-180,180,angles[i],"°",v => { angles[i]=v; draw(); }));
  buttonGroup(root.querySelector(".fk-modes")!,["Position","Orientation"],"Gripper controls",i => {
    translation.hidden = i!==0;
    rotation.hidden = i!==1;
  });
  toggle.addEventListener("change",draw);
  root.querySelector(".shape-control-row button")!.addEventListener("click",() => {
    for (const input of root.querySelectorAll<HTMLInputElement>('input[type="range"]')) {
      input.value = input.defaultValue;
      input.dispatchEvent(new Event("input"));
    }
  });
  // The shared slider sets its live value. Record the initial pose for the reset control.
  for (const input of root.querySelectorAll<HTMLInputElement>('input[type="range"]')) input.defaultValue=input.value;
  draw();
}
