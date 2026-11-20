export const threads = [
  {
    id: "learning-from-demonstration",
    title: "Learning from demonstration",
    summary:
      "Imitation, data collection, and generalisation beyond a single task.",
    question:
      "What does a demonstration actually teach? A recording ties a camera view to a sequence of actions. If the object moves, the arm may need a different action even when the task looks familiar. This thread follows the choices made while collecting, aligning, and replaying demonstrations.",
    tag: "imitation learning",
  },
  {
    id: "world-models-for-control",
    title: "World models for control",
    summary:
      "Predictive representations that help robots reason about the consequences of actions.",
    question:
      "A model can predict where a cup will appear in the next frame. A controller needs to know whether the gripper will still hold it. This thread asks which predictions help a robot choose a next action, detect a slip, or pause when the evidence is ambiguous.",
    tag: "world models",
  },
  {
    id: "intelligence-on-small-hardware",
    title: "Intelligence on small hardware",
    summary:
      "Embedded experiments, interfaces, and bringing AI into physical devices.",
    question:
      "What can a device tell its user with a single button, a small display, and a limited supply of power? This thread follows the path from an input signal to a visible response, including what happens when a connection drops or a measurement arrives late.",
    tag: "embedded systems",
  },
];
