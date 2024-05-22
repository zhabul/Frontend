import { Component, OnInit, Input } from "@angular/core";
import { UsersService } from "src/app/core/services/users.service";
import { take } from "rxjs";

@Component({
  selector: "app-my-account-educations",
  templateUrl: "./my-account-educations.component.html",
  styleUrls: ["./my-account-educations.component.css"],
})
export class MyAccountEducationsComponent implements OnInit {
  @Input() userId = "userId";
  public educations = [];
  swiper = {
    images: [],
    active: -1,
    album: -2,
    index: -1,
    parent: null,
  };
  public loading = true;

  constructor(private userService: UsersService) {}

  ngOnInit(): void {
    this.userService.getEducationsForEditUser(this.userId).pipe(take(1)).subscribe({
      next: (res) => {
        this.educations = res["data"];
        this.loading = false;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  isPDFViewer: boolean = false;
  openSwiper(index, files, album) {
    if (files[index].document_type === "Image" || files[index].name.endsWith('.jpg') || files[index].name.endsWith('.jpeg') || files[index].name.endsWith('.png')) {
      this.isPDFViewer = false;
      this.swiper = {
        active: index,
        images: files,
        album: album,
        index: -1,
        parent: null,
      };
    } else {
      const fileArray = this.createFileArray(files[index]);
      this.isPDFViewer = true;
      this.swiper = {
        active: 0,
        images: fileArray,
        album: album,
        index: index,
        parent: files[index],
      };
    }
  }

  createFileArray(file) {
    const id = file.id;
    const comment = file.Description;
    const name = file.Name ? file.Name : file.name;
   // const image_path = file.image_path;
    const file_path = file.file_path;

    const fileArray = file_path.split(",").map((fileArray) => {
      return {
        image_path: fileArray,
        id: id,
        Description: comment,
        name: name,
        file_path: file_path,
      };
    });

    return fileArray;
  }

  closeSwiper() {
    this.swiper = {
      active: -1,
      images: [],
      album: -2,
      index: -1,
      parent: null,
    };
  }
}
