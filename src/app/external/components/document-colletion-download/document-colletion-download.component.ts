import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-document-colletion-download',
    templateUrl: './document-colletion-download.component.html',
    styleUrls: ['./document-colletion-download.component.css']
})
export class DocumentColletionDownloadComponent implements OnInit {

    project_id: number;
    document_name: string;
    document_type: string;

    constructor(private route: ActivatedRoute,private translate: TranslateService,) { }

    ngOnInit(): void {
        this.route.paramMap.subscribe((params) => {
            this.project_id = parseInt(params.get("project_id"));
            this.document_type = params.get("document_type");

            if(params.get("document_type") == 'ata') {
                this.document_name = this.translate.instant('Atas');
            }
            else if(params.get("document_type") == 'du') {
                this.document_name = this.translate.instant('Weekly Report');
            }
            else if(params.get("document_type") == 'deviation') {
                this.document_name = this.translate.instant('Deviation');
            }
        });
    }
}
