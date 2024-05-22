export type DateSegmentData = {
  id: number;
  startDate: string;
  endDate: string;
  startWeekDate: string;
  endWeekDate: string;
  numberOfDays: number;
  x: number;
  y: number;
  hasMultiple?: boolean;
  startWorkDate: string,
  currentWorkDate: string,
  connected: number,
  connectedToPlan: number,
  noted: number,
  noteText: string,
  finishedTime: number
}
