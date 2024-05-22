import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BASE_URL } from "../../config";
import "src/app/core/extensions/rxjs-observable-promise";
import { Subject } from "rxjs";
import { saveAs } from "file-saver";

@Injectable({
  providedIn: "root",
})
export class AttachmentService {
  private getChildrenDirectoriesUrl: string =
    BASE_URL + "api/attachment/getChildrenDirectories";
  private getParentDirectoriesUrl: string =
    BASE_URL + "api/attachment/getParentDirectories";
  private createDirectoryUrl: string =
    BASE_URL + "api/attachment/createDirectory";
  private getChildrenDirectoriesBelongsToParentIDUrl: string =
    BASE_URL + "api/attachment/getChildrenDirectoriesBelongsToParentID";
  private getAttachmentsUrl: string =
    BASE_URL + "api/attachment/getAttachments";
  private getAttachmentClientsUrl: string =
    BASE_URL + "api/attachment/getAttachmentsClient";
  private getAttachmentsByAtaIdUrl: string =
    BASE_URL + "api/attachment/getAttachmentsByAtaId";
  private getAttachmentUrl: string = BASE_URL + "api/attachment/getAttachment";
  private getAttachmentClientUrl: string =
    BASE_URL + "api/attachment/getAttachmentClient";
  private changeLockAttachmentUrl: string =
    BASE_URL + "api/attachment/changeLockAttachment";
  private getChildrenAttachmentsUrl: string =
    BASE_URL + "api/attachment/getChildrenAttachments";
  private addNewFolderUrl: string = BASE_URL + "api/attachment/addNewFolder";
  private addNewFileUrl: string = BASE_URL + "api/attachment/addNewFile";
  private addNewFilesUrl: string = BASE_URL + "api/attachment/addNewFiles";
  private addNewFilesForEducationUrl: string =
    BASE_URL + "api/attachment/addNewFilesForEducation";
  private addNewFileClientUrl: string =
    BASE_URL + "api/attachment/addNewFileClient";
  private addNewFilesClientUrl: string =
    BASE_URL + "api/attachment/addNewFilesClient";
  private deleteAttachmentUrl: string =
    BASE_URL + "api/attachment/deleteAttachment";
  private downloadFolderUrl: string =
    BASE_URL + "api/attachment/downloadFolder";
  private updateCommentUrl: string = BASE_URL + "api/attachment/updateComment";
  private removeSelectedDocumentsUrl: string =
    BASE_URL + "api/attachment/removeSelectedDocuments";
  private renameFolderUrl: string = BASE_URL + "api/attachment/renameFolder";
  private getUserPermissionsByRoleUrl: string =
    BASE_URL + "api/user/getUserPermissionsByRole/attachment";
  private createUserPermissionRoleUrl: string =
    BASE_URL + "api/user/createUserPermissionTabs";
  private createUserPermissionRoleWithChildrenUrl: string =
    BASE_URL + "api/user/createUserPermissionRoleWithChildren";
  private getDocumentPermissionsUrl: string =
    BASE_URL + "api/attachment/getDocumentPermissions";
  private deleteUserPermissionRoleWithChildrenUrl: string =
    BASE_URL + "api/user/deleteUserPermissionRoleWithChildren";
  private deleteUserPermissionRoleWithChildrenForAllRolesUrl: string =
    BASE_URL + "api/user/deleteUserPermissionRoleWithChildrenForAllRoles";
  private createUserPermissionRoleWithChildrenForArrayUrl: string =
    BASE_URL + "api/user/createUserPermissionRoleWithChildrenForArray";
  private unlinkDocumentUrl: string =
    BASE_URL + "api/attachment/unlinkDocument";
  private changeFolderNameAndDescriptionUrl: string =
    BASE_URL + "api/attachment/changeFolderNameAndDescription";
  private checkIfUserCanEditFolderUrl: string = 
    BASE_URL + 'api/attachment/checkIfUserCanEditFolder';

  private headers: HttpHeaders;
  public isDeleted = new Subject<boolean>();

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded",
      "X-Requested-With": "XMLHttpRequest",
    });
  }

  getChildrenDirectories(Project_id, Parent) {
    return this.http.get(
      `${this.getChildrenDirectoriesUrl}/${Project_id}/${Parent}`,
      { headers: this.headers }
    );
  }

  getUserPermissionsByRole() {
    return this.http.get(`${this.getUserPermissionsByRoleUrl}`, {
      headers: this.headers,
    });
  }

  getParentDirectories(Project_id) {
    return this.http.get(`${this.getParentDirectoriesUrl}/${Project_id}`, {
      headers: this.headers,
    });
  }

  createDirectory(data) {
    return this.http.post(this.createDirectoryUrl, data, {
      headers: this.headers,
    });
  }

  getChildrenDirectoriesBelongsToParentID(ParentID) {
    return this.http.get(
      `${this.getChildrenDirectoriesBelongsToParentIDUrl}/${ParentID}`,
      { headers: this.headers }
    );
  }

  getAttachments(directory_id, project_id, attachmentCategory, params?) {
    if (params) {
      return this.http.get(
        `${this.getAttachmentsUrl}/${directory_id}/${project_id}/${attachmentCategory}?search=${params}`
      );
    }
    return this.http.get(
      `${this.getAttachmentsUrl}/${directory_id}/${project_id}/${attachmentCategory}`
    );
  }

  getAttachmentsClient(directory_id, client_id) {
    return this.http.get(
      `${this.getAttachmentClientsUrl}/${directory_id}/${client_id}`,
      { headers: this.headers }
    );
  }

  getAttachmentsByAtaId(project_id, ata_id) {
    return this.http.get(
      `${this.getAttachmentsByAtaIdUrl}/${project_id}/${ata_id}`,
      { headers: this.headers }
    );
  }

  getAttachment(directory_id, project_id, params?) {
    return this.http.get(
      `${this.getAttachmentUrl}/${directory_id}/${project_id}`,
      { headers: this.headers }
    );
  }

  getAttachmentClient(directory_id, client_id) {
    return this.http.get(
      `${this.getAttachmentClientUrl}/${directory_id}/${client_id}`,
      { headers: this.headers }
    );
  }

  getChildrenAttachments(directory_id, project_id) {
    return this.http.get(
      `${this.getChildrenAttachmentsUrl}/${directory_id}/${project_id}`,
      { headers: this.headers }
    );
  }

  getDocumentPermissions(documentId) {
    return this.http.get(`${this.getDocumentPermissionsUrl}/${documentId}`, {
      headers: this.headers,
    });
  }

  deleteAttachment(attachment_id): Promise<any> {
    return this.http
      .get(`${this.deleteAttachmentUrl}/${attachment_id}`, {
        headers: this.headers,
      })
      .toPromise2();
  }
  
  checkIfUserCanEditFolder(projectId, folderId): Promise<any> {
    return this.http
      .get(`${this.checkIfUserCanEditFolderUrl}/${projectId}/${folderId}`, {
        headers: this.headers,
      })
      .toPromise2();
  }

  addNewFolder(data): Promise<any> {
    return this.http
      .post(this.addNewFolderUrl, data, {
        headers: this.headers,
      })
      .toPromise2();
  }

  addNewFile(data): Promise<any> {
    return this.http
      .post(this.addNewFileUrl, data, {
        headers: this.headers,
        reportProgress: true,
        observe: "events",
      })
      .toPromise2();
  }

  addNewFiles(data) {
    return this.http.post(this.addNewFilesUrl, data, {
      headers: this.headers,
      reportProgress: true,
      observe: "events",
    });
  }


  addNewFilesForEducation(data) {
    return this.http.post(this.addNewFilesForEducationUrl, data, {
      headers: this.headers,
      reportProgress: true,
      observe: "events",
    });
  }

  addNewFilesClient(data) {
    return this.http.post(this.addNewFilesClientUrl, data, {
      headers: this.headers,
      reportProgress: true,
      observe: "events",
    });
  }

  addNewFileClient(data): Promise<any> {
    return this.http
      .post(this.addNewFileClientUrl, data, {
        headers: this.headers,
      })
      .toPromise2();
  }

  createUserPermissionRole(data) {
    return this.http.post(this.createUserPermissionRoleUrl, data, {
      headers: this.headers,
    });
  }

  changeLockAttachment(id, lock) {
    return this.http.post(
      `${this.changeLockAttachmentUrl}/${id}`,
      { lock },
      { headers: this.headers }
    );
  }

  downloadFolder(id, projectId, folderName?): Promise<any> {
    return this.http
      .get(`${this.downloadFolderUrl}/${id}/${projectId}`, {
        headers: new HttpHeaders({ "Content-Type": "application/json" }),
        responseType: "blob" as "blob", // Specify the response type as 'blob'
      })
      .toPromise()
      .then((response) => {
        // Create a blob object from the response
        // const blob = new Blob([response], { type: 'application/zip' });
        // Use the file-saver library to save the blob as a file
        saveAs(response, folderName || "folder.zip");
      });
  }

  public unlinkDocument(folderName) {
    const headers = new HttpHeaders();
    headers.append("X-Requested-With", "XMLHttpRequest");
    headers.append("Content-Type", "application/x-www-form-urlencoded");
    console.log("**************enter************");
    let data = {
      folder_name: folderName,
    };

    return this.http
      .post(this.unlinkDocumentUrl, data, { headers: headers })
      .toPromise2()
      .then((response) => response)
      .catch((err) => {
        return { status: false };
      });
  }

  updateComment(id, comment) {
    return this.http.post(
      `${this.updateCommentUrl}/${id}`,
      { comment },
      { headers: this.headers }
    );
  }

  removeSelectedDocuments(data) {
    return this.http.post(this.removeSelectedDocumentsUrl, data, {
      headers: this.headers,
    });
  }

  renameFolder(data) {
    return this.http.post(this.renameFolderUrl, data, {
      headers: this.headers,
    });
  }

  createUserPermissionRoleWithChildren(data) {
    return this.http.post(this.createUserPermissionRoleWithChildrenUrl, data, {
      headers: this.headers,
    });
  }

  deleteUserPermissionRoleWithChildren(folderId, userRoleId) {
    return this.http.delete(
      `${this.deleteUserPermissionRoleWithChildrenUrl}/${folderId}/${userRoleId}`,
      { headers: this.headers }
    );
  }

  deleteUserPermissionRoleWithChildrenForAllRoles(folderId) {
    return this.http.delete(
      `${this.deleteUserPermissionRoleWithChildrenForAllRolesUrl}/${folderId}`,
      { headers: this.headers }
    );
  }

  createUserPermissionRoleWithChildrenForArray(data) {
    return this.http.post(
      `${this.createUserPermissionRoleWithChildrenForArrayUrl}`,
      data,
      { headers: this.headers }
    );
  }

  changeFolderNameAndDescription(id, data) {
    return this.http.post(
      `${this.changeFolderNameAndDescriptionUrl}/${id}`,
      data,
      {
        headers: this.headers,
      }
    );
  }
}
