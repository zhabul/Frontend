import { Activity } from "./Activity";

export type Project = {
    id: number;
    name: string;
    activities: Activity[];
}
