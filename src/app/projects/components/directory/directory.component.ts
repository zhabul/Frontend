import { Component, OnInit, Inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { AttachmentService } from "src/app/core/services/attachment.service";

@Component({
  selector: "app-directory",
  templateUrl: "./directory.component.html",
  styleUrls: ["./directory.component.css"],
})
export class DirectoryComponent implements OnInit {
  public createForm: FormGroup;
  public showChildrenSelect = false;
  public language = "en";
  public message: any;
  public messageErr: any;
  public messageCont: any;

  constructor(
    public dialogRef: MatDialogRef<DirectoryComponent>,
    @Inject(MAT_DIALOG_DATA) public modal_data: any,
    public attachmentService: AttachmentService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.language = sessionStorage.getItem("lang");
  }

  ngOnInit() {
    if (this.language == "en") {
      this.message = "You have successfully added new directory!";
      this.messageErr = "There was an error with your submission !";
    } else if (this.language == "sw") {
      this.message = "Du har lagt till ny katalog!";
      this.messageErr = "Det var ett fel med din inlämning";
    } else if (this.language == "hr") {
      this.message = "Uspješno kreiran direktorij.";
      this.messageErr = "Došlo je do greške.";
    }

    this.createForm = this.fb.group({
      Name: ["", [Validators.required]],
      Parent: ["", [Validators.required]],
      Children: [null, []],
    });
  }

  createDirectory() {
    if (this.createForm.valid) {
      const formValue = this.createForm.value;

      const data = {
        Name: formValue.Name,
        Parent: formValue.Parent,
        Children: formValue.Children,
        ProjectID: this.modal_data.project.id,
      };

      this.attachmentService.createDirectory(data).subscribe((response) => {
        if (data.Parent == "0")
          this.modal_data.parentDirectories.push(response["data"].pop());
        this.toastr.success(this.message, "Katalog!");
        this.dialogRef.close();
      });
    }
  }

  onChangeParent(type) {
    if (type == "1") this.showChildrenSelect = true;
    else this.showChildrenSelect = false;
    this.createForm.value.Children = null;
  }
}
