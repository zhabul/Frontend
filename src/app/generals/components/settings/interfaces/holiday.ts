export interface Holiday {
  end_date: string;
  hours: string;
  id: string;
  name: string;
  start_date: string;
  startDateOpen?: boolean;
  endDateOpen?: boolean;
  edit?: boolean;
  old_start_date: string;
  old_end_date: string;
  allow_delete?:boolean;
}
