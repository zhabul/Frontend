import { Moment } from "./Moment";
import { MomentStyles } from "./MomentStyles";
import { DateSegmentData } from "./DateSegmentData";


export type Activity = {
  id: number;
  number: string;
  description: string;
  moments: Moment[];
  startDate: string;
  endDate: string;
  startWeekDate: string;
  endWeekDate: string;
  numberOfDays: number;
  y: number;
  x: number;
  resourceWeeks;
  countAsResources: boolean;
  styles: MomentStyles;
  percentage_of_realized_activity: number;
  sort_index: number;
  tape_color: string;
  dateSegments: DateSegmentData[];
  number_of_workers: number;
  time: number;
  default_moment_id: number;
  plan: string;
  part: string;
  changed: boolean;
  monster?: number;
}
