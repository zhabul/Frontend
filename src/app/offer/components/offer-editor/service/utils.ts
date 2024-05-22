import * as moment from 'moment';

export const newOffer = {

    id: -1,
    name: "",
    client_id: 0,
    client_id_name: "",
    offer_id_name: "",
    client_worker_id: "",
    offerNum: "",
    skv_id: "",
    userWithPermission: "",
    userWithPermission_name: "",
    userWithPermission_mobile: "",
    status: "1",
    city: "",
    street: "",
    zip: "",
    LastUpdated: "",
    SentDate: "",

    //article data
    articleName: "",
    description: "",
    unit: "",
    quantity: "",

    startDate: moment(new Date()).format('YYYY-MM-DD'),
   /* EndDate: "",*/ 
    ValidityPeriod: 30,
    PaymentTerms: 30, 

    SkilledHourlyRate: 0, 
    WorkerHourlyRate: 0, 
    AtaSkilledHourlyRate: 0,
    AtaWorkerHourlyRate: 0,
    chargeMaterial: 0,
    chargeUE: 0, 
    ATAchargeMaterial: 0, 
    ATAchargeUE: 0,
    estimatedRunTime: 0, 
    estimatedFixTime: 0,
    clientsProjectName: "",
    clientProjectNumber: "",
    ResourceAccount: "0", 
    city2: "",
    street2: "",
    zip2: "",

    debit_Id: "",
    tenderSum: "0",

    cl_name: '',
    cl_invoice_address_and_no: '',
    cl_invoice_address_post_nr: '',
    cl_invoice_address_city: '',
    client_worker_name: "",
    debit_form_name: "",
    construction_form_name: "",
    draftGroup: 0,

    emailLogs: [],
    files: []

};

export const emptyEmailLogObject = {
    answerEmail: "",
    answerDate: null,
    Status: "",
    manualReply: "",
    client_message: "",
    attachment: "",
    image_path: null,
    file_path: "",
    id: "",
    active: "",
    group: "",
    files: [ ]
};


export default {};