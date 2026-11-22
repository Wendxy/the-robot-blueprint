import "../../styles/robot-shapes.css";
import "../../styles/robot-joints.css";
import { robotArm } from "./arm";
import { jointAxis } from "./spatial";
import { jointLimits, feedback } from "./motor";

const activities: Record<string, (root: HTMLElement) => void> = {
  "meet-the-robot-arm": root => robotArm(root, false),
  "joint-type-playground": root => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      void import("./gallery").then(({jointGallery}) => jointGallery(root));
    }, {rootMargin: "450px"});
    observer.observe(root.closest("section")!);
  },
  "find-the-joint-axis": jointAxis,
  "joint-limits": jointLimits,
  "inside-a-robot-joint": feedback,
  "kinematic-chain-playground": root => robotArm(root, true),
};
for (const root of document.querySelectorAll<HTMLElement>("[data-joint-demo]")) {
  activities[root.dataset.jointDemo!]?.(root);
}
