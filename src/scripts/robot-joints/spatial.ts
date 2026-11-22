import { diagram, slider } from "../robot-shapes/controls";
import { project, type Vector } from "../robot-shapes/projection";
import { jointMotion } from "../robot-shapes/joint-motion";

const rad = Math.PI / 180;
const view = "96 67 208 158";
const ink = "#405a47", sage = "#a9c0a3", brass = "#be8c50";
function turnX([x,y,z]: Vector, a: number): Vector {
  return [x, y*Math.cos(a)-z*Math.sin(a), y*Math.sin(a)+z*Math.cos(a)];
}
function stroke(points: Vector[], colour: string, width: number, dashed = false) {
  return `<polyline points="${points.map(p=>project(p).join(",")).join(" ")}" fill="none" stroke="${colour}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${dashed ? 'stroke-dasharray="3 3"' : ""}/>`;
}
function bar(a: Vector, b: Vector, width: number, colour = sage) {
  return stroke([a,b],ink,width) + stroke([a,b],colour,width-2.4);
}
function dot(p: Vector, size: number, colour = brass) {
  const [x,y] = project(p);
  return `<circle cx="${x}" cy="${y}" r="${size}" fill="${colour}" stroke="${ink}" stroke-width="1.4"/>`;
}
function curve(point: (t: number) => Vector, from: number, to: number, colour: string, width: number, dashed = false) {
  const path = Array.from({length:65},(_,i)=>point(from+(to-from)*i/64));
  return stroke(path,colour,width,dashed);
}
export function jointAxis(root: HTMLElement) {
  root.innerHTML = diagram(view,"Revolute link, axis of rotation and orbit",'<g data-axis></g>') +
    '<div class="shape-sliders"></div>';
  let tilt = 0, angle = 35;
  const drawing = root.querySelector("[data-axis]")!;
  function draw() {
    const orient = (p:Vector) => turnX(p,tilt*rad);
    const orbit = (t:number) => orient([51*Math.cos(t),51*Math.sin(t),0]);
    const tip = orbit(angle*rad);
    const arrowStart = angle*rad + .13, arrowEnd = arrowStart + .58;
    const head = orbit(arrowEnd), back = orbit(arrowEnd-.16);
    const wing = (n:number): Vector => back.map((v,i)=>v+n*head[i]/51) as Vector;
    drawing.innerHTML = curve(orbit,0,2*Math.PI,"#9aaa93",1.3,true) +
      stroke([orient([0,0,-46]),orient([0,0,55])],"#9c683d",2,true) +
      bar([0,0,0],tip,9) + dot([0,0,0],6,"#ccd9c5") + dot(tip,4) +
      curve(orbit,arrowStart,arrowEnd,brass,3) + stroke([wing(-4),head,wing(4)],brass,2.5);
  }
  const controls = root.querySelector<HTMLElement>(".shape-sliders")!;
  slider(controls,"Axis tilt from vertical",0,90,tilt,"°",v=>{ tilt=v; draw(); });
  const input = slider(controls,"Joint angle",-180,180,angle,"°",v=>{ angle=v; draw(); }).querySelector("input")!;
  jointMotion(root,input);
  draw();
}
