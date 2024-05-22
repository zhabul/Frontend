export interface EmpityAbsenceInterface {
    AbsenceTypeID: number | null;
    Name: string;
    ShortName:  string;
    Color: string;
    timeCode: string;
    timeCodeVisma: string;
    sortingScheme: string;
    active: number; 
    color: string;
    filter_active: boolean;
    paid: number;
    flex: number;
    stats: number;
    number_of_flex: number;
};

export const emptyAbsence:EmpityAbsenceInterface = {
    AbsenceTypeID: null,
    Name: "",
    ShortName: "",
    Color: "",
    timeCode: null,
    timeCodeVisma: null,
    sortingScheme: null,
    active: 1, 
    color: "#080808",
    filter_active: true,
    paid: 0,
    flex: 0,    
    stats: 0,
    number_of_flex: 1
};

export default {};