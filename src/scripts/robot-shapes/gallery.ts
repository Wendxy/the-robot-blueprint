import { buttonGroup, diagram } from "./controls";

import * as pose from "./gallery-motion";

const robots = [
  {
    name: "Articulated arm",
    motion: "A chain of rotary joints swings the tool around a fixed base.",
    job: "Welding along a car body.",
    advantage: "The elbow and wrist let the torch approach a seam from several angles.",
    draw: pose.articulated,
  },
  {
    name: "Cartesian robot",
    motion: "Three straight slides move the tool along X, Y and Z.",
    job: "Positioning the print head of a gantry-style 3D printer.",
    advantage: "Each slide controls one coordinate, making straight paths easy to set.",
    draw: pose.cartesian,
  },
  {
    name: "SCARA robot",
    motion: "Two rotary joints sweep the arm horizontally. A vertical slide lowers the tool.",
    job: "Inserting components into an electronics assembly.",
    advantage: "It crosses a flat work surface quickly and lowers parts straight into place.",
    draw: pose.scara,
  },
  {
    name: "Delta robot",
    motion: "Three linked arms suspended from above guide one small platform together.",
    job: "Picking chocolates from a moving conveyor.",
    advantage: "The heavy motors stay overhead, so the lightweight gripper can change direction quickly.",
    draw: pose.delta,
  },
  {
    name: "Wheeled robot",
    motion: "Powered wheels drive and steer the chassis across the floor.",
    job: "Carrying shelves between warehouse aisles.",
    advantage: "Wheels support a load continuously and roll efficiently on smooth floors.",
    draw: pose.wheeled,
  },
  {
    name: "Quadruped",
    motion: "Four articulated legs place the feet separately.",
    job: "Inspecting industrial sites with steps and uneven ground.",
    advantage: "The robot can choose footholds and step over gaps in its path.",
    draw: pose.quadruped,
  },
  {
    name: "Drone",
    motion: "Four rotors change their thrust to lift, tilt and steer the aircraft.",
    job: "Inspecting the upper surfaces of a bridge.",
    advantage: "It can hover beside structures that are difficult to reach from the ground.",
    draw: pose.drone,
  },
  {
    name: "Humanoid",
    motion: "Two legs balance the body while articulated arms position the hands.",
    job: "Testing two-handed handling tasks at human workstations.",
    advantage: "Its proportions can suit spaces and tools designed for people.",
    draw: pose.humanoid,
  },
];

function sketch(shapes: string) {
  return diagram("0 0 132 100", "Robot design", `<g data-motion-frame fill="#b7cbb5" stroke="#395342" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">${shapes}</g>`);
}

export function gallery(root: HTMLElement) {
  root.innerHTML = '<div class="gallery-picker"></div><div class="gallery-detail machine-info" aria-live="polite"></div>';
  const picker = root.querySelector<HTMLElement>(".gallery-picker")!;
  const info = root.querySelector<HTMLElement>(".gallery-detail")!;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const frames: SVGGElement[] = [];
  let selected: number | undefined;
  let animation = 0;

  function updatePlayback() {
    cancelAnimationFrame(animation);
    if (selected === undefined) return;
    const { draw } = robots[selected];
    const frame = frames[selected];
    if (reducedMotion.matches) {
      frame.innerHTML = draw(.37);
      return;
    }
    const start = performance.now();
    const framesPerSecond = 30;
    const framesPerCycle = 108; // 3.6 seconds for every robot.
    let lastFrame = -1;
    function tick(now: number) {
      const elapsed = Math.max(0, now - start);
      const index = Math.floor(elapsed * framesPerSecond / 1000) % framesPerCycle;
      if (index !== lastFrame) {
        frame.innerHTML = draw(index / framesPerCycle);
        lastFrame = index;
      }
      animation = requestAnimationFrame(tick);
    }
    animation = requestAnimationFrame(tick);
  }

  buttonGroup(picker, robots.map(r => r.name), "Robot designs", i => {
    if (selected === i) return;
    const robot = robots[i];
    info.innerHTML = `<dl><div><dt>Movement</dt><dd>${robot.motion}</dd></div><div><dt>At work</dt><dd>${robot.job}</dd></div><div><dt>Design advantage</dt><dd>${robot.advantage}</dd></div></dl>`;
    // The default selection sets the description before the drawings are mounted.
    if (frames.length) {
      if (selected !== undefined) frames[selected].innerHTML = robots[selected].draw(0);
      selected = i;
      updatePlayback();
    }
  });
  picker.querySelectorAll("button").forEach((button, i) => {
    button.insertAdjacentHTML("afterbegin", sketch(robots[i].draw(0)));
    button.querySelector("svg")!.setAttribute("aria-hidden", "true");
    frames.push(button.querySelector<SVGGElement>("[data-motion-frame]")!);
  });
  reducedMotion.addEventListener("change", updatePlayback);
}
