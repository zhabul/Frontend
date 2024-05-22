export interface EmptyHolidayInterface {
    id: string;
    name: string;
    hours: string;
    start_date: string;
    end_date: string;
};

export const emptyHoliday:EmptyHolidayInterface = {
    id: "",
    name: "",
    hours: "",
    start_date: "",
    end_date: ""
};

export default {};