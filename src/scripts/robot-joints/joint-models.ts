type Point = [number, number];
type Vector = [number, number, number];
type Motion = [name: string, min: number, max: number, start: number, unit: string, caption: string];
export type MotionSelection = number | "together";
type JointModel = {
  combinedCaption?: string;
  name: string;
  motions: Motion[];
  draw: (values: number[], motion: MotionSelection) => string;
};

const rad = Math.PI / 180;
const ink = "#405b48", support = "#c4d4bd", link = "#91ad98", brass = "#e4b780";
const centre: Point = [0, 0];

// A dashed centreline marks an axis. Solid arrows trace either travel or a rotation.
function axis([x,y]: Point) {
  return `<path class="joint-axis-line" d="M ${-x} ${-y} L ${x} ${y}"/>`;
}
function arrow(points: Point[]) {
  function head([x,y]: Point, [u,v]: Point) {
    const angle = Math.atan2(y-v,x-u);
    const wing = (offset: number) => [x-3.4*Math.cos(angle+offset), y-3.4*Math.sin(angle+offset)];
    return `<polyline points="${wing(-.53)} ${[x,y]} ${wing(.53)}"/>`;
  }
  const last = points.length-1;
  return `<g class="joint-motion-arrow"><polyline points="${points.join(" ")}"/>
    ${head(points[0],points[1])}${head(points[last],points[last-1])}</g>`;
}
function arc(pointAt: (angle: number) => Point, from: number, to: number) {
  return arrow(Array.from({length:37}, (_,i) => pointAt((from+(to-from)*i/36)*rad)));
}

function bar([x,y]: Point, [u,v]: Point, width: number, fill: string) {
  const line = `x1="${x}" y1="${y}" x2="${u}" y2="${v}" stroke-linecap="round"`;
  return `<line ${line} stroke="${ink}" stroke-width="${width}"/><line ${line} stroke="${fill}" stroke-width="${width-3}"/>`;
}
function disc([x,y]: Point, r: number, fill: string) {
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;
}
function pin(p: Point) {
  return disc(p, 8, brass) + disc(p, 2.5, ink);
}
function foot(x: number, y: number) {
  return `<path d="M ${x} ${y-8} l -12 20 h 24 Z" fill="${support}"/>`;
}
function hinge([angle]: number[]) {
  const tip: Point = [65*Math.cos(angle*rad), -65*Math.sin(angle*rad)];
  return foot(-54, 5) + bar([-54, 0], centre, 18, support) +
    bar(centre, tip, 14, link) + disc(tip, 4, brass) + pin(centre) +
    `<circle class="joint-axis-end" r="4"/><circle class="joint-axis-dot" r="1.25"/>` +
    arc(a=>[31*Math.cos(a),-31*Math.sin(a)],-58,58);
}
function slide([travel]: number[]) {
  const x = (travel-30)*1.55;
  return foot(-69, 7) + foot(69, 7) +
    `<rect x="-72" y="-4" width="144" height="8" rx="1" fill="${support}"/>
     <g transform="translate(${x} 0)">
       <rect x="-16" y="-13" width="32" height="26" rx="3" fill="${link}"/>
       <path d="M-15 6h30" fill="none"/>${disc([0,-3], 3, brass)}
     </g>` + axis([88,0]) + arrow([[-46,-23],[46,-23]]);
}

// Look slightly along the shaft so a full turn traces an ellipse on the page.
const endView = .38;
function rimPoint(x: number, radius: number, phase: number): Point {
  return [x - endView*radius*Math.sin(phase), -radius*Math.cos(phase)];
}
function cylinder(x: number, width: number, r: number, colour: string) {
  const depth = r*endView;
  return `<path d="M ${x} ${-r} h ${width} a ${depth} ${r} 0 0 1 0 ${2*r} h ${-width} a ${depth} ${r} 0 0 1 0 ${-2*r} Z" fill="${colour}"/>
    <ellipse cx="${x+width}" cy="0" rx="${depth}" ry="${r}" fill="${colour}"/>`;
}
function nut(x: number, angle: number) {
  const ends = [-10,10].map(offset => Array.from({length:6}, (_,i) =>
    rimPoint(x+offset, 18, angle+i*Math.PI/3)));
  const face = (points: Point[]) => `<polygon points="${points.join(" ")}" fill="${link}"/>`;
  let sides = "";
  for (let i=0; i<6; i++) {
    const next = (i+1)%6;
    if (Math.sin(angle+(i+.5)*Math.PI/3)>0) {
      sides += face([ends[0][i], ends[1][i], ends[1][next], ends[0][next]]);
    }
  }
  return sides + face(ends[1]);
}
const pitch = 24;
function shaft(from: number, threaded: boolean) {
  let drawing = cylinder(from,72-from,6,support);
  if (!threaded) return drawing;
  for (let start=-72; start+pitch/2<=72; start+=pitch) {
    const first = Math.max(0, (from-start)*2/pitch);
    if (first>=1) continue;
    const points = Array.from({length:13}, (_,i) => {
      const t = first+(1-first)*i/12;
      return rimPoint(start+pitch*t/2,6,Math.PI*t);
    });
    drawing += `<polyline points="${points.join(" ")}" fill="none" stroke-width="1"/>`;
  }
  return drawing;
}
function sleeve(x: number, angle: number, movement: "slide" | "spin" | "screw" | "together") {
  const threaded = movement==="screw";
  const a = angle*rad;
  const handle = bar(rimPoint(x,13,a), rimPoint(x,35,a), 6, link) + disc(rimPoint(x,35,a),4,brass);
  const collar = threaded ? nut(x,a) : cylinder(x-11,22,14,link);
  // The exposed shaft continues through the near face of the nut or sleeve.
  const exposed = shaft(x+(threaded ? 10 : 11),threaded);
  const behind = Math.sin(a)<0;
  const travel = movement!=="spin" ? arrow([[-30,27],[30,27]]) : "";
  const spin = movement==="slide" ? "" : arc(t=>rimPoint(58,18,t), -45,205);
  return `<g transform="rotate(-8)">${behind ? handle : ""}${shaft(-72,threaded)}${collar}${exposed}${behind ? "" : handle}${axis([88,0])}${travel}${spin}</g>`;
}

// Both intersecting hinge axes and the ball centre stay fixed in this view.
function project([x,y,z]: Vector): Point {
  return [.88*x-.48*z, .19*x-.92*y+.35*z];
}
function rotateZ([x,y,z]: Vector, a: number): Vector {
  return [x*Math.cos(a)-y*Math.sin(a), x*Math.sin(a)+y*Math.cos(a), z];
}
function rotateY([x,y,z]: Vector, a: number): Vector {
  return [x*Math.cos(a)+z*Math.sin(a), y, -x*Math.sin(a)+z*Math.cos(a)];
}
function universal([first,second]: number[], motion: MotionSelection) {
  const pivot = (p: Vector) => project(rotateZ(p,first*rad));
  const output = (p: Vector) => pivot(rotateY(p,second*rad));
  const rear = project([0,0,-13]), front = project([0,0,13]);
  const base = project([-34,0,0]), end = output([33,0,0]);
  const upper = pivot([0,13,0]), lower = pivot([0,-13,0]);
  const guide = motion==="together" ? axis(project([0,0,65])) + axis(pivot([0,55,0]))
    : motion===0 ? axis(project([0,0,65])) + arc(a=>project(rotateZ(rotateY([76,0,0],second*rad),a)),-32,32)
    : axis(pivot([0,55,0])) + arc(a=>pivot(rotateY([76,0,0],a)),-32,32);
  return bar(project([-75,0,0]),base,14,support) + bar(base,rear,10,support) +
    bar(rear,front,7,brass) + bar(upper,lower,7,brass) +
    bar(upper,end,9,link) + bar(lower,end,9,link) + bar(end,output([76,0,0]),13,link) +
    disc(upper,4,brass) + disc(lower,4,brass) + bar(base,front,10,support) + disc(front,4,brass) + guide;
}
function rotateX([x,y,z]: Vector, a: number): Vector {
  return [x, y*Math.cos(a)-z*Math.sin(a), y*Math.sin(a)+z*Math.cos(a)];
}
function spherical([side,forward,twist]: number[], motion: MotionSelection) {
  const tilted = (p: Vector) => project(rotateZ(p,side*rad));
  const stem = (p: Vector) => tilted(rotateX(p,forward*rad));
  const tip = stem([0,51,0]), tab = stem(rotateY([16,51,0],twist*rad));
  let guide: string;
  switch (motion) {
    case "together":
      guide = axis(project([0,0,65])) + axis(tilted([61,0,0])) + axis(stem([0,65,0]));
      break;
    case 0:
      guide = axis(project([0,0,65])) + arc(a=>project(rotateZ(rotateX([0,51,0],forward*rad),a)),-42,42);
      break;
    case 1:
      guide = axis(tilted([61,0,0])) + arc(a=>tilted(rotateX([0,51,0],a)),-42,42);
      break;
    default:
      guide = axis(stem([0,65,0])) + arc(a=>stem(rotateY([16,51,0],a)),-155,155);
  }
  return foot(0,30) + bar([0,28],centre,14,support) + disc(centre,17,link) +
    bar(centre,tip,10,link) + bar(tip,tab,5,brass) + disc(tab,3,brass) +
    `<path d="M -21 0 Q 0 10 21 0 Q 19 24 0 25 Q -19 24 -21 0 Z" fill="${support}"/>` + guide;
}

export const models: JointModel[] = [
  {name:"Revolute", motions:[
    ["Swing",-65,65,20,"°","The dot in the ring marks the pin axis pointing towards you. The link swings around it in the plane of the page."],
  ], draw:hinge},
  {name:"Prismatic", motions:[
    ["Slide",0,60,20," mm","The dashed line runs through the centre of the rail. The carriage slides along this axis and keeps the same orientation."],
  ], draw:slide},
  {name:"Helical", motions:[
    ["Turn and advance",-540,540,-120,"°","The nut turns around the screw axis and slides along it at the same time. One full turn advances it 12 mm."],
  ], draw:([angle])=>sleeve(pitch*angle/360,angle,"screw")},
  {name:"Cylindrical", combinedCaption:"The sleeve slides along the shaft while the brass handle turns around it. You can adjust the distance and angle independently.", motions:[
    ["Slide",0,60,25," mm","The sleeve slides along the dashed shaft axis. The brass handle keeps its angle."],
    ["Spin",-180,180,20,"°","The handle turns around the same shaft axis. The sleeve stays at the same position along the shaft."],
  ], draw:([travel,angle],motion)=>sleeve((travel-30)*1.55,angle,motion==="together" ? "together" : motion===0 ? "slide" : "spin")},
  {name:"Universal", combinedCaption:"Both hinges bend at once. Follow the tip of the right shaft as it swings around the two crossed pin axes.", motions:[
    ["First hinge",-32,32,8,"°","The dashed line passes through the pin held by the left fork. The right shaft swings around that pin."],
    ["Second hinge",-32,32,12,"°","The dashed line now follows the crosswise pin. The right shaft bends around this second axis, perpendicular to the first."],
  ], draw:universal},
  {name:"Spherical", combinedCaption:"The stem tilts sideways and forwards while the brass tab twists around the stem. All three rotations share the ball’s centre.", motions:[
    ["Side tilt",-42,42,12,"°","The stem tilts sideways around the front-to-back axis through the ball’s centre."],
    ["Forward tilt",-42,42,12,"°","The stem tilts forwards and backwards around the crosswise axis through the ball’s centre. This axis follows the side tilt."],
    ["Twist",-180,180,10,"°","The dashed line runs along the tilted stem. The brass tab circles this axis while the stem keeps its direction."],
  ], draw:spherical},
];
