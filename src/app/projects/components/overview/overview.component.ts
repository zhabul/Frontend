import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  ViewChild,
} from "@angular/core";
import { RemembererService } from "src/app/core/services/rememberer.service";
import { FormGroup, FormControl, NgForm } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Subject } from "rxjs";
import { AtestInfoService } from "./components/atest/atest-info.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ConfirmModalComponent } from "src/app/shared/modals/confirm-modal/confirm-modal.component";

@Component({
  selector: "app-overview",
  templateUrl: "./overview.component.html",
  styleUrls: ["./overview.component.css"],
})
export class OverviewComponent implements OnInit {

  @ViewChild("myform", { static: true }) myform!: NgForm;
  @Input() project: any;
  @Input() users: any;
  @Input() availableAtasOrDu: any;

  public activeTab = 0;
  public selectedWeek = "";
  public selectedUser = "";
  public selectedMoment = "";
  public selectedState = "";
  public selectedAta = "";
  public searchText = "";
  public inputText = "";
  is_active:boolean = true;
  public weeks = [];
  public filteringUsers = [];
  public filteringMoments = [];
  public filteringStates = [];
  public filteringAtas = [];

  public scrollHeight = { clientHeight: 0 };
    public project_id;
  public colors:any = {
    backgroundColor: "#1A1A1A",
    color: "white",
    border: '1px solid #ced4da',
    height: "26px",
    width: "180px"
  };
  public documents:any[] = [];
  public container_height = "calc(100vh - 154px - 0px)";
  @Input("top_menu_status") set containerHeight(status) {
    if (status == true) {
      this.container_height = "calc(100vh - 537px - 0px)";
    } else {
      this.container_height = "calc(100vh - 154px - 0px)";
    }
  }

  public onScrollEvent: Subject<any> = new Subject<any>();
  onScrollObservable$ = this.onScrollEvent.asObservable();
  @Output() attestSave: EventEmitter<any> = new EventEmitter();

  createForm = new FormGroup({
    ata: new FormControl(""),
    ata_name: new FormControl(""),
    moment: new FormControl(""),
    moment_name: new FormControl(""),
    users: new FormControl(""),
    users_name: new FormControl(""),
    week: new FormControl(""),
    week_name: new FormControl(""),
  });
  spinner: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private remembererService: RemembererService,
    private cd: ChangeDetectorRef,
    private translate: TranslateService,
    private atestInfoService: AtestInfoService,
    private dialog: MatDialog,
  ) {}

    ngOnInit() {
        this.project_id = this.route.snapshot.params.id;
        this.activeTab = this.remembererService.getState(
            this.router.url,
            "overviewTab",
            0
        );
        this.getMomentsDocuments();
    }

    onScroll(event) {
        this.onScrollEvent.next(event);
        if(event.target.clientHeight){
            const clientHeight = event.target.clientHeight;
            this.scrollHeight = { clientHeight } ;
        }else{
            return false;
        }
    }

    setActiveTab(index) {
        this.activeTab = index;
        this.createForm.patchValue({
            ata: "",
            ata_name: this.translate.instant("Atas"),
            moment: "",
            moment_name: this.translate.instant("Moments"),
            users: "",
            users_name: this.translate.instant("Users"),
            week: "",
            week_name: this.translate.instant("Week"),
        });
        this.selectedWeek = "";
        this.selectedUser = "";
        this.selectedMoment = "";
        this.selectedState = "";
        this.selectedAta = "";
        this.searchText = "";
        this.inputText = "";
        this.remembererService._setState(
            this.router.url,
            "overviewTab",
            this.activeTab
        );
    }


  onGetInformation(info, object, text) {

    if (object === "filteringAtas") {
      info.unshift("ATAS");
    }
     info.unshift("");

    this[object] = info.map((item) => {
      const newObj = {};

      if (item === "") {
        let text_ = this.translate.instant(text);
        if (text === "Atas") {
          text_ = `${this.translate.instant("All")}`;
        }

        newObj["finalName"] = text_;
        newObj["id"] = "";
      } else if (item === "ATAS") {
        newObj["finalName"] = this.translate.instant(text);
        newObj["id"] = "Atas";
      } else if (item === null) {
        newObj["finalName"] = this.translate.instant("Project");
        newObj["id"] = "Project";
      } else {
        newObj["finalName"] = this.translate.instant(item);
        newObj["id"] = item;
      }

      return newObj;
    });
  }

  onGetFilteringStates(filteringStates) {
    this.filteringStates = filteringStates;
  }

  setState(info, state) {
    this[state] = info.value;
  }

  onAttestSave(e) {
    this.attestSave.emit(true);
  }

  ngAfterContentChecked() {
    this.cd.detectChanges();
  }

  public setSearchText() {
    this.searchText = this.inputText;
  }

    public clearSearchText() {
        this.inputText = '';
        this.searchText =  this.inputText;
    }

    onConfirmationModal(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const dialogConfig = new MatDialogConfig();
            dialogConfig.autoFocus = false;
            dialogConfig.disableClose = true;
            dialogConfig.width = "185px";
            dialogConfig.panelClass = "confirm-modal";
            this.dialog.open(ConfirmModalComponent, dialogConfig).afterClosed()
            .subscribe((response) => {
                if(response.result) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }

    async canYouChangeTab(index: number) {
        let theFormHasBeenChanged: boolean;
        this.atestInfoService.getIfHasChangesOnForm().subscribe((response) => {
            theFormHasBeenChanged = response;
        });

        if(theFormHasBeenChanged) {
        if(await this.onConfirmationModal()) {
            this.atestInfoService.setIfHasChangesOnForm(false);
            this.setActiveTab(index);
        }
        } else {
            this.setActiveTab(index);
        }
    }

    getMomentsDocuments() {
        this.atestInfoService.getMomentsDocuments(this.project.id).subscribe((response:any) => {
            if(response.status) {
                this.documents = response['data']
            }
        });
    }
}
