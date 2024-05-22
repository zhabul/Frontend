export interface EmpityErstTypeInterface {
    id:number;
    name:string;
    timecode:string;
    quantity:string;
    active:number;
    timecode_visma:string;
    unit:number;
    unit_name:string;
};

export const emptyErstType:EmpityErstTypeInterface = {
    id: null,
    name: '',
    timecode: '',
    quantity: '0',
    active: 1,
    timecode_visma: '',
    unit: null,
    unit_name: ''
};

export default {};