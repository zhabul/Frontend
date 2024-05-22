import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AttachmentService } from 'src/app/core/services/attachment.service';
import { LoadingSpinnerService } from 'src/app/core/services/loading-spinner.service';

interface Folder {
  name: string;
  description: string;
}

@Component({
  selector: 'app-new-folder-dialog',
  templateUrl: './new-folder-dialog.component.html',
  styleUrls: ['./new-folder-dialog.component.css']
})
export class NewFolderDialogComponent implements OnInit {
  folder: Folder = {
    name: '',
    description: ''
  };

  data;

  constructor(
    private dialogRef: MatDialogRef<NewFolderDialogComponent>,
    private toastr: ToastrService,
    private attachmentService: AttachmentService,
    private loadingSpinnerService: LoadingSpinnerService,
    @Inject(MAT_DIALOG_DATA) data,
  ) {
    this.data = data;
  }

  ngOnInit(): void {
  }


  async onSave() {
    if (this.folder.name.trim().length < 1) {
      this.toastr.error("Please enter name of folder before creating it.");
      return;
    }
    const folderName = this.folder.name;
    const res = await this.attachmentService.addNewFolder({
      folderName,
      comment: this.folder.description,
      belongs_to: this.data.belongsTo,
      project_id: this.data.projectId,
      ataid: this.data.ataid,
      attachmentCategory: this.data.category
    });

    if (!res['status']) {
      this.toastr.error("There was an error while creating folder.");
      return;
    }

    if (res['status']) {
      this.toastr.success("Successfully created folder.");
    }

    this.loadingSpinnerService.setLoading(true);
    this.dialogRef.close();

  }


  /* givePermissionForFolder(folderId) {

    if (this.data.belongsTo == '0') return;
    this.attachmentService.getDocumentPermissions(this.data.belongsTo).pipe(take(1), map(
      (response: {status: boolean, data: any[]}) => {
        if (response.status) return response.data;
        return [];
      }
    )).subscribe({
      next: (response: any[]) => {
        if (response.length == 0) return;
        for (const item of response) {
          for (let permission of item.optionIds) {
            const dataToSave = {
              roleId: parseInt(item.userRoleId),
              option: parseInt(permission),
              contentType: 'attachment',
              contentId: parseInt(folderId.Id)
            };
            this.attachmentService.createUserPermissionRole(dataToSave).pipe(take(1)).subscribe();
          }
        }
      }
    });
  } */

  onClose() {
    this.dialogRef.close();
  }


}
