export interface Moment {
  id?: string;
  name: string;
  moment_number: string;
  parent: string | number;
  sort: string;
  type: string;
  childrens: Moment[];
  edit: boolean;
  toggle?: boolean;
}
