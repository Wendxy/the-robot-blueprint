import { diagram, slider } from "../robot-shapes/controls";

function ray(angle: number, length: number) {
  const theta = angle * Math.PI / 180;
  return { x: -length*Math.sin(theta), y: -length*Math.cos(theta) };
}
function dial(limited: boolean) {
  const ticks = [];
  for (let angle = -150; angle <= 180; angle += 30) {
    const a = ray(angle,66), b = ray(angle,71);
    ticks.push(`<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"/>`);
  }
  const stops = limited ? '<g fill="#bd9f7c" stroke="#755d42"><rect x="-62" y="4" width="13" height="7" rx="1"/><rect x="49" y="4" width="13" height="7" rx="1"/></g>' : "";
  return diagram("-105 -92 210 184",limited ? "Revolute joint with two fixed stops" : "Motor shaft showing target and encoder angles",
    `<circle r="68" fill="none" stroke="#d4dccf"/><g stroke="#96a690">${ticks.join("")}</g>
    <g class="joint-tick-label"><text x="0" y="-75">0°</text><text x="-85" y="3">+90°</text><text x="85" y="3">−90°</text></g>
    ${stops}<g data-target><path d="M0 0V-69" fill="none" stroke="#a66f3f" stroke-width="2" stroke-dasharray="4 3"/><circle cy="-69" r="3" fill="#ce9b64"/></g>
    <g data-shaft><rect x="-4" y="-57" width="8" height="58" rx="4" fill="#a7bd9f" stroke="#405b48" stroke-width="1.6"/><circle cy="-54" r="3" fill="#cfaa77"/></g>
    <circle r="8" fill="#d6e2cf" stroke="#405b48" stroke-width="1.6"/><circle r="2.5" fill="#56715b"/>`);
}
function pointAt(root: HTMLElement, selector: string, angle: number) {
  root.querySelector(selector)!.setAttribute("transform",`rotate(${-angle})`);
}

export function jointLimits(root: HTMLElement) {
  root.innerHTML = dial(true) + '<div class="shape-sliders"></div><p class="shape-caption" aria-live="polite"></p>';
  function draw(requested: number) {
    const actual = Math.min(90,Math.max(-90,requested));
    pointAt(root,"[data-target]",requested);
    pointAt(root,"[data-shaft]",actual);
    const state = requested === actual ? (Math.abs(actual) === 90 ? "At the stop." : "Within the allowed range.") : "At the stop. The requested angle exceeds the allowed range.";
    root.querySelector(".shape-caption")!.textContent = `Actual angle = ${actual}° · ${state}`;
  }
  slider(root.querySelector(".shape-sliders")!,"Requested angle",-180,180,30,"°",draw);
  draw(30);
}

export function feedback(root: HTMLElement) {
  root.innerHTML = `<div class="servo-layout">${dial(false)}
    <ol class="servo-loop">
      <li>Target <strong data-goal></strong></li>
      <li>Controller <strong data-error></strong></li>
      <li>Motor <strong data-drive></strong></li>
      <li>Encoder <strong data-reading></strong></li>
    </ol></div><div class="shape-sliders"></div><p class="shape-caption">The encoder feeds its angle back to the controller. The motor slows as the position error shrinks.</p>`;
  let target = 0, measured = 0, frame = 0, previous = 0;
  function draw() {
    pointAt(root,"[data-target]",target);
    pointAt(root,"[data-shaft]",measured);
    const error = target-measured;
    root.querySelector("[data-goal]")!.textContent = `${target}°`;
    root.querySelector("[data-error]")!.textContent = `Error ${Number(error.toFixed(1))}°`;
    root.querySelector("[data-drive]")!.textContent = error === 0 ? "Holding" : error > 0 ? "Turning ↺" : "Turning ↻";
    root.querySelector("[data-reading]")!.textContent = `${Number(measured.toFixed(1))}°`;
  }
  function tick(now: number) {
    const dt = Math.min((now-previous)/1000,0.1);
    previous = now;
    measured += (target-measured) * (1-Math.exp(-2.8*dt));
    if (Math.abs(target-measured) < .075) measured = target;
    draw();
    frame = measured === target ? 0 : requestAnimationFrame(tick);
  }
  slider(root.querySelector(".shape-sliders")!,"Target angle",-150,150,0,"°",v=>{
    target = v;
    draw();
    if (!frame && measured !== target) {
      previous = performance.now();
      frame = requestAnimationFrame(tick);
    }
  });
  draw();
}
