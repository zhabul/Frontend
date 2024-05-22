/*import {
>>>>>>> dev
    createServer,
    JSONAPISerializer
} from "miragejs";

import seeds from './database/seeds';
import models from './database/models';
import initUserRoutes from './controllers/users/routes';
import initPostRoutes from './controllers/posts/routes';
import factories from './database/factories';

const createMirage = () => {
    createServer({
        serializers: { 
            application: JSONAPISerializer,
        },  
        factories: factories,
        seeds: seeds, 
        models: models,
        routes() {

            initUserRoutes.bind(this)();
            initPostRoutes.bind(this)();
            initInvoiceRoutes.bind(this)();


            this.passthrough()
        },


    });
};
<<<<<<< HEAD

export default createMirage;
=======
*/
export default {};
