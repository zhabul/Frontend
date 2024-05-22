
import { DateSegmentData } from "./DateSegmentData";
import { MomentStyles } from "./MomentStyles";

export type Moment = {
  id: number;
  global_activity_id: number;
  activity_id: number;
  schedule_plan_activity_id: number;
  moment_id: number;
  name: string;
  plan: string;
  start_date: string;
  end_date: string;
  time: number;
  number_of_workers: number;
  state: string;
  state_number: number;
  // colorByRole: string;

  dateSegments: DateSegmentData[];
  // absences: AbsenceSegmentData[];
  y: number;
  // isResponsiblePerson: boolean;
  // sortIndex: number;
  // isMoved: boolean;
  styles: MomentStyles;
  // showInResourcePlanning: boolean;
  parent: number;
  group_id: number;
  parent_type: string;
  percentage_of_realized_plan: number;
  tape_color: string;
  moments: Moment[];
  sort_index: number;
  part: string;
  changed: boolean;
  monster?: number;
}

