import { Component, OnInit } from "@angular/core";
import { AttachmentService } from "src/app/core/services/attachment.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AppService } from "src/app/core/services/app.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-directory-detail",
  templateUrl: "./directory-detail.component.html",
  styleUrls: ["./directory-detail.component.css"],
})
export class DirectoryDetailComponent implements OnInit {
  public directories: any[] = [];
  public userDetails: any;
  public messages: object;
  public lang: string; 
  public belongsTo: any;
  public projectId: any;
  public previousRoute: string;

  public showCreateFile = false;
  public showCreateFolder = false;

  public file: any;
  public fileName: string;

  public uploadMessage: any;
  public directory: any;

  public canPressSave = true;
  public hasLock = 1;
  public userScalableToggle;

  constructor(
    private route: ActivatedRoute,
    private attachmentService: AttachmentService,
    private toastr: ToastrService,
    private router: Router,
    private appService: AppService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.userScalableToggle = document.querySelector("meta[name='viewport']");
    this.userScalableToggle.content =
      "width=device-width, initial-scale=1.0, user-scalable=no";

    this.projectId = this.route.snapshot.params.id;
    this.belongsTo = this.route.snapshot.params.directory_id;
    this.directory = this.route.snapshot.data["directory"]["data"];
    this.directories = this.route.snapshot.data["directories"]["data"] || [];

    this.appService.setShowAddButton = false;
    this.previousRoute =
      this.directory.belongs_to == "0"
        ? "/projects/view/" + this.directory.project_id
        : "/projects/directory/" +
          this.directory.belongs_to +
          "/" +
          this.directory.project_id;
    this.appService.setBackRoute(this.previousRoute);

    this.lang = sessionStorage.getItem("lang");
    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
  }

  onFileChange(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      this.uploadMessage = event.target.files[0].name;

      reader.onload = () => {
        this.file = reader.result;
        this.fileName = event.target.files[0].name;
      };
    }
  }

  toggleCreateFile(e): void {
    if (e) {
      if (e.target.id !== "looksLikeModal") {
        return;
      }
    }
    this.showCreateFile = !this.showCreateFile;
    this.showCreateFolder = false;
    this.uploadMessage = null;
    this.file = null;
  }

  toggleCreateFolder(e): void {
    if (e) {
      if (e.target.id !== "looksLikeModal") {
        return;
      }
    }
    this.showCreateFile = false;
    this.showCreateFolder = !this.showCreateFolder;
  }
  async addNewFolder(folderName) {
    if (!this.canPressSave) {
      return;
    }

    this.canPressSave = false;

    if (folderName.trim().length < 1) {
      this.toastr.error(
        this.translate.instant(
          "Please enter name of folder before creating it."
        ),
        this.translate.instant("Error")
      );
      this.canPressSave = true;
      return;
    }

    const res = await this.attachmentService.addNewFolder({
      folderName,
      belongs_to: this.belongsTo,
      project_id: this.projectId,
    });

    if (!res["status"]) {
      this.toastr.error(
        this.translate.instant("There was an error while creating folder."),
        this.translate.instant("Error")
      );
      this.canPressSave = true;
      return;
    }

    this.showCreateFolder = false;

    this.toastr.success(
      this.translate.instant("Successfully created folder."),
      this.translate.instant("Success")
    );

    this.directories.push(res["createdAttachment"]);

    this.canPressSave = true;
  }

  async addNewFile() {
    if (!this.canPressSave) {
      return;
    }

    this.canPressSave = false;

    if (!this.file) {
      this.toastr.error(
        this.translate.instant("Please choose file."),
        this.translate.instant("Error")
      );
      this.canPressSave = true;
      return;
    }
    const res = await this.attachmentService.addNewFile({
      name: this.fileName,
      belongs_to: this.belongsTo,
      project_id: this.projectId,
      file: this.file,
    });

    if (!res["status"]) {
      this.toastr.error(
        this.translate.instant("There was an error while creating file."),
        this.translate.instant("Error")
      );
      this.canPressSave = true;
      return;
    }

    this.showCreateFile = false;

    this.toastr.success(
      this.translate.instant("Successfully created file."),
      this.translate.instant("Success")
    );

    this.directories.push(res["createdAttachment"]);

    this.canPressSave = true;
  }

  async deleteFolder() {
    const res = await this.attachmentService.deleteAttachment(this.belongsTo);

    if (res["status"] === -1) {
      this.toastr.error(
        this.translate.instant("Folder must be empty before deleting it."),
        this.translate.instant("Error")
      );
    } else if (res["status"]) {
      this.router.navigate([this.previousRoute]);

      this.toastr.success(
        this.translate.instant("Successfully deleted folder."),
        this.translate.instant("Success")
      );
    } else {
      this.toastr.error(
        this.translate.instant(
          "There was an error while trying to delete folder."
        ),
        this.translate.instant("Error")
      );
    }
  }

  formatName(name) {
    return name;
  }

  goTo(i, e) {
    if (e) {
      if (e.target.dataset.id === "noNavigate") {
        return;
      }
    }
    const route =
      this.directories[i].type === "folder"
        ? "projects/directory/" +
          this.directories[i].Id +
          "/" +
          this.directories[i].project_id
        : "projects/directory/file/" +
          this.directories[i].Id +
          "/" +
          this.directories[i].project_id;
    this.router.navigate([route]);
  }
  changeLock(directory, i) {
    if (this.userDetails.type == 1) {
      this.attachmentService
        .changeLockAttachment(
          directory.Id,
          Number(!parseInt(directory.lock)).toString()
        )
        .subscribe((res) => {
          this.directories[i].lock = Number(
            !parseInt(directory.lock)
          ).toString();
        });
    }
  }
}
