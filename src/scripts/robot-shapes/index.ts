import "../../styles/robot-shapes.css";
import { gallery } from "./gallery";
import { anatomy, playground } from "./mechanisms";
import { builder, cupChallenge } from "./planar";
import { poseExplorer } from "./pose";
import { calculator, mystery } from "./linkages";
import { rigidBody } from "./rigid-body";

const demos: Record<string, (root: HTMLElement) => void> = {
  "four-joint-mystery": mystery,
  "rigid-body-points": rigidBody,
  "four-bar-calculator": calculator,
  "robot-gallery": gallery,
  "arm-anatomy": anatomy,
  "joint-playground": playground,
  "arm-builder": builder,
  "pose-explorer": poseExplorer,
  "reach-the-cup": cupChallenge,
};
for (const root of document.querySelectorAll<HTMLElement>("[data-robot-demo]")) {
  demos[root.dataset.robotDemo!]?.(root);
}
