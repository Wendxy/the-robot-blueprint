import { buttonGroup, diagram, slider } from "./controls";

type Vector = [number, number, number];
const half = 14;
const corners: Vector[] = [
  [-half, -half, -half], [half, -half, -half], [half, half, -half], [-half, half, -half],
  [-half, -half, half], [half, -half, half], [half, half, half], [-half, half, half],
];
const faces = [
  { corners: [0,1,2,3], color: "#92a18e" }, { corners: [4,5,6,7], color: "#e5c397" },
  { corners: [0,1,5,4], color: "#819b87" }, { corners: [1,2,6,5], color: "#b6cbb3" },
  { corners: [2,3,7,6], color: "#91ad98" }, { corners: [3,0,4,7], color: "#d0dace" },
];
const project = ([x,y,z]: Vector) => [200 + .86 * (x-y), 158 + .36 * (x+y) - .87*z];

function line(a: Vector, b: Vector) {
  const [x1,y1] = project(a), [x2,y2] = project(b);
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
}

export function poseExplorer(root: HTMLElement) {
  const grid = [];
  for (let v = -72; v <= 72; v += 12) {
    grid.push(line([-72,v,0], [72,v,0]), line([v,-72,0], [v,72,0]));
  }
  const axes: [string, Vector][] = [["X", [89,0,0]], ["Y", [0,89,0]], ["Z",[0,0,128]]];
  const guides = axes.map(([name, tip]) => {
    const [x,y] = project(tip);
    return line([0,0,0],tip) + `<text class="diagram-label" x="${x+3}" y="${y-5}">${name}</text>`;
  }).join("");
  root.innerHTML = diagram("0 0 400 222", "Cube on three spatial axes above a gridded plane",
    `<g stroke="#cbd5c7" stroke-width=".9">${grid.join("")}</g><g stroke="#7c8c7a" stroke-width="1.4">${guides}</g><g data-projection></g><g data-cube></g>`) +
    '<div class="pose-modes"></div><div class="shape-sliders" data-position></div><div class="shape-sliders" data-orientation></div>';
  const position: Vector = [0,0,50], angles: Vector = [0,0,0];
  function transform([x,y,z]: Vector): Vector {
    // Intrinsic roll, pitch, yaw represented by Rz(yaw) Ry(pitch) Rx(roll).
    const [a,b,c] = angles.map(v => v * Math.PI / 180);
    const ry = y*Math.cos(a) - z*Math.sin(a), rz = y*Math.sin(a) + z*Math.cos(a);
    const px = x*Math.cos(b) + rz*Math.sin(b), pz = -x*Math.sin(b) + rz*Math.cos(b);
    return [px*Math.cos(c) - ry*Math.sin(c) + position[0], px*Math.sin(c) + ry*Math.cos(c) + position[1], pz + position[2]];
  }
  function draw() {
    const vertices = corners.map(transform);
    const [px,py] = project([position[0],position[1],0]);
    root.querySelector("[data-projection]")!.innerHTML = `<ellipse cx="${px}" cy="${py}" rx="17" ry="7" fill="#cbd7c6"/><g stroke="#849880" stroke-dasharray="3 3">${line([position[0],position[1],0],position)}</g>`;
    // Paint the far faces first using depth along the projection's viewing direction.
    const polygons = faces.map((face, index) => {
      const points = face.corners.map(i => vertices[i]);
      const depth = points.reduce((d, [x,y,z]) => d + x + y + z * (.72/.87), 0);
      const mark = index === 1 ? `<polyline points="${([[-8,-7,half],[1,-7,half],[-8,2,half]] as Vector[]).map(v => project(transform(v)).join(",")).join(" ")}" fill="#926a4b" stroke="none"/>` : "";
      return { depth, svg: `<polygon points="${points.map(p => project(p).join(",")).join(" ")}" fill="${face.color}"/>${mark}` };
    }).sort((a,b) => a.depth - b.depth);
    root.querySelector("[data-cube]")!.innerHTML = polygons.map(p => p.svg).join("");
  }
  const translation = root.querySelector<HTMLElement>("[data-position]")!;
  const rotation = root.querySelector<HTMLElement>("[data-orientation]")!;
  ["X","Y","Z"].forEach((name,i) => slider(translation, name, i===2 ? 25 : -48, i===2 ? 95 : 48, position[i], " mm", v => { position[i]=v; draw(); }));
  ["Roll","Pitch","Yaw"].forEach((name,i) => slider(rotation, name, -180, 180, angles[i], "°", v => { angles[i]=v; draw(); }));
  buttonGroup(root.querySelector(".pose-modes")!, ["Position","Orientation"], "Cube controls", i => {
    translation.hidden = i !== 0;
    rotation.hidden = i !== 1;
  });
  draw();
}
