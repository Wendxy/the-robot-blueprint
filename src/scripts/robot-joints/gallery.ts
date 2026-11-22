import { buttonGroup, diagram, slider } from "../robot-shapes/controls";
import { models, type MotionSelection } from "./joint-models";

type MotionControl = {
  index: number;
  input: HTMLInputElement;
  phase: number;
};

export function jointGallery(root: HTMLElement) {
  root.innerHTML = `<div class="joint-choices"></div>
    <div class="assembly-stage">${diagram("-96 -70 192 140", "Joint movement", '<g class="mechanism" data-mechanism></g>')}</div>
    <div class="assembly-description"><strong data-count></strong><span data-explanation aria-live="polite"></span></div>
    <div class="gallery-motions"></div><div class="shape-sliders"></div>
    <div class="assembly-controls"><button type="button" class="robot-button secondary motion-play"></button><span data-travel></span></div>`;
  const stage = root.querySelector<HTMLElement>(".assembly-stage")!;
  const drawing = stage.querySelector<SVGGElement>("[data-mechanism]")!;
  const choices = root.querySelector<HTMLElement>(".gallery-motions")!;
  const controls = root.querySelector<HTMLElement>(".shape-sliders")!;
  const play = root.querySelector<HTMLButtonElement>(".motion-play")!;
  const travel = root.querySelector<HTMLElement>("[data-travel]")!;
  const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  const values = models.map(model => model.motions.map(motion => motion[3]));
  const selected = models.map<MotionSelection>(model => model.motions.length > 1 ? "together" : 0);
  let index = 0, frame = 0, previous = 0;
  let playing = !preference.matches, visible = false, fromPlayer = false;
  let sliders: MotionControl[] = [];

  function draw() {
    drawing.innerHTML = models[index].draw(values[index], selected[index]);
    travel.textContent = models[index].name === "Helical" ? `Axial travel ${Number((values[index][0]/30).toFixed(1))} mm` : "";
  }
  function startingPhase(i: number, value: number) {
    const [,min,max] = models[index].motions[i];
    const phase = Math.asin(2*(value-min)/(max-min)-1);
    return i % 2 === 0 ? phase : Math.PI-phase;
  }
  function animate(now: number) {
    const step = previous ? Math.min(.08,(now-previous)/1000) : 0;
    previous = now;
    let changed = false;
    fromPlayer = true;
    for (const control of sliders) {
      const [,min,max] = models[index].motions[control.index];
      // Different periods let the viewer see one axis reverse while another continues.
      control.phase += step*2*Math.PI/(7.2+1.8*control.index);
      const value = Math.round(min+(max-min)*(1+Math.sin(control.phase))/2);
      if (value === control.input.valueAsNumber) continue;
      control.input.value = String(value);
      control.input.dispatchEvent(new Event("input"));
      changed = true;
    }
    fromPlayer = false;
    if (changed) draw();
    frame = requestAnimationFrame(animate);
  }
  function playback() {
    cancelAnimationFrame(frame);
    previous = 0;
    play.textContent = playing ? "Pause motion" : "Play motion";
    if (playing && visible && !document.hidden) frame = requestAnimationFrame(animate);
  }
  function chooseMotion(selection: MotionSelection) {
    selected[index] = selection;
    controls.replaceChildren();
    const model = models[index];
    const caption = selection === "together" ? model.combinedCaption! : model.motions[selection][5];
    drawing.ownerSVGElement!.setAttribute("aria-label", `${model.name} joint. ${caption}`);
    root.querySelector("[data-explanation]")!.textContent = caption;
    const indices = selection === "together" ? model.motions.map((_,i) => i) : [selection];
    sliders = indices.map(i => {
      const [name,min,max,,unit] = model.motions[i];
      const value = values[index][i];
      const label = slider(controls,name,min,max,value,unit,v => {
        values[index][i] = v;
        if (fromPlayer) return;
        control.phase = startingPhase(i,v);
        playing = false;
        playback();
        draw();
      });
      const control = {index:i, input:label.querySelector("input")!, phase:startingPhase(i,value)};
      return control;
    });
    draw();
    playback();
  }
  buttonGroup(root.querySelector(".joint-choices")!,models.map(m => m.name),"Joint type",i => {
    index = i;
    const motions = models[i].motions;
    root.querySelector("[data-count]")!.textContent = `${motions.length} DOF`;
    choices.replaceChildren();
    if (motions.length === 1) {
      chooseMotion(0);
      return;
    }
    const saved = selected[i];
    const select = buttonGroup(choices,["Together", ...motions.map(m => m[0])],"Movement to demonstrate",
      button => chooseMotion(button === 0 ? "together" : button-1));
    if (saved !== "together") select(saved+1);
  });
  play.addEventListener("click", () => { playing = !playing; playback(); });
  preference.addEventListener("change", () => { if (preference.matches) { playing = false; playback(); } });
  document.addEventListener("visibilitychange",playback);
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; playback(); }).observe(stage);
}
