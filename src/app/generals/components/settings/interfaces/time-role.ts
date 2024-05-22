export interface TimeRole {
  name: string;
  id: string;
  TodayTimes: { id: string; taskId: string; time: string }[];
  TomorowTimes: { id: string; taskId: string; time: string }[];
}
