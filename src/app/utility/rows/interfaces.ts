import {
    LineInterface
} from './row-line/interfaces';



export interface LinesServiceInterface {
    getLines: (id:number) => Promise<any>;
    saveLines: (data:LineInterface[]) => Promise<any>;
};


export default {};