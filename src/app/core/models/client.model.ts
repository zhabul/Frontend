export class Client {
  Id: number;
  Name: string;
  Number: number;
  Company: string;
  Address: string;
  CompanyId: number;
  InvoiceAddress: string;
  PostNumber: number;
  Worker_name: string;
  finalName: string;
  status: string;
  id: number;
  ataId: number;
  name:string;
  name2: string;
  ProjectID : string;
  Description: string;

  constructor(
    Id: number,
    Name: string,
    Number: number,
    Company: string,
    Address: string,
    CompanyId: number,
    InvoiceAddress: string,
    PostNumber: number,
    Worker_name: string,
    finalName: string,
    status : string,
    id : number,
    ataId: number,
    name: string,
    name2: string,
    ProjectID: string,
    Description: string,

  ) {
    this.Id = Id;
    this.Name = Name;
    this.Number = Number;
    this.Company = Company;
    this.Address = Address;
    this.CompanyId = CompanyId;
    this.InvoiceAddress = InvoiceAddress;
    this.PostNumber = PostNumber;
    this.Worker_name = Worker_name;
    this.finalName = finalName;
    this.status = status;
    this.id = id;
    this.ataId = ataId;
    this.name = name;
    this.name2 = name2;
    this.ProjectID = ProjectID;
    this.Description = Description;
  }
}
