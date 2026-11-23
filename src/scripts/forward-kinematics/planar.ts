import { buttonGroup, diagram, slider } from "../robot-shapes/controls";

type Point = [number, number];
type PlanarDemo = "one" | "builder" | "calculator" | "frames";
const radians = Math.PI / 180;
const origin: Point = [0, 0];
const round = (v: number) => Number(v.toFixed(2));
const pair = ([x, y]: Point) => `(${round(x)}, ${round(y)}) cm`;

// Keep positions in centimetres with positive Y up until the drawing step.
function displacement(length: number, degrees: number): Point {
  return [length * Math.cos(degrees*radians), length * Math.sin(degrees*radians)];
}
function add([x,y]: Point, [dx,dy]: Point): Point { return [x+dx,y+dy]; }

function axes(size: number, frame = "", rotation = 0) {
  const start = frame === "B" ? -8 : -size;
  const label = (name: string, x: number, y: number) =>
    `<text transform="translate(${x} ${y}) rotate(${rotation})">${name}<tspan dy="2" font-size="7">${frame}</tspan></text>`;
  return `<path d="M${start} 0 H${size} l-4 -2 m4 2 -4 2 M0 ${-start} V${-size} l-2 4 m2 -4 2 4"/>
    ${label("X",size-4,13)}${label("Y",5,-size+7)}`;
}
function angleArc(pivot: Point, reference: number, bend: number, r = 19) {
  const angle = -bend*radians;
  return `<g transform="translate(${pivot}) rotate(${-reference})" class="fk-angle">
    <path d="M7 0 H${r+12}" stroke-dasharray="2 2"/>
    <path d="M${r} 0 A${r} ${r} 0 0 ${bend < 0 ? 1 : 0} ${r*Math.cos(angle)} ${r*Math.sin(angle)}"/></g>`;
}
type Segment = [Point, Point];
type LabelBox = { x: number; y: number; w: number; h: number }; // Centre and half-extents.

function crossesLabel([[ax,ay],[bx,by]]: Segment, box: LabelBox, padding: number) {
  const x = box.x-(ax+bx)/2, y = box.y-(ay+by)/2;
  const dx = (bx-ax)/2, dy = (by-ay)/2;
  const w = box.w+padding, h = box.h+padding;
  // Separating axes for a line segment and a horizontal label rectangle.
  return Math.abs(x)<=w+Math.abs(dx) && Math.abs(y)<=h+Math.abs(dy) &&
    Math.abs(x*dy-y*dx)<=w*Math.abs(dy)+h*Math.abs(dx);
}

function jointAnnotations(elbow: Point, tip: Point, angles: number[], two: boolean, halfWidth: number, halfHeight: number) {
  const upperLength = Math.hypot(...elbow);
  const lowerLength = Math.hypot(tip[0]-elbow[0],tip[1]-elbow[1]);
  const links: Segment[] = [[origin,elbow]];
  const joints = [{pivot:origin, reference:0, bend:angles[0], radius:Math.min(23,upperLength*.46)}];
  if (two) {
    links.push([elbow,tip]);
    joints.push({pivot:elbow, reference:angles[0], bend:angles[1], radius:Math.min(21,upperLength*.46,lowerLength*.46)});
  }
  const guides: Segment[] = [
    [[-halfWidth,0],[halfWidth,0]], [[0,-halfHeight],[0,halfHeight]],
    [[0,tip[1]],tip], [tip,[tip[0],0]],
  ];
  for (const {pivot,reference,radius} of joints) {
    const [dx,dy] = displacement(radius+12,reference);
    guides.push([pivot,[pivot[0]+dx,pivot[1]-dy]]);
  }
  const occupied: LabelBox[] = [];
  return joints.map(({pivot,reference,bend,radius},i) => {
    const label = `${i===0 ? "θ₁" : "θ₂"} = ${bend}°`;
    const bisector = (reference+bend/2)*radians;
    const arcX = pivot[0]+radius*Math.cos(bisector), arcY = pivot[1]-radius*Math.sin(bisector);
    const w = label.length*2.9+1, h = 6;
    // Prefer the open side of the arc. Try nearby positions when the arm folds across it.
    function place(): LabelBox {
      for (const gap of [7,14,24,40,60]) {
        for (const offset of [0,30,-30,60,-60,90,-90,120,-120,150,-150,180]) {
          const direction = bisector+offset*radians;
          const box = {x:arcX+(gap+w)*Math.cos(direction), y:arcY-(gap+h)*Math.sin(direction), w,h};
          if (Math.abs(box.x)+w+3>halfWidth || Math.abs(box.y)+h+3>halfHeight) continue;
          if (links.some(link=>crossesLabel(link,box,8))) continue;
          if (guides.some(guide=>crossesLabel(guide,box,1.5))) continue;
          if (occupied.some(b=>Math.abs(b.x-box.x)<b.w+w+3 && Math.abs(b.y-box.y)<b.h+h+3)) continue;
          return box;
        }
      }
      return {x:0,y:(i===0 ? -1 : 1)*(halfHeight-14),w,h};
    }
    const box = place();
    occupied.push(box);
    return `<g class="fk-joint-angle fk-joint-angle-${i+1}">${angleArc(pivot,reference,bend,radius)}
      <text x="${box.x}" y="${box.y}" dominant-baseline="middle" text-anchor="middle">${label}</text></g>`;
  }).join("");
}
function linkShape(start: Point, length: number, angle: number, i: number) {
  return `<g transform="translate(${start}) rotate(${-angle})" class="drawn-arm fk-link-${i}">
    <rect x="0" y="-5" width="${length}" height="10" rx="4"/>
    </g>`;
}
function pin([x,y]: Point) {
  return `<g class="drawn-arm" transform="translate(${x} ${y})"><circle r="7" fill="#e4b780"/><circle r="2" fill="#536a54" stroke="none"/></g>`;
}
function gripper([x,y]: Point, heading: number) {
  return `<g class="drawn-arm" transform="translate(${x} ${y}) rotate(${-heading})">
    <path d="m-5 -2 4 -4h6m-10 8 4 4h6" fill="none"/><circle r="2.6" fill="#e4b780"/></g>`;
}

export function planarDemo(root: HTMLElement, mode: PlanarDemo) {
  const one = mode === "one", building = mode === "builder", frames = mode === "frames";
  const lengths = [10,8], angles = [30,45];
  const base: Point = frames ? [4,-3] : [0,0];
  let baseAngle = frames ? 25 : 0, inBase = false, two = !one && !building;
  // Frame each workspace once so the zoom stays fixed as the joints move.
  const halfHeight = mode === "calculator" ? 144 : frames ? 134 : 128;
  const halfWidth = one ? 151 : halfHeight + 5;
  const scale = one ? 10.5 : frames ? 5.3 : building ? 6.5 : 6;
  const screen = ([x,y]: Point): Point => [x*scale,-y*scale];
  const title = frames ? "World and base coordinate frames with a two-link arm" : "Planar robot arm with Cartesian coordinates";
  root.innerHTML = diagram(`${-halfWidth} ${-halfHeight} ${2*halfWidth} ${2*halfHeight}`,title,
    `<g class="fk-axes">${axes(halfHeight-14,frames ? "W" : "")}</g><g data-planar></g>`) +
    '<div class="fk-modes"></div><div class="shape-sliders"></div><div class="fk-readout"></div>';
  const drawing = root.querySelector("[data-planar]")!;
  const controls = root.querySelector<HTMLElement>(".shape-sliders")!;
  const modes = root.querySelector<HTMLElement>(".fk-modes")!;
  const readout = root.querySelector<HTMLElement>(".fk-readout")!;

  function draw() {
    const heading = angles[0]+(two ? angles[1] : 0);
    const first = displacement(lengths[0],angles[0]);
    const second = two ? displacement(lengths[1],heading) : origin;
    const localTip = add(first,second);
    const worldTip = add(base,add(displacement(lengths[0],angles[0]+baseAngle),
      displacement(two ? lengths[1] : 0,heading+baseAngle)));
    const elbow = screen(first), tip = screen(localTip);
    const [x,y] = tip;
    const baseTransform = `translate(${screen(base)}) rotate(${-baseAngle})`;
    const guides = (point: Point) => `<path class="fk-projections" d="M0 ${point[1]} H${point[0]} V0"/>`;
    const corner = Math.min(6,Math.abs(x)/2,Math.abs(y)/2);
    const componentLabels = Math.abs(x)>32 && Math.abs(y)>22
      ? `<g class="fk-dimensions"><text x="${x/2}" y="${y<0 ? 14 : -8}" text-anchor="middle">x = ${round(localTip[0])}</text>
        <text x="${x+Math.sign(x)*6}" y="${y/2}" text-anchor="${x>0 ? "start" : "end"}">y = ${round(localTip[1])}</text></g>` : "";
    // Offset the length label to the outside of the triangle.
    const normal = Math.sign(x*y) || 1;
    const lengthLabel = `<text class="fk-length" text-anchor="middle" x="${x/2-normal*y*.17}" y="${y/2+normal*x*.17}">10 cm</text>`;
    const triangle = `<path d="M0 0 H${x} V${y} Z" fill="#dee8d6"/>
      <path class="fk-horizontal" d="M0 0 H${x}"/><path class="fk-vertical" d="M${x} 0 V${y}"/>
      <path d="M${x-Math.sign(x)*corner} 0 v${Math.sign(y)*corner} h${Math.sign(x)*corner}" fill="none" stroke="#86613b"/>${componentLabels}`;
    const baseAxes = frames ? `<g class="fk-axes fk-base-axes">${axes(46,"B",baseAngle)}</g>` : "";
    const worldGuide = frames && !inBase ? guides(screen(worldTip)) : "";
    const annotate = building || mode === "calculator";
    const annotations = annotate ? jointAnnotations(elbow,tip,angles,two,halfWidth,halfHeight) : "";
    drawing.innerHTML = worldGuide + `<g transform="${baseTransform}">${one ? triangle : !frames || inBase ? guides(tip) : ""}
      ${annotations}${baseAxes}${one ? angleArc(origin,0,angles[0]) : ""}<path d="m-10 11 7-14h6l7 14z" fill="#bdd0b6" stroke="#526b54"/>
      ${linkShape(origin,lengths[0]*scale,angles[0],1)}${two ? linkShape(elbow,lengths[1]*scale,heading,2) : ""}
      ${pin(origin)}${two ? pin(elbow) : ""}${gripper(tip,heading)}${one ? lengthLabel : ""}</g>`;

    if (mode === "calculator") {
      const equations = ["cos","sin"].map((fn,i) => {
        const term = (n: number, label: string) => `<span class="fk-term fk-link-${n}">${label}</span>`;
        return `<div><b>${i ? "y" : "x"}</b> = ${term(1,`L₁ ${fn}(θ₁)`)} + ${term(2,`L₂ ${fn}(θ₁ + θ₂)`)}
          <div class="fk-substitution">= ${term(1,`${lengths[0]} ${fn}(${angles[0]}°)`)} + ${term(2,`${lengths[1]} ${fn}(${heading}°)`)}<br>
          ≈ ${term(1,String(round(first[i])))} + ${term(2,String(round(second[i])))} ≈ <strong>${round(localTip[i])} cm</strong></div></div>`;
      });
      readout.innerHTML = equations.join("") + `<b>Gripper · (X, Y) = ${pair(localTip)}</b>`;
    } else if (frames) {
      readout.textContent = `Gripper in the ${inBase ? "base" : "world"} frame · (X, Y) = ${pair(inBase ? localTip : worldTip)}`;
    } else {
      readout.textContent = `${two ? "Gripper" : "Tip"} · (X, Y) = ${pair(localTip)}` +
        (two ? ` · Second link heading θ₁ + θ₂ = ${heading}°` : "");
    }
  }

  if (frames) {
    buttonGroup(modes,["World frame","Base frame"],"Report gripper coordinates in",i => { inBase = i===1; draw(); });
    ["Base X","Base Y"].forEach((name,i) => slider(controls,name,-6,6,base[i]," cm",v => { base[i]=v; draw(); }));
    slider(controls,"Base rotation",-180,180,baseAngle,"°",v => { baseAngle=v; draw(); });
  } else {
    function setAngle(i: number, value: number) {
      angles[i] = value;
      if (building) root.dataset.driver = i===0 ? "shoulder" : "elbow";
      draw();
    }
    slider(controls,one ? "Joint angle θ" : "Shoulder angle θ₁",-180,180,angles[0],"°",v => setAngle(0,v));
    if (!one) {
      const elbow = slider(controls,"Elbow angle θ₂",-180,180,angles[1],"°",v => setAngle(1,v));
      if (building) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "robot-button secondary";
        modes.append(button);
        function updateBuilder() {
          root.dataset.driver = "shoulder";
          elbow.hidden = !two;
          button.textContent = two ? "Remove elbow joint" : "Add elbow joint";
          draw();
        }
        button.addEventListener("click",() => { two=!two; updateBuilder(); });
        updateBuilder();
      }
    }
    if (mode === "calculator") {
      ["First link L₁","Second link L₂"].forEach((name,i) =>
        slider(controls,name,3,11,lengths[i]," cm",v => { lengths[i]=v; draw(); }));
    }
  }
  draw();
}
