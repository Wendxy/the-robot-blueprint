import "../../styles/robot-shapes.css";
import "../../styles/forward-kinematics.css";
import { planarDemo } from "./planar";
import { gripperPose } from "./gripper";

const demos: Record<string,(root: HTMLElement) => void> = {
  "one-joint-robot": root => planarDemo(root,"one"),
  "two-joint-robot": root => planarDemo(root,"builder"),
  "forward-kinematics-calculator": root => planarDemo(root,"calculator"),
  "coordinate-frame-explorer": root => planarDemo(root,"frames"),
  "position-vs-orientation": gripperPose,
};
for (const root of document.querySelectorAll<HTMLElement>("[data-fk-demo]")) {
  demos[root.dataset.fkDemo!]?.(root);
}
