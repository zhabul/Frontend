import {
  Component,
  OnInit,
  Input,
  AfterViewInit,
  AfterViewChecked,
} from "@angular/core";
import { ProjectsService } from "src/app/core/services/projects.service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import * as _ from "underscore";

@Component({
  selector: "app-permit-children",
  templateUrl: "./permit-children.component.html",
  styleUrls: ["./permit-children.component.css"],
})
export class PermitChildrenComponent
  implements OnInit, AfterViewInit, AfterViewChecked
{
  @Input() project: any;

  public user_id: any;
  public user: any;
  public projectUserId: any;
  public gender = "male";
  public StartDate: any;
  public EndDate: any;
  public language = "en";
  public week = "Week";
  public userDetails: any;
  public users: any[] = [];

  constructor(
    private projectsService: ProjectsService,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {
    this.language = sessionStorage.getItem("lang");
    this.translate.use(this.language);
  }

  ngAfterViewChecked() {}

  ngAfterViewInit() {}

  ngOnInit() {
    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));

    this.projectsService
      .getChildrenProjectUsers(this.project.parent, this.project.id)
      .then((res) => {
        console.log(res);
        if (res["status"]) {
          this.users = res["data"];
          this.user = this.users[0];
        }
      });
  }

  addUserToChildProject(index, isChecked) {
    if (isChecked && isChecked == true) isChecked = 1;
    else isChecked = 0;

    this.user = this.users[index];

    let data = {
      ProjectID: this.project.id,
      UserId: this.user.id,
      ProjectParentID: this.project.parent,
      isChecked: isChecked,
    };

    this.projectsService.addUserToChildProject(data).then((res) => {
      console.log(res);

      if (res["status"])
        this.toastr.success(
          this.translate.instant(
            "You have successfully added worker on project!"
          ),
          this.translate.instant("Info")
        );
      else
        this.toastr.error(
          this.translate.instant("Something went wrong!"),
          this.translate.instant("Info")
        );
    });
  }
}
