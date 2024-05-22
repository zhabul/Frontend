import { Component, OnInit, AfterViewInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { InvoicesService } from "src/app/core/services/invoices.service";
import { ProjectsService } from "src/app/core/services/projects.service";
declare var $;

@Component({
  selector: "app-project-summary",
  templateUrl: "./project-summary.component.html",
  styleUrls: ["./project-summary.component.css"],
})
export class ProjectSummaryComponent implements OnInit, AfterViewInit {
  public project;
  public summary;
  public additionalWork: any[] = [];
  public totalAdditionalWork: number = 0;
  public totalCostAdditionlWork;
  public supplierInvoices: any[] = [];
  public totalSum;
  public percentage;
  public invoicedWeeklyReports = [];
  public totalInvoicedSupplierInvoices: number = 0;
  public showMaterialTable = false;
  public showAdditionalWorkTable = false;
  public showSupplierInvoiceTable = false;
  public showOtherTable = false;
  public showAll = false;
  public showWeeklyReports = true;
  public projectWeekyReports: any[] = [];
  public sumAllTotallyWorkedUp: number = 0;
  public sumAllWorkedButNotApproved: number = 0;
  public sumAllApprovedForInvoice: number = 0;
  public sumAllInvoicedTotal: number = 0;
  public projectMaterials: any[] = [];
  public totalUserCostAdditionlWork: number = 0;
  public sumOtherPrice: number = 0;
  public sumOtherTotal: number = 0;
  public sumOtherTotalWithoutDeduct: number = 0;
  public sumMaterialTotalWithoutDeduct: number = 0;
  public sumMaterialPrice: number = 0;
  public sumMaterialTotal: number = 0;
  public sumOfPriceSuplierInvoices: number = 0;
  public sumOfTotalSuplierInvoices: number = 0;
  public totalResult: number = 0;
  public totalDiferenceAdditionalWork: number = 0;
  public spinner = true;
  public projectsAndSubProjectsAndAtas: any = {};
  public showAtaDetails: boolean = false;
  public showActivityAtaDetails: boolean = false;
  public totalCostProject: number = 0;
  public totalCostAta: number = 0;
  public totalCostProjectPercentage: number = 0;
  public totalCostAtaPercentage: any = 0;
  public showProjectWeeklyReports: boolean = false;
  public totalInvoiced: number = 0;
  public userTotalAverage: number = 0;
  public differeneBetweenEstimatedRunningTimeAndProjectInvoicedTime: number = 0;
  public userDetails;
  public statistic:any = [];

  constructor(
    private route: ActivatedRoute,
    private invoicesService: InvoicesService,
    private projectsService: ProjectsService
  ) {}

  ngOnInit() {
    this.userDetails = JSON.parse(sessionStorage.getItem('userDetails'));
    this.project = this.route.snapshot.data["project"];
    //this.projectsAndSubProjectsAndAtas = this.route.snapshot.data["projectsAndSubProjectsAndAtas"]["data"];
    this.statistic = this.route.snapshot.data["statistic_data"]["data"];

    if (this.project.debit_Id != 2 && this.project.debit_Id != 3) {
      let projectWeekyReports =
        this.route.snapshot.data["projectWeekyReports"]["data"];

      if (projectWeekyReports) {
        this.projectWeekyReports = Object.values(projectWeekyReports);
        this.calculateWeeklyReport();
        this.getAllNotCompletedInvoicesForProject();
        this.totalCost();
      } else this.getAllProjectArticleMaterials();
    }
    let differeneBetweenEstimatedRunningTimeAndProjectInvoicedTime =
      this.statistic['rows'][0]["EstimatedFixTime"] -
      this.statistic['rows'][0]["tidTotal"]["total_time"];
    if (differeneBetweenEstimatedRunningTimeAndProjectInvoicedTime > 0) {
      this.differeneBetweenEstimatedRunningTimeAndProjectInvoicedTime =
        differeneBetweenEstimatedRunningTimeAndProjectInvoicedTime;
    }
  }

  ngAfterViewInit() {
    this.spinner = false;
  }

  totalCost() {

    this.totalCostProject =
      this.statistic['rows'][0]["totalCostProject"];
    this.totalCostAta =
      this.statistic['rows'][0]["totalCostAtas"];
    if (this.sumAllInvoicedTotal && this.totalCostProject)
      this.totalCostProjectPercentage =
        this.statistic['rows'][0]["resPercentage"];

    if (
      this.statistic['rows'][0]["ata_invoiced"] &&
      this.totalCostAta
    )
      this.totalCostAtaPercentage =
        this.statistic['rows'][0]["ata_percentage"];
  }

  sumAllInvoicedTotalForActivity(activity) {}

  totalAta(ata) {
    return (
      ata["total_additional_work"] +
      ata["total_materials"] +
      ata["total_other_materials"]
    );
  }

  getAllNotCompletedInvoicesForProject() {
    this.invoicesService
      .getAllNotCompletedInvoicesForProject(
        this.project.CustomName,
        this.project.debit_Id
      )
      .subscribe((response: any) => {
        this.supplierInvoices = response;
        this.sumOfPriceSuplierInvoices = this.calculateTotal("Price");
        this.sumOfTotalSuplierInvoices = this.calculateTotal("Total");
      });
  }

  getAllProjectArticleMaterials() {
    this.projectsService
      .getAllProjectArticleMaterials(this.project.id)
      .then((result) => {
        if (result["status"]) {
          this.projectMaterials = result["data"];
          this.sumOtherPrice = this.calculateMaterialTotal("Price", "Other");
          this.sumOtherTotal = this.calculateMaterialTotal("Total", "Other");
          this.sumOtherTotalWithoutDeduct = this.calculateMaterialTotal(
            "TotalWithoutDeduct",
            "Other"
          );
          this.sumMaterialTotalWithoutDeduct = this.calculateMaterialTotal(
            "TotalWithoutDeduct",
            "Material"
          );
          this.sumMaterialPrice = this.calculateMaterialTotal(
            "Price",
            "Material"
          );
          this.sumMaterialTotal = this.calculateMaterialTotal(
            "Total",
            "Material"
          );
        }
        this.spinner = false;
      });
  }

  calculateAtaTotal(prop) {
    let total = 0;
 /*   if (
      this.projectsAndSubProjectsAndAtas &&
      this.projectsAndSubProjectsAndAtas["atas"] &&
      this.projectsAndSubProjectsAndAtas["atas"].length > 0
    ) {
      total = this.projectsAndSubProjectsAndAtas["atas"].reduce((prev, ata) => {
        return prev + parseFloat(ata[prop]);
      }, 0);
    }*/
    return total;
  }

  calculateTotal(prop) {
    let total = 0;
    if (this.supplierInvoices && this.supplierInvoices.length > 0) {
      total = this.supplierInvoices.reduce((prev, invoice) => {
        return prev + parseFloat(invoice[prop]);
      }, 0);
    }
    return total;
  }

  calculateWeeklyReport() {
    this.sumAllTotallyWorkedUp =
      this.projectsAndSubProjectsAndAtas["projectTotallyWorkedUp"];
    this.sumAllWorkedButNotApproved =
      this.projectsAndSubProjectsAndAtas["projectWorkedButNotApproved"];
    this.sumAllApprovedForInvoice =
      this.projectsAndSubProjectsAndAtas["projectApprovedForInvoice"];
    this.sumAllInvoicedTotal =
      this.projectsAndSubProjectsAndAtas["projectInvoicedTotal"];
  }

  calculateMaterialTotal(prop, type) {
    let total = 0;
    if (this.projectMaterials && this.projectMaterials.length > 0) {
      let materials = this.projectMaterials.filter(
        (article) => article.type == type
      );
      total = materials.reduce((prev, material) => {
        return prev + parseFloat(material[prop]);
      }, 0);
    }
    return total;
  }

  getType() {
    return this.project.debit_Id;
  }

  toggleTable(table) {
    this[table] = !this[table];
  }

  setContent(arg) {
    if (arg == "details") {
      this.showAll = true;
      this.showWeeklyReports = false;
      $(".btn-approved").addClass("active");
      $(".btn-all").removeClass("active");
    } else {
      this.showAll = false;
      this.showWeeklyReports = true;
      $(".btn-all").addClass("active");
      $(".btn-approved").removeClass("active");
    }
  }
}
