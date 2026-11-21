const quiz = document.querySelector<HTMLFormElement>("#robot-quiz");
if (quiz) {
  const summary = quiz.querySelector("output")!;
  const submit = quiz.querySelector<HTMLButtonElement>('[type="submit"]')!;
  const retry = quiz.querySelector<HTMLButtonElement>('[type="reset"]')!;
  const cards = quiz.querySelectorAll<HTMLFieldSetElement>("fieldset");

  function clearAnswers() {
    summary.textContent = "";
    for (const card of cards) card.querySelector<HTMLElement>(".guess-result")!.hidden = true;
    submit.hidden = false;
    retry.hidden = true;
  }

  quiz.addEventListener("submit", (event) => {
    event.preventDefault();
    let score = 0;
    for (const card of cards) {
      const choice = card.querySelector<HTMLInputElement>(":checked")!;
      const correct = choice.value === card.dataset.answer;
      if (correct) score++;
      const answer = card.dataset.answer === "robot" ? "Robot" : "Automated appliance";
      const result = card.querySelector<HTMLElement>(".guess-result")!;
      result.textContent = `${correct ? "Correct" : "Answer"} · ${answer}`;
      result.hidden = false;
    }
    summary.textContent = `${score} of ${cards.length} correct.`;
    submit.hidden = true;
    retry.hidden = false;
    retry.focus({ preventScroll: true });
  });

  quiz.addEventListener("change", clearAnswers);
  quiz.addEventListener("reset", () => {
    clearAnswers();
    quiz.querySelector("input")!.focus({ preventScroll: true });
  });
  quiz.querySelector<HTMLElement>(".quiz-actions")!.hidden = false;
}

const cycle = document.querySelector<HTMLElement>("#vacuum-cycle");
if (cycle) {
  const captions = {
    sense: "The distance sensor detects the wall just ahead.",
    think: "The controller applies its rule: wall ahead, turn left. The dashed line shows the planned turn.",
    act: "The wheels turn the vacuum left and carry it along the wall.",
  };
  type Stage = keyof typeof captions;
  const stages = cycle.querySelectorAll<HTMLButtonElement>("[data-stage-choice]");
  const caption = cycle.querySelector<HTMLElement>(".stage-caption")!;
  const replay = cycle.querySelector<HTMLButtonElement>("[data-replay]")!;
  let timers: number[] = [];

  function stopReplay() {
    timers.forEach(window.clearTimeout);
    timers = [];
    cycle!.classList.remove("approaching");
  }

  function showStage(stage: Stage) {
    cycle!.dataset.stage = stage;
    for (const button of stages) {
      button.setAttribute("aria-pressed", String(button.dataset.stageChoice === stage));
    }
    caption.textContent = captions[stage];
  }

  for (const button of stages) {
    button.addEventListener("click", () => {
      stopReplay();
      showStage(button.dataset.stageChoice as Stage);
    });
  }
  replay.addEventListener("click", () => {
    stopReplay();
    showStage("sense");
    // Start the approach again even when Replay is pressed during the same stage.
    void cycle.offsetWidth;
    cycle.classList.add("approaching");
    timers = [
      window.setTimeout(() => showStage("think"), 1900),
      window.setTimeout(() => showStage("act"), 4000),
      window.setTimeout(stopReplay, 5500),
    ];
  });
  cycle.querySelector<HTMLElement>(".cycle-controls")!.hidden = false;
}
