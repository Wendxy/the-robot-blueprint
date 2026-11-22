import { diagram, slider } from "./controls";
import { project, type Vector } from "./projection";

const radians = Math.PI / 180;
const grid: string[] = [];
for (let v = -96; v <= 96; v += 16) {
  grid.push(segment([-96,v,0], [96,v,0]), segment([v,-96,0], [v,96,0]));
}

function segment(a: Vector, b: Vector) {
  return `<polyline points="${project(a).join(",")} ${project(b).join(",")}"/>`;
}

function orbit(pointAt: (angle: number) => Vector) {
  const points = Array.from({ length: 73 }, (_, i) => project(pointAt(i * Math.PI / 36)).join(","));
  return `<polyline points="${points.join(" ")}"/>`;
}

function offset(origin: Vector, direction: Vector, distance: number): Vector {
  return [origin[0] + direction[0]*distance, origin[1] + direction[1]*distance, origin[2] + direction[2]*distance];
}

function marker(p: Vector, label: string, active: boolean) {
  const [x,y] = project(p);
  return `<g transform="translate(${x} ${y})"><circle r="5" fill="${active ? "#ddb17c" : "#b2c7ab"}" stroke="#3f5843" stroke-width="1.6"/><text class="diagram-label point-label" x="8" y="-6">${label}</text></g>`;
}

export function rigidBody(root: HTMLElement) {
  root.innerHTML = diagram("0 -20 400 235", "Three-dimensional construction of a rigid triangle", `<g class="point-grid">${grid.join("")}</g><g data-construction></g>`) +
    '<p class="shape-caption" aria-live="polite" data-step></p><div class="shape-sliders"></div><div class="shape-control-row"><button class="robot-button" type="button" data-place></button><button class="robot-button secondary" type="button" data-back>Back</button></div>';
  const drawing = root.querySelector("[data-construction]")!;
  const controls = root.querySelector<HTMLElement>(".shape-sliders")!;
  const next = root.querySelector<HTMLButtonElement>("[data-place]")!;
  const back = root.querySelector<HTMLButtonElement>("[data-back]")!;
  const a: Vector = [-12,6,45];
  let azimuth = -30, elevation = 20, twist = 60, step = 0;
  const notes = [
    "Point A · Use three coordinates to place the first point in space.",
    "Point B · Choose two angles on the sphere. Its radius keeps AB fixed.",
    "Point C · Choose one angle around AB. Every point on the ring preserves both AC and BC.",
    "3 + 2 + 1 = 6 DOF · These three fixed points determine the pose of the whole body.",
  ];
  function draw() {
    const az = azimuth * radians, el = elevation * radians;
    const axis: Vector = [Math.cos(el)*Math.cos(az), Math.cos(el)*Math.sin(az), Math.sin(el)];
    const b = offset(a, axis, 48);
    const middle = offset(a, axis, 24);
    // Two perpendicular unit vectors span the plane normal to AB.
    const side: Vector = [-Math.sin(az), Math.cos(az), 0];
    const up: Vector = [-Math.sin(el)*Math.cos(az), -Math.sin(el)*Math.sin(az), Math.cos(el)];
    const pointC = (t: number) => offset(offset(middle, side, 33*Math.cos(t)), up, 33*Math.sin(t));
    const c = pointC(twist*radians);
    let guide = "";
    if (step === 0) {
      const axes: [string, Vector][] = [["X", [84,0,0]], ["Y", [0,84,0]], ["Z", [0,0,100]]];
      guide = axes.map(([name, tip]) => {
        const [x,y] = project(tip);
        return `<g class="point-drop">${segment([0,0,0],tip)}</g><text class="diagram-label" x="${x+4}" y="${y-4}">${name}</text>`;
      }).join("");
    }
    if (step === 1) {
      const [x,y] = project(a);
      // Projecting a sphere with these orthogonal camera rows gives an ellipse.
      guide = `<ellipse cx="${x}" cy="${y}" rx="${48*Math.hypot(.86,.86)}" ry="${48*Math.hypot(.36,.36,.87)}" fill="#e3eadc" fill-opacity=".65" stroke="#91a78d"/>`;
      const equator = orbit(t => offset(a,[Math.cos(t),Math.sin(t),0],48));
      const meridian = orbit(t => offset(a,[Math.cos(t)*Math.cos(az),Math.cos(t)*Math.sin(az),Math.sin(t)],48));
      guide += `<g class="point-locus">${equator}${meridian}</g>`;
    } else if (step === 2) {
      guide = `<g class="point-locus">${orbit(pointC)}</g>`;
    }
    const triangle = step >= 2 ? `<polygon points="${[a,b,c].map(v => project(v).join(",")).join(" ")}" fill="#b8cbac" fill-opacity=".55" stroke="#566e55" stroke-width="2"/>` : "";
    drawing.innerHTML = guide + triangle +
      `<g class="point-drop">${segment([a[0],a[1],0],a)}</g>` +
      (step >= 1 ? `<g class="point-edge">${segment(a,b)}</g>` : "") +
      marker(a,"A",step === 0) + (step >= 1 ? marker(b,"B",step === 1) : "") +
      (step >= 2 ? marker(c,"C",step === 2) : "");
  }
  function stage() {
    controls.replaceChildren();
    controls.hidden = step === 3;
    if (step === 0) {
      ["X","Y","Z"].forEach((name,i) => slider(controls, name, i === 2 ? 35 : -24, i === 2 ? 65 : 24, a[i], " mm", v => { a[i] = v; draw(); }));
    } else if (step === 1) {
      slider(controls, "Azimuth", -180, 180, azimuth, "°", v => { azimuth = v; draw(); });
      slider(controls, "Elevation", -90, 90, elevation, "°", v => { elevation = v; draw(); });
    } else if (step === 2) {
      slider(controls, "Angle around AB", -180, 180, twist, "°", v => { twist = v; draw(); });
    }
    root.querySelector("[data-step]")!.textContent = notes[step];
    next.textContent = ["Fix point A", "Fix point B", "Fix point C", "Start again"][step];
    back.hidden = step === 0;
    draw();
  }
  next.addEventListener("click", () => {
    step = (step + 1) % 4;
    if (step === 0) {
      a.splice(0, 3, -12, 6, 45);
      azimuth = -30; elevation = 20; twist = 60;
    }
    stage();
    controls.querySelector("input")?.focus({ preventScroll: true });
  });
  back.addEventListener("click", () => {
    step--;
    stage();
    controls.querySelector("input")?.focus({ preventScroll: true });
  });
  stage();
}
