export function slider(root: HTMLElement, name: string, min: number, max: number, initial: number, unit: string, onInput: (value: number) => void) {
  const label = document.createElement("label");
  label.className = "shape-slider";
  const title = document.createElement("span");
  title.textContent = name;
  const reading = document.createElement("span");
  reading.className = "slider-reading";
  reading.setAttribute("aria-hidden", "true");
  const input = document.createElement("input");
  input.type = "range";
  input.min = String(min);
  input.max = String(max);
  input.value = String(initial);
  function updateReading() {
    reading.textContent = input.value + unit;
    input.setAttribute("aria-valuetext", reading.textContent);
  }
  updateReading();
  input.addEventListener("input", () => {
    updateReading();
    onInput(input.valueAsNumber);
  });
  label.append(title, reading, input);
  root.append(label);
  return label;
}

export function diagram(viewBox: string, title: string, shapes: string) {
  return `<svg class="shape-diagram" viewBox="${viewBox}" role="img" aria-label="${title}">${shapes}</svg>`;
}

export function buttonGroup(root: HTMLElement, names: string[], label: string, onSelect: (index: number) => void) {
  const bar = document.createElement("div");
  bar.className = "stage-buttons shape-options";
  bar.setAttribute("role", "group");
  bar.setAttribute("aria-label", label);
  const buttons = names.map((name, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = name;
    button.addEventListener("click", () => select(index));
    bar.append(button);
    return button;
  });
  function select(index: number) {
    buttons.forEach((button, i) => button.setAttribute("aria-pressed", String(i === index)));
    onSelect(index);
  }
  root.append(bar);
  select(0);
  return select;
}
