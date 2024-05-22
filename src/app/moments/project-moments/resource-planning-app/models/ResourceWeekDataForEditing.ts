import { TextRenderer } from "src/app/canvas-ui/TextRenderer";
import { Project } from "./Project";

export type ResourceWeekDataForEditing = {
  project: Project;
  resourceWeek: string;
  resourceWeekTextShape: TextRenderer;
};
