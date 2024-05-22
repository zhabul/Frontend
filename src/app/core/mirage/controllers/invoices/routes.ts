import projects from "./projects";


function initInvoiceRoutes() {
  this.get("api/invoices/new/all-projects", projects.getProjects),
  this.get("api/projects/get/492", projects.getLisberg),
  this.get("api/projects/get/1086", projects.getMimo),
  this.get("api/projects/get/666", projects.getTest)
}


export default initInvoiceRoutes;
