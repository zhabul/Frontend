import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { DomSanitizer } from "@angular/platform-browser";


@Component({
  selector: 'app-pdf-modal-preview',
  templateUrl: './pdf-modal-preview.component.html',
  styleUrls: ['./pdf-modal-preview.component.css']
})
export class PdfModalPreviewComponent implements OnInit {

    pdf_preview:any;

    constructor(
        public dialogRef: MatDialogRef<PdfModalPreviewComponent>,
        @Inject(MAT_DIALOG_DATA) public modal_data: any,
        public sanitizer: DomSanitizer,
    ) {
        this.pdf_preview = this.sanitizer.bypassSecurityTrustResourceUrl(this.modal_data.pdf_link);
    }

    ngOnInit(): void {
    }
}
