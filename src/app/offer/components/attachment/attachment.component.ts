import { Component, OnInit, Input } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";

declare var $;

@Component({
  selector: "app-attachment",
  templateUrl: "./attachment.component.html",
  styleUrls: ["./attachment.component.css"],
})
export class AttachmentComponent implements OnInit {
  @Input() offer: any;

  public createForm: FormGroup;
  public buttonToggle = false;
  public buttonName = "+";
  public parentDirectories: any[] = [];
  public childrenDirectories: any[] = [];
  public userDetails;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));

    this.createForm = this.fb.group({
      Url: ["", [Validators.required]],
      Type: ["", [Validators.required]],
      ChildrenDirectory: ["", []],
    });
  }

  buttonNameToggle() {
    this.buttonToggle = !this.buttonToggle;
    if (this.buttonToggle == true) {
      this.buttonName = "-";
    } else {
      this.buttonName = "+";
    }
  }
  uploadAttachment() {}
  openModal() {}

  onChangeSetChildren(e) {}
  onFileChange(m) {}
}
