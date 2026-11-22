// All gallery poses use the same 132 × 100 drawing area. Progress runs from 0 to 1.
type Point = [number, number];
const tau = 2 * Math.PI;
const wave = (t: number) => (1 - Math.cos(t * tau)) / 2;
const sweep = (t: number) => 1 - Math.abs(2 * t - 1);
const shadow = (x: number, width: number) =>
  `<ellipse cx="${x}" cy="91" rx="${width}" ry="3" fill="#dbe3d6" stroke="none"/>`;
const pin = ([x,y]: Point, r: number) => `<circle cx="${x}" cy="${y}" r="${r}"/>`;

function rod(a: Point, b: Point, width: number, color: string) {
  const line = `x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"`;
  return `<line ${line} stroke-width="${width + 2}"/><line ${line} stroke="${color}" stroke-width="${width}"/>`;
}

// Locate a hinge between two fixed-length segments. The sign selects the bend direction.
function hinge(a: Point, b: Point, upper: number, lower: number, sign: number): Point {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const length = Math.hypot(dx, dy);
  const along = (upper * upper - lower * lower + length * length) / (2 * length);
  const across = sign * Math.sqrt(Math.max(0, upper * upper - along * along));
  return [a[0] + (along * dx - across * dy) / length, a[1] + (along * dy + across * dx) / length];
}

export function articulated(t: number) {
  const reach = sweep(t);
  return shadow(61,38) + `<path d="M30 82h34l5 8H23z"/>
    <g transform="rotate(${26 * reach} 46 76)">
      <path d="m40 79 6-34 9 1-5 34z"/>
      <g transform="rotate(${-42 * reach} 51 45)">
        <path d="m47 41 36-22 5 8-34 24z"/>
        <g transform="rotate(${48 * reach} 84 22)">
          <path d="m85 18 20 17-5 6-20-17z"/>
          <path d="m98 39 1 9 6 3m0-17 9 5-1 7" fill="none"/>
        </g>${pin([84,22],6)}
      </g>${pin([51,45],8)}
    </g>${pin([46,76],8)}`;
}

export function cartesian(t: number) {
  // Move each orthogonal slide in turn so the three directions are visible.
  const depthTravel = Math.hypot(19, 11);
  const distance = t * (34 + depthTravel + 13);
  const stroke = (start: number, length: number) =>
    sweep(Math.min(1, Math.max(0, (distance - start) / length)));
  const x = 34 * stroke(0, 34), depth = stroke(34, depthTravel), z = 13 * stroke(34 + depthTravel, 13);
  return shadow(67,45) + `<path d="m18 77 65 7 30-18-65-7z" fill="#d9e4d3"/>
    <path d="m22 76 27-16m32 22 27-16" stroke-width="3"/>
    <g transform="translate(${19 * depth} ${-11 * depth})">
      <path d="M23 75V31l6-3v46zm57 5V36l6-3v46z"/>
      <path d="m23 31 58 5 6-4-58-5zm0 0 58 5v8l-58-5z"/>
      <g transform="translate(${x} ${x * 5 / 58})">
        <g transform="translate(0 ${z})"><path d="M38 37h5v17l-2.5 5-2.5-5z" fill="#bd9670"/></g>
        <path d="m34 32 14 1v13l-14-1z"/>
      </g>
    </g>`;
}

export function scara(t: number) {
  const swing = sweep(t);
  const a = -.97 + 1.22 * swing, b = .65 - 1.64 * swing;
  const shoulder: Point = [40,43];
  const elbow: Point = [40 + 36 * Math.cos(a), 43 + 17 * Math.sin(a)];
  const tool: Point = [elbow[0] + 32 * Math.cos(b), elbow[1] + 15 * Math.sin(b)];
  const slide = 14 * Math.max(0, (swing - .7) / .3);
  return shadow(60,41) + `<ellipse cx="40" cy="84" rx="17" ry="4"/><path d="M29 81V43q11-8 22 0v38q-11 6-22 0z"/>` +
    rod(shoulder,elbow,9,"#97b199") + rod(elbow,tool,7,"#c4d5bd") +
    pin(shoulder,6) + pin(elbow,5) +
    `<g transform="translate(${tool[0]} ${tool[1]})"><path d="M0 0v${16 + slide}" stroke-width="3"/><rect x="-4" y="-4" width="8" height="12" rx="2"/><path d="m-3 ${15 + slide} 3 5 3-5" fill="none"/></g>`;
}

export function delta(t: number) {
  const x = 66 - 14 * Math.cos(t * tau), y = 66 + 7 * Math.cos(2 * t * tau);
  const pivots: Point[] = [[64,31],[31,28],[99,28]];
  const offsets = [0,-6,6];
  const struts = pivots.map((pivot,i) => {
    const end: Point = [x + offsets[i], y];
    const mid = hinge(pivot, end, 24, 47, i === 2 ? -1 : 1);
    return rod(pivot,mid,4,"#8ea994") +
      `<path d="M${mid}L${end}m3 0L${mid[0]+3} ${mid[1]}" fill="none" stroke-width="1.6"/>` + pin(mid,2.5);
  }).join("");
  return shadow(66,35) + struts + `<path d="m23 21 41-12 43 12-42 13z"/><path d="m23 21 42 13 42-13v7L65 41 23 28z"/>
    <ellipse cx="${x}" cy="${y}" rx="10" ry="4"/><path d="M${x-2} ${y+4}v7h4v-7" fill="#bd9670"/>`;
}

export function wheeled(t: number) {
  // Overhead view. The wheels turn at different rates on a constant-radius bend.
  const angle = tau * t;
  const x = 66 + 26 * Math.sin(angle), y = 50 + 26 * Math.cos(angle);
  function wheel(y: number, phase: number) {
    const offset = (phase * t) % 4;
    const tread = [0,4,8,12].map(n => `M${-8 + n + offset} ${y + 1}v4`).join(" ");
    return `<rect x="-10" y="${y}" width="20" height="6" rx="2" fill="#667c6c"/><path d="${tread}" stroke="#c4d4c3" stroke-width="1.2"/>`;
  }
  return `<circle cx="66" cy="50" r="26" stroke="#a3b49e" stroke-dasharray="3 5" fill="none"/>
    <g transform="translate(${x} ${y}) rotate(${-angle * 180 / Math.PI})">
      ${wheel(-16,80)}${wheel(10,244)}
      <rect x="-18" y="-11" width="36" height="22" rx="5"/>
      <rect x="-13" y="-7" width="16" height="14" rx="1" fill="#d1b38d"/><path d="M-5-6V6m17-10v8"/>
    </g>`;
}

// During stance the foot stays planted as the body moves over it. During swing it lifts.
function foot(hipX: number, floor: number, phase: number, stride: number, lift: number): Point {
  const p = phase % 1;
  if (p < .5) return [hipX + stride * (.25 - p), floor];
  const swing = (p - .5) * 2;
  return [hipX + stride * (-.25 + .5 * swing), floor - lift * Math.sin(Math.PI * swing)];
}

function leg(hip: Point, toe: Point, length: number, bend: number, color: string) {
  const knee = hinge(hip, toe, length, length, bend);
  return rod(hip,knee,4,color) + rod(knee,toe,3,color) + pin(knee,2.4) +
    `<path d="M${toe}h4" stroke-width="3"/>`;
}

// Track the walking robot with the camera. Floor marks move one stride per gait cycle.
function ground(phase: number, stride: number) {
  const offset = (phase % 1) * stride;
  return `<path d="M0 91h132" stroke="#bdc9b8"/>
    <path d="M${-offset} 93h${132 + stride}" stroke="#a3b49e" stroke-dasharray="2 ${stride - 2}"/>`;
}

export function quadruped(t: number) {
  const phase = t * 2, bob = 1.1 * Math.sin(phase * tau * 2);
  function pair(far: boolean) {
    return [0,1].map(i => {
      const x = 31 + 32*i + (far ? 4 : 0);
      const offset = (i + Number(far)) % 2 * .5;
      return leg([x,59 + bob],foot(x,far ? 84 : 89,phase + offset,20,8),17,i ? 1 : -1,far ? "#829884" : "#b2c8ad");
    }).join("");
  }
  return `${ground(phase,20)}<g transform="translate(11 0)">${pair(true)}
    <g transform="translate(0 ${bob})"><path d="m24 46 10-7 36 3-2 17-9 4-34-4z"/><path d="m64 47 8-13 12 3 2 9-15 5z"/><circle cx="80" cy="40" r="1.5" fill="#395342"/></g>
    ${pair(false)}</g>`;
}

export function drone(t: number) {
  const flight = wave(t), drift = 10 * Math.sin(t * tau) * flight;
  const rotors = [[34,35],[94,31],[31,61],[99,59]].map(([x,y],i) => {
    const angle = (i % 2 ? -1 : 1) * t * tau * 10 + i;
    const dx = 14 * Math.cos(angle), dy = 5 * Math.sin(angle);
    return `<ellipse cx="${x}" cy="${y}" rx="15" ry="5.8" fill="none" stroke="#a0b49e" stroke-width="1"/>
      <path d="M${x-dx} ${y-dy}l${2*dx} ${2*dy}" stroke-width="2.8"/>`;
  }).join("");
  return shadow(66+drift,35-8*flight) + `<g transform="translate(${drift} ${12-26*flight}) rotate(${-4*Math.sin(t*tau)} 66 47)">
    <path d="m63 47-29-12m32 15 28-19m-31 18-32 12m34-12 34 10" fill="none" stroke-width="4"/>
    ${rotors}<path d="m52 46 12-7 16 6-2 13-12 6-15-7z"/><path d="m59 60-3 15m16-15 6 13" fill="none"/><circle cx="68" cy="56" r="4" fill="#586f60"/></g>`;
}

export function humanoid(t: number) {
  const phase = t * 2, bob = Math.cos(phase * tau * 2);
  const swing = Math.cos(phase * tau);
  return `${ground(phase,22.5)}<g transform="translate(62 0)">
    ${leg([3,56+bob],foot(3,86,phase+.5,22.5,8),18,-1,"#809784")}
    <g transform="translate(0 ${bob})">
      <g transform="rotate(${-24*swing} 3 34)"><path d="m3 34 0 15 9 6" fill="none" stroke-width="4"/></g>
      <rect x="-5" y="11" width="16" height="15" rx="4"/><path d="M3 17h7"/>
      <path d="m-8 32 5-4h12l4 6-4 19-5 6-9-4z"/>
    </g>
    ${leg([-2,56+bob],foot(-2,90,phase,22.5,9),18,-1,"#b5cbb1")}
    <g transform="rotate(${24*swing} -4 ${34+bob})"><path d="M-4 ${34+bob}l-3 14 9 7" fill="none" stroke-width="5"/>${pin([-4,34+bob],3.5)}</g>
    </g>`;
}
