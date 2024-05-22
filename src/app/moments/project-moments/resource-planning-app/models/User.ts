import { AbsenceSegmentData } from "./AbsenceSegmentData";
import { DateSegmentData } from "./DateSegmentData";
import { UserStyles } from "./UserStyles";

export type User = {
  id: number;
  name: string;
  colorByRole: string;
  dateSegments: DateSegmentData[];
  absences: AbsenceSegmentData[];
  y: number;
  isResponsiblePerson: boolean;
  sortIndex: number;
  isMoved: boolean;
  styles: UserStyles;
  showInResourcePlanning: boolean;

  startDateContract: string;
  endDateContract: string;

  subProjects?: any;
};
