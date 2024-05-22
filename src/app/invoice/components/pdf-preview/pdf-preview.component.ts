import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-pdf-preview",
  templateUrl: "./pdf-preview.component.html",
  styleUrls: ["./pdf-preview.component.css"],
})
export class PdfPreviewComponent implements OnInit {
  @Input() pdfs_preview;
  constructor() {}

  ngOnInit() {}
}
