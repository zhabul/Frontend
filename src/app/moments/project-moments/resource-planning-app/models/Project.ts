import { User } from "./User";

export type Project = {
  id: number;
  name: string;
  color: string;
  users: User[];
  startDate: string;
  endDate: string;
  startWeekDate: string;
  endWeekDate: string;
  numberOfDays: number;
  y: number;
  x: number;
  resourceWeeks;
  countAsResources: boolean;
  subProjects?: any[];
};
