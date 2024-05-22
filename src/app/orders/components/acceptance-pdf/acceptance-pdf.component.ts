import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ProjectsService } from "src/app/core/services/projects.service";
import { AppService } from "src/app/core/services/app.service";

@Component({
  selector: "acceptance-pdf",
  templateUrl: "./acceptance-pdf.component.html",
  styleUrls: ["./acceptance-pdf.component.css"],
})
export class AcceptancePdfComponent implements OnInit {
  public order: any;
  public file: string;
  public fileExt: string;
  public userScalableToggle;

  swiper = {
    images: [],
    active: -1,
    album: -2,
    index: -1,
    parent: null,
  };

  constructor(
    private appService: AppService,
    private route: ActivatedRoute,
    private router: Router,
    private projectsService: ProjectsService
  ) {}

  ngOnInit() {
    this.order = this.route.snapshot.data["order"];
    this.file = this.order.file;
    this.fileExt = "";

    this.appService.setBackRoute("/projects/view/" + this.order.pid);
    this.appService.setShowAddButton = false;

    this.userScalableToggle = document.querySelector("meta[name='viewport']");
    this.userScalableToggle.content =
      "width=device-width, initial-scale=1.0, user-scalable=yes";
  }

  goBack() {
    this.userScalableToggle.content =
      "width=device-width, initial-scale=1.0, user-scalable=no";
    this.router.navigate(["/projects/view/" + this.order.pid]);
    this.projectsService.setCurrentTab(0);
  }

  onImageError(e) {
    this.fileExt = "pdf";
  }

  onImageLoad(e) {
    this.fileExt = "image";

    const file = {
      image_path: this.file,
      id: 1,
      Description: "",
      name: "",
      file_path: this.file,
    };

    this.openSwiper(0, [file], 0);
  }

  openSwiper(index, images, album) {
    this.swiper = {
      active: index,
      images: images,
      album: album,
      index: -1,
      parent: null,
    };
  }

  closeSwiper() {
    this.userScalableToggle.content =
      "width=device-width, initial-scale=1.0, user-scalable=no";
    this.router.navigate(["/projects/view/" + this.order.pid]);
    this.projectsService.setCurrentTab(0);
    this.swiper = {
      active: -1,
      images: [],
      album: -2,
      index: -1,
      parent: null,
    };
  }

  removeSwiperImage(e) {}
}
