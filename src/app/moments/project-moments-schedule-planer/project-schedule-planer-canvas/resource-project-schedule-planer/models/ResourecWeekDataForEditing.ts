import { TextRenderer } from "src/app/canvas-ui/TextRenderer";
import { Activity } from "./Activity";

export type ResourceWeekDataForEditing = {
  activity: Activity;
  resourceWeek: string;
  resourceWeekTextShape: TextRenderer;
};
