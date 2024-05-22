import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  ViewChild
} from "@angular/core";
import { ProjectsService } from "src/app/core/services/projects.service";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { Observable, Subscription } from "rxjs";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { TimeAttestHistory } from "src/app/core/helpers/time-attest-history-to-excel";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { UsersService } from "src/app/core/services/users.service";

declare var $: any;

@Component({
  selector: "app-atest-history",
  templateUrl: "./atest-history.component.html",
  styleUrls: ["./atest-history.component.css"],
})
export class AtestHistoryComponent implements OnInit {
  public selectedWeek = '';
  public selectedUser = '';
  public selectedMoment = '';
  public selectedAta = '';
  public selectedState = '';
  public searchText = '';
  public projectUserDetails;

  @Input('selectedWeek') set setSelectedWeek(value) {
    if (value !== this.selectedWeek) {
      this.selectedWeek = value;
      this.filterHoursForAttest();
    }
  };
  @Input('selectedUser') set setSelectedUser(value) {
    if (value !== this.selectedUser) {
      this.selectedUser = value;
      this.filterHoursForAttest();
    }
  };
  @Input('selectedMoment') set setSelectedMoment(value) {
    if (value !== this.selectedMoment) {
      this.selectedMoment = value;
      this.filterHoursForAttest();
    }
  };

  @Input('selectedAta') set setSelectedAta(value) {
    if (value !== this.selectedAta) {
      this.selectedAta = value;
      this.filterHoursForAttest();
    }
  };

  @Input('selectedState') set setSelectedState(value) {
    if (value !== this.selectedState) {
      this.selectedState = value;
      this.filterHoursForAttest();
    }
  };

  @Input('searchText') set setSearchText(value) {
    if (value !== this.searchText) {
      this.searchText = value;
      this.filterHoursForAttest();
    }
  };
  public hoursForAtest: any[] = [];
  public hoursForAtestCopy: any[] = [];
  public hoursForAtestTotal: any = {};
  public pageSlice = this.hoursForAtest.slice(0, 3);
  public hoursForAtestFiltered: any[] = [];
  public totalHours: any = 0;

  public dataForStyle:  any[] = [];
  public totalAtaHours: any = 0;
  public totalProjectHours: any = 0;
  public subscription: Subscription;
  public notEdited: boolean = true;
  public commentValue: any;
  public userDetails: any;
  public spinner = false;
  public editingComment = false;
  public commentText = "";
  public pageOfItems: Array<any>;
  public p: number = 1;
  public NextTranslated = "Next";
  public project: any;
  public set_number_of_pages = true;
  public showAttachmentImage = false;
  public wrapper: any;
  public viewer: any;
  public rotateValue: number = 0;
  public urlSelected = "";
  public load_pagination: boolean = true;
  public number_of_page = 1;
  public initial_page_top: number = 1;
  public initial_page_bottom: number = 1;
  public marginLeft: number = 0;
  public next_color: any;
  public last_date: any;
  public from:number = 0;
  public allowLoadDataOnscroll:boolean = false;
  public selectOpen = true;
  public sumMomentChecked: any= []
  public isChecked = false;
  checked = true;
  onRemoveModalSub: any;
  userProjects: any = {};
  selectedImageInfo = {
    date: "",
    name: "",
    description: "",
    momentName: "",
  };
  swiper = {
    images: [],
    active: -1,
    album: -2,
  };

  projectId = 0;
  haveAllRecords = false;
  routeSub: any;
  items = [];
  pages = [];
  selectedPage = 1;
  maxPage: any = 0;
  public checked_for_revert = [];
  public language_for_xls_export = [];


  @ViewChild('bottomDiv') bottomDiv:any;
  @Input('scrollHeight') set setScrollHeight(value: { clientHeight: number }) {
    if (this.bottomDiv && !this.spinner ) {
      this.fetchItemsOnVisible(value.clientHeight);
    }
  }

  public fetchMore = true;

  fetchItemsOnVisible(clientHeight) {
        const bottomeDiv = this.bottomDiv.nativeElement;
        const rect = bottomeDiv.getBoundingClientRect();
        if (this.fetchMore && rect.top > 0 && rect.bottom <= (clientHeight + 200)) {
          this.from = this.from + 20;
          this.getInitialHoursForAtestHistory(
            this.projectId,
            20,
            this.from,
            this.selectedUser,
            this.selectedMoment,
            this.selectedWeek,
            this.selectedAta,
            this.searchText,
            false
          );
      }
  }


  private ex: TimeAttestHistory = new TimeAttestHistory();
  @Input() events: Observable<void>;
  @Output() uniqueWeeks: EventEmitter<any> = new EventEmitter();
  @Output() filteringUsers: EventEmitter<any> = new EventEmitter();
  @Output() filteringMoments: EventEmitter<any> = new EventEmitter();
  @Output() filteringAtas: EventEmitter<any> = new EventEmitter();
  @Output() filteringStates: EventEmitter<any> = new EventEmitter();

  constructor(
    private projectService: ProjectsService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    public translate: TranslateService,
    public cd: ChangeDetectorRef,
    private dialog: MatDialog,
    private userService: UsersService
  ) {}

  ngOnInit() {

    this.projectUserDetails = this.route.snapshot.data["projectUserDetails"];
    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    this.NextTranslated = this.translate.instant("Next");
    this.projectId = this.route.snapshot.params.id;

    this.routeSub = this.route.params.subscribe((values) => {
      this.projectId = values.id;

      this.getInitialHoursForAtestHistory(
        this.projectId,
        20,
        0,
        this.selectedUser,
        this.selectedMoment,
        this.selectedWeek,
        this.selectedAta,
        this.searchText,
        true
      );


       this.getProject();

    });

    this.getUserLangugeForXlsExport();
  }



  toggleselectOpen() {
    this.selectOpen = !this.selectOpen;
  }

  setStyle() {
    return {
      left: this.marginLeft + "px",
    };
  }

  ngAfterViewChecked() {
    let first = this.translate.instant("First");
    let previous = this.translate.instant("Previous");
    let next = this.translate.instant("Next");
    let last = this.translate.instant("Last");

    $(".first-item").find(".page-link").text(first);
    $(".previous-item").find(".page-link").text(previous);
    $(".next-item").find(".page-link").text(next);
    $(".last-item").find(".page-link").text(last);
  }

  getProject() {
    this.projectService.getProject(this.projectId).then((res) => {
      this.project = res;
    });
  }

  ngOnDestroy() {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  public toggleShowComment(moment) {
    moment.show = !moment.show;

    if (moment.show) this.notEdited = false;
    else this.notEdited = true;
  }

  public toggleEditComment(moment) {
    this.commentText = moment["comment"];
    this.editingComment = !this.editingComment;

    moment.show = !moment.show;

    if (moment.show) this.notEdited = false;
    else this.notEdited = true;
  }

    public revertAtestAll(moments){
      const diaolgConfig = new MatDialogConfig();
      diaolgConfig.autoFocus = false;
      diaolgConfig.disableClose = true;
      diaolgConfig.width = "";
      diaolgConfig.data = {
        questionText:  this.translate.instant("Are you sure you want to revert all checked moments?"),
      };
      diaolgConfig.panelClass = "mat-dialog-confirmation";
      this.dialog
      .open(ConfirmationModalComponent, diaolgConfig)
      .afterClosed()
      .subscribe((response) => {
        if(response.result){
            this.spinner = true;
            this.projectService.revertAtestByIDS(this.checked_for_revert).then((res) => {
            if(res) {
              setTimeout(() => {
                this.filterHoursForAttest();
              }, 2000);
            }});
        }});
    }


    checkedRevert(moment, itemIndex, userIndex, momentIndex){

        moment.checked = !moment.checked;
        moment.seen = 0;
        if(moment.checked){
          this.checked_for_revert.push({ momentId: moment.momentId, seen: moment.seen} );
        }else {
          this.checked_for_revert = this.checked_for_revert.filter((el, index) => {
            return moment.momentId != el.momentId;
          })
        }
    }

  public revertAtest(momentId, itemIndex, userIndex, momentIndex) {
    const diaolgConfig = new MatDialogConfig();
    diaolgConfig.autoFocus = false;
    diaolgConfig.disableClose = true;
    diaolgConfig.width = "";
    diaolgConfig.panelClass = "mat-dialog-confirmation";
    this.dialog
      .open(ConfirmationModalComponent, diaolgConfig)
      .afterClosed()
      .subscribe((response) => {
        if (response.result) {
          this.spinner = true;
          if (
            this.hoursForAtest[itemIndex].users[userIndex].moments.length < 1
          ) {
            this.hoursForAtest[itemIndex].users.splice(userIndex, 1);

            if (this.hoursForAtest[itemIndex].users.length < 1) {
              this.hoursForAtest.splice(itemIndex, 1);
            }
          }

          this.hoursForAtestFiltered.forEach((timesheet, key_t) => {
            timesheet.users.forEach((user, key_u) => {
              user.moments.forEach((moment, i) => {
                if (moment.momentId === momentId) user.moments.splice(i, 1);
              });
            });
          });

          this.projectService.revertAtest(momentId).then((res) => {
            if (res["status"]) {
              this.toastr.success(
                this.translate.instant("Successfully reverted attested time."),
                this.translate.instant("Success")
              );
              this.filterHoursForAttest();
              setTimeout(() => {
                this.spinner = false;
                this.filterHoursForAttest();
              }, 2000);
            } else {
              this.toastr.error(
                this.translate.instant(
                  "There was an error while trying to revert atested time."
                ),
                this.translate.instant("Error")
              );
            }
          });
        }
      });
  }

  public calculateTotalTimeForUser(user) {
    let total = 0;

    user.moments.forEach((moment) => {
      total += parseInt(moment.time, 10);
    });

    return total;
  }

  calculateOffset() {
    let offset = 0;
    if (Number(this.selectedPage) > 1) {
      offset = (Number(this.selectedPage) - 1) * 20;
    }

    return offset;
  }

  filterHoursForAttest() {
    if (this.projectId) {
      this.fetchMore = true;
      const offset = this.calculateOffset();
      this.getInitialHoursForAtestHistory(
        this.projectId,
        20,
        offset,
        this.selectedUser,
        this.selectedMoment,
        this.selectedWeek,
        this.selectedAta,
        this.searchText,
        true,
        true
      );
    }


  }

  public getInitialHoursForAtestHistory(
    project_id,
    size,
    from,
    user_name,
    moment,
    week,
    ata,
    word,
    load_pagination = true,
    from_filters = false
  ) {
    this.spinner = true;

    if (from_filters) {
      from = 0;
      size = 20;
    }

    if (ata == "") {
      ata = null;
    }

    if (user_name == "") {
      user_name = null;
    }

    if (word == "") {
      word = null;
    }

    if (week == "") {
      week = null;
    }

    if (moment == "") {
      moment = null;
    }

    let object = {
      project_id: project_id,
      size: size,
      from: from,
      user_name: user_name,
      moment: moment,
      week: week,
      ata: ata,
      word: word,
      next_color: this.next_color,
      last_date: this.last_date,
    };




    this.projectService.getHoursForAtestHistory(object).then((data) => {


      if (this.selectedWeek == "")
        this.uniqueWeeks.emit(data["weekly_report_names"]);
      if (this.selectedUser == "") this.filteringUsers.emit(data["user_names"]);
      if (this.selectedMoment == "")
        this.filteringMoments.emit(data["moment_names"]);
      if (this.selectedAta == "") this.filteringAtas.emit(data["ata_names"]);

      this.hoursForAtestTotal = data["total"];

      this.totalHours = data["total"]["sumTotalHoursPerProjects"];
      this.totalAtaHours = data["total"]["sumTotalAtaHours"];
      this.totalProjectHours = data["total"]["sumTotalProjectHours"];

      if(data['number_of_pages'] < 2) {
          this.allowLoadDataOnscroll = false;
      }

      const items = data["items"];

      if(from_filters) {
          this.hoursForAtest = items;
      }else {
          this.hoursForAtest = [...this.hoursForAtest, ...items];
      }

      if (items.length === 0) {
        this.fetchMore = false;
      }

      this.hoursForAtestCopy = data["items"];
      this.hoursForAtestTotal = data["total"];
      if (load_pagination) {
        this.items = data["number_of_pages"];
        this.set_number_of_pages = false;
        this.generatePageArray(this.selectedPage);
      }

      if (data["items"].length > 0) {
        this.totalHours = data["total"]["sumTotalHoursPerProjects"];
        this.totalAtaHours = data["total"]["sumTotalAtaHours"];
        this.totalProjectHours = data["total"]["sumTotalProjectHours"];
      } else {
        this.totalHours = 0;
      }

      this.hoursForAtestFiltered = JSON.parse(
        JSON.stringify(this.hoursForAtest)
      );
      this.spinner = false;
      this.next_color = data["next_color"];
      this.last_date = data["last_date"];
    });

  }

  bottomReached(): boolean {
      return window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;
  }

  generatePageArray(selectedPage, clicked = null) {
    this.maxPage = this.items;

    this.selectedPage =
      selectedPage > this.maxPage
        ? this.maxPage
        : selectedPage < 1
        ? 1
        : selectedPage;
    const selPageMinus = this.selectedPage - 4;
    const selPagePlus = this.selectedPage + 4;
    const limit =
      selPagePlus > this.maxPage
        ? this.maxPage
        : this.maxPage >= 10
        ? selPagePlus > 10
          ? selPagePlus
          : 10
        : selPagePlus;
    const start =
      selPageMinus < 1
        ? 1
        : selPageMinus > this.maxPage - 9
        ? this.maxPage - 9
        : selPageMinus;

    const newPages = [];

    for (let i = start; i <= limit; i++) {
      newPages.push(i);
    }

    this.pages = newPages;

    const offset = this.calculateOffset();

    if (clicked)

      this.getInitialHoursForAtestHistory(
        this.projectId,
        20,
        offset,
        this.selectedUser,
        this.selectedMoment,
        this.selectedWeek,
        this.selectedAta,
        this.searchText,
        false
      );


  }

  exportExcel() {
    let ata = this.selectedAta;
    let user_name = this.selectedUser;
    let word = this.searchText;
    let week = this.selectedWeek;
    let moment = this.selectedMoment;

    if (ata == "") {
      ata = null;
    }

    if (user_name == "") {
      user_name = null;
    }

    if (word == "") {
      word = null;
    }

    if (week == "") {
      week = null;
    }

    if (moment == "") {
      moment = null;
    }

    let object = {
      project_id: this.projectId,
      size: 10000,
      from: 0,
      user_name: user_name,
      moment: moment,
      week: week,
      ata: ata,
      word: word,
    };

    this.projectService.getHoursForAtestHistory(object).then((data) => {


      this.ex.setData({
        saveName: this.project.CustomName,
        projectName:
          this.project.CustomName +
          " " +
          this.project.name,
        weeks: data.items,
        totals: {
          totalHours: data.total.sumTotalHoursPerProjects,
          totalAtaHours: data.total.sumTotalAtaHours,
          totalProjectHours: data.total.sumTotalProjectHours,
        },
      });
      this.ex.newWorksheet("test");
      this.ex.toExcel();
    });

  }

  public closeModal(moment) {
    moment.show = !moment.show;
    this.editingComment = false;
  }

  public closeModalAndSave(moment) {
    if (this.commentValue == null) this.commentValue = "-1";

    if (this.commentValue && moment.atestComment != this.commentValue) {
      moment["project_id"] = this.projectId;
      moment["from_history"] = true;
      this.projectService.updateAtestComment(moment).then((res) => {
        if (res["status"]) {
          moment.comment_responsible_author =
            this.userDetails.firstname + " " + this.userDetails.lastname;
        }
      });
    }
    this.notEdited = true;
    moment.show = !moment.show;
  }

  public closeModalAndEditComment(moment) {
    moment.comment = this.commentText;
    this.projectService.updateMomentComment(moment).then((res) => {
      if (res["status"]) {
        moment.comment = moment.comment;
      }
    });
    this.notEdited = true;
    moment.show = !moment.show;
    this.editingComment = false;
  }

  getDateOfWeek(w, y) {
    let date = new Date(y, 0, 1 + (w - 1) * 7); // Elle's method
    date.setDate(date.getDate() + (1 - date.getDay())); // 0 - Sunday, 1 - Monday etc
    return date;
  }

  getAtaIdByAtaNumber(ataNumber) {
    let ataId = 0;
    this.hoursForAtest.forEach((x) => {
      x["users"].forEach((y) => {
        y["moments"].forEach((m) => {
          if (m["AtaNumber"] == ataNumber.split("-")[1] && ataId === 0) {
            ataId = m["ataId"];
          }
        });
      });
    });
    return ataId;
  }

  toggleAttachmentImage() {
    this.showAttachmentImage = !this.showAttachmentImage;
  }

  closeAttachment() {
    this.showAttachmentImage = !this.showAttachmentImage;
    this.urlSelected = "";
  }

  rotateRight() {
    this.rotateValue = this.rotateValue + 90;
    let d = document.getElementsByClassName(
      "iv-large-image"
    )[0] as unknown as HTMLElement;
    d.style.transform = "rotate(" + this.rotateValue + "deg)";
    let x = document.getElementsByClassName(
      "iv-snap-image"
    )[0] as unknown as HTMLElement;
    x.style.transform = "rotate(" + this.rotateValue + "deg)";
    let c = document.getElementsByClassName(
      "iv-snap-handle"
    )[0] as unknown as HTMLElement;
    c.style.transform = "rotate(" + this.rotateValue + "deg)";
  }

  rotateLeft() {
    this.rotateValue = this.rotateValue - 90;
    let d = document.getElementsByClassName(
      "iv-large-image"
    )[0] as unknown as HTMLElement;
    d.style.transform = "rotate(" + this.rotateValue + "deg)";
    let x = document.getElementsByClassName(
      "iv-snap-image"
    )[0] as unknown as HTMLElement;
    x.style.transform = "rotate(" + this.rotateValue + "deg)";
    let c = document.getElementsByClassName(
      "iv-snap-handle"
    )[0] as unknown as HTMLElement;
    c.style.transform = "rotate(" + this.rotateValue + "deg)";
  }

  isPDFViewer: boolean = false;
  openSwiper(images) {
    this.isPDFViewer = false;
    this.swiper = {
      active: 0,
      images: images,
      album: 0,
    };
  }

  closeSwiper() {
    this.swiper = {
      active: -1,
      images: [],
      album: -2,
    };
  }

    allowEdit() {

        let status = false;
        const permissions = {
            allow_attest: Number(this.userDetails.create_project_timeattest),
            allow_attest2: Number(this.projectUserDetails.Atest),
        }

        if (permissions.allow_attest || permissions.allow_attest2) {
            status = true;
        }

        return status;
    }

    getUserLangugeForXlsExport() {
      this.userService.getUserLangugeForXlsExport().subscribe((result:any) => {
          if(result.status) {
            this.language_for_xls_export = result.data;
            this.ex.setLanguage(this.language_for_xls_export);
          }
      });
  }
}
