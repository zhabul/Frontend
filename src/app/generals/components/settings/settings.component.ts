import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SettingsService } from "src/app/core/services/settings.service";
import { Observable, of, take } from "rxjs";
import { RoleElligibilityComponent } from "./components/role-elligibility/role-elligibility.component";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.css"],
})
export class SettingsComponent implements OnInit {
  @ViewChild(RoleElligibilityComponent) child:RoleElligibilityComponent;
  generals = [];
  public activeTab = 1;
  isSaved = true;
  public userDetails: any = JSON.parse(sessionStorage.getItem("userDetails"));

  public showEconomyTab = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.pipe(take(1)).subscribe((response) => {
      this.generals = response.generals.data.data;
      // console.log(this.generals)
      this.showEconomyTab = this.generals.find((params) => params.key === "EconomySystem").value != null
      // console.log(this.showEconomyTab)
      this.settingsService.companyId.next(response.generals.data.company_id);
    });
    this.settingsService.isSavedSubject.subscribe((response) => {
      this.isSaved = response;
    });

  }

    changeTab(tab: number) {
        this.canDeactivate().pipe(take(1)).subscribe((response) => {
            if (response) {
                this.activeTab = tab;
                this.settingsService.isSavedSubject.next(true);
            }
        });
    }

  onSaveHandler() {

    if(this.activeTab == 3){
      this.child.savePermission();
    }else {
      this.settingsService.saveSubject.next(this.activeTab);
    }
  }

  canDeactivate(): Observable<boolean> {
    if (!this.isSaved) {
      const result = window.confirm("There are unsaved changes! Are you sure?");
      return of(result);
    }
      return of(true);
  }
}
