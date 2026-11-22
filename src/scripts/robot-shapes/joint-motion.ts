export function numberedJoint(x: number, y: number, number: number, name: string, active: boolean, selectable = false) {
  return `<g transform="translate(${x} ${y})" ${selectable ? `data-arm-joint="${number-1}"` : ""}>
    <title>Joint ${number} · ${name}</title>
    <circle class="pin-face" r="5.1" fill="${active ? "#e6b981" : "#e6eee0"}" stroke="#405b48"/>
    <text class="arm-pin-number" y="2.2" text-anchor="middle">${number}</text></g>`;
}

// Both mechanisms drive their existing angle input, whether the reader drags, plays or uses the keyboard.
export function jointMotion(root: HTMLElement, input: HTMLInputElement, pick?: (index: number) => void) {
  const svg = root.querySelector("svg")!;
  const button = document.createElement("button");
  button.type = "button";
  button.className = "robot-button secondary motion-play";
  button.textContent = "Play motion";
  const controls = input.closest(".shape-sliders") ?? input.closest("label")!;
  controls.after(button);

  const min = Number(input.min), max = Number(input.max);
  let frame = 0;
  let updating = false;
  let increasing = true;
  function stop() {
    cancelAnimationFrame(frame);
    frame = 0;
    button.textContent = "Play motion";
  }
  function setAngle(value: number) {
    const next = Math.max(min, Math.min(max, Math.round(value)));
    if (next === input.valueAsNumber) return;
    updating = true;
    input.value = String(next);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    updating = false;
  }
  root.addEventListener("input", () => { if (!updating) stop(); }, true);
  button.addEventListener("click", () => {
    if (frame) { stop(); return; }
    const span = max - min;
    const start = performance.now();
    const position = input.valueAsNumber - min;
    const offset = increasing ? position : 2 * span - position;
    function tick(now: number) {
      // A triangular sweep keeps a constant angular speed and reverses at each limit.
      const phase = (offset + Math.max(0, now - start) * 0.045) % (2 * span);
      increasing = phase < span;
      setAngle(min + (increasing ? phase : 2 * span - phase));
      frame = requestAnimationFrame(tick);
    }
    button.textContent = "Pause motion";
    frame = requestAnimationFrame(tick);
  });
  document.addEventListener("visibilitychange", () => { if (document.hidden) stop(); });

  let drag: { id: number; x: number; angle: number } | undefined;
  svg.addEventListener("pointerdown", event => {
    if (!event.isPrimary || event.button !== 0) return;
    stop();
    const joint = (event.target as Element).closest("[data-arm-joint]");
    if (joint) pick?.(Number(joint.getAttribute("data-arm-joint")));
    drag = { id: event.pointerId, x: event.clientX, angle: input.valueAsNumber };
    svg.setPointerCapture(event.pointerId);
  });
  svg.addEventListener("pointermove", event => {
    if (drag && event.pointerId === drag.id) setAngle(drag.angle + event.clientX - drag.x);
  });
  svg.addEventListener("lostpointercapture", () => { drag = undefined; });
  return stop;
}
