import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
import { BASE_URL } from "src/app/config";

@Component({
  selector: "app-supplier-invoice-rows",
  templateUrl: "./supplier-invoice-rows.component.html",
  styleUrls: ["./supplier-invoice-rows.component.css"],
})
export class SupplierInvoiceRowsComponent implements OnInit {
  public project;
  public supplierInvoiceRows;
  public documents: any[] = [];
  public showPdfPreview = false;
  public whichPdfPreview;
  public documentToShow = 0;

  constructor(private route: ActivatedRoute, public sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.project = this.route.snapshot.data["project"];
    this.supplierInvoiceRows =
      this.route.snapshot.data["supplierInvoiceRows"]["invoiceRows"];
    this.documents = this.route.snapshot.data["documents"]["invoiceRows"];
    let pat = BASE_URL + this.documents[0]["Path"];
    this.whichPdfPreview = this.sanitizer.bypassSecurityTrustResourceUrl(pat);
  }

  toggleDocument(num) {
    switch (num) {
      case "+1":
        this.documentToShow = this.documentToShow + 1;
        let p = BASE_URL + this.documents[this.documentToShow]["Path"];
        this.whichPdfPreview = this.sanitizer.bypassSecurityTrustResourceUrl(p);
        break;
      case "-1":
        this.documentToShow = this.documentToShow - 1;
        let u = BASE_URL + this.documents[this.documentToShow]["Path"];
        this.whichPdfPreview = this.sanitizer.bypassSecurityTrustResourceUrl(u);
        break;
    }
  }
}
