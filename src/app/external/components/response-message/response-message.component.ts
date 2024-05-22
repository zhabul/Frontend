import { Component, OnInit, ElementRef } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { GeneralsService } from "src/app/core/services/generals.service";

@Component({
  selector: "app-response-message",
  templateUrl: "./response-message.component.html",
  styleUrls: ["./response-message.component.css"],
})
export class ResponseMessageComponent implements OnInit {
  public image: any;
  public companyName: any;
  public response: any;

  constructor(
    private route: ActivatedRoute,
    private generalsService: GeneralsService,
    private elementRef: ElementRef,
    private router: Router
  ) {}

  ngAfterViewInit() {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor =
      "#fff";
  }

  ngOnInit() {
    this.generalsService.getGenerals().subscribe((res: any) => {
      this.companyName = res.find((x) => x["key"] == "Company_Name").value;
      this.image = res.find((x) => x["key"] == "Logo").value;
    });
    this.route.params.subscribe((params) => {
      this.response = params.status;
    });
  }

  backToWeb() {
    this.router.navigate(["/"]).then(() => {
      window.location.reload();
    });
  }
}
