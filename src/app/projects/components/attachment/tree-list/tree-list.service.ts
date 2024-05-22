import { Injectable } from '@angular/core';
import { AttachmentService } from 'src/app/core/services/attachment.service';

@Injectable({
  providedIn: 'root'
})
export class TreeListService {

  private listOfFolders = [
    {
      AtaId: "0",
      ClientId: null,
      Id: "4116",
      belongs_to: "0",
      category: "default",
      checked: false,
      comment: "This is description for root path",
      file_path: "/file/0CCCAF48599B9644CC340266D25F20E3F0376ED8",
      hasItems: null,
      image_path: "/file/0CCCAF48599B9644CC340266D25F20E3F0376ED8",
      isDeleted: "0",
      lock: "0",
      name: "_camaro.jpg",
      project_id: "1709",
      type: "file",
      children: []
    },
    {
      AtaId: "0",
      ClientId: null,
      Id: "4117",
      belongs_to: "0",
      category: "default",
      checked: false,
      comment: "",
      file_path: null,
      hasItems: "4118",
      image_path: "",
      isDeleted: "0",
      lock: "0",
      name: "Folder-A",
      project_id: "1709",
      type: "folder",
      children: []
    },
    {
      AtaId: null,
      ClientId: null,
      Id: "4119",
      belongs_to: "4117",
      category: "default",
      checked: false,
      comment: "Description for image in Folder-A",
      file_path: "/file/DE9522D4AC4B191D25116BD8BFD56782290DBCD4",
      hasItems: null,
      image_path: "/file/DE9522D4AC4B191D25116BD8BFD56782290DBCD4",
      isDeleted: "0",
      lock: "0",
      name: "_camaro.jpg",
      project_id: "1709",
      type: "file",
      children: []
    },
    {
      AtaId: null,
      ClientId: null,
      Id: "4119",
      belongs_to: "4118",
      category: "default",
      checked: false,
      comment: "Description for image in Folder-A",
      file_path: "/file/DE9522D4AC4B191D25116BD8BFD56782290DBCD4",
      hasItems: null,
      image_path: "/file/DE9522D4AC4B191D25116BD8BFD56782290DBCD4",
      isDeleted: "0",
      lock: "0",
      name: "_camaro.jpg",
      project_id: "1709",
      type: "file",
      children: []
    },
    {
      AtaId: "0",
      ClientId: null,
      Id: "4118",
      belongs_to: "4117",
      category: "default",
      checked: false,
      comment: "",
      file_path: null,
      hasItems: null,
      image_path: "",
      isDeleted: "0",
      lock: "0",
      name: "Folder-A-1",
      project_id: "1709",
      type: "folder",
      children: []
    },
    {
      AtaId: "0",
      ClientId: null,
      Id: "4115",
      belongs_to: "0",
      category: "default",
      checked: false,
      comment: "",
      file_path: null,
      hasItems: null,
      image_path: "",
      isDeleted: "0",
      lock: "0",
      name: "Folder-B",
      project_id: "1709",
      type: "folder",
      children: []
    }
  ]

  /* private listOfFoldersV2 = [
    {
      AtaId: "0",
      ClientId: null,
      Id: "4116",
      belongs_to: "0",
      category: "default",
      checked: false,
      comment: "This is description for root path",
      file_path: "/file/0CCCAF48599B9644CC340266D25F20E3F0376ED8",
      hasItems: null,
      image_path: "/file/0CCCAF48599B9644CC340266D25F20E3F0376ED8",
      isDeleted: "0",
      lock: "0",
      name: "_camaro.jpg",
      project_id: "1670",
      type: "file",
      children: []
    },
    {
      AtaId: "0",
      ClientId: null,
      Id: "4117",
      belongs_to: "0",
      category: "default",
      checked: false,
      comment: "",
      file_path: null,
      hasItems: "4118",
      image_path: "",
      isDeleted: "0",
      lock: "0",
      name: "Folder-A",
      project_id: "1670",
      type: "folder",
      children: [
        {
          AtaId: null,
          ClientId: null,
          Id: "4119",
          belongs_to: "4117",
          category: "default",
          checked: false,
          comment: "Description for image in Folder-A",
          file_path: "/file/DE9522D4AC4B191D25116BD8BFD56782290DBCD4",
          hasItems: null,
          image_path: "/file/DE9522D4AC4B191D25116BD8BFD56782290DBCD4",
          isDeleted: "0",
          lock: "0",
          name: "_camaro.jpg",
          project_id: "1670",
          type: "file",
          children: []
        },
        {
          AtaId: "0",
          ClientId: null,
          Id: "4118",
          belongs_to: "4117",
          category: "default",
          checked: false,
          comment: "",
          file_path: null,
          hasItems: null,
          image_path: "",
          isDeleted: "0",
          lock: "0",
          name: "Folder-A-1",
          project_id: "1670",
          type: "folder",
          children: [
            {
              AtaId: null,
              ClientId: null,
              Id: "4119",
              belongs_to: "4117",
              category: "default",
              checked: false,
              comment: "Description for image in Folder-A",
              file_path: "/file/DE9522D4AC4B191D25116BD8BFD56782290DBCD4",
              hasItems: null,
              image_path: "/file/DE9522D4AC4B191D25116BD8BFD56782290DBCD4",
              isDeleted: "0",
              lock: "0",
              name: "_camaro.jpg",
              project_id: "1670",
              type: "file",
              children: []
            }
          ]
        }
      ]
    },
    {
      AtaId: "0",
      ClientId: null,
      Id: "4115",
      belongs_to: "0",
      category: "default",
      checked: false,
      comment: "",
      file_path: null,
      hasItems: null,
      image_path: "",
      isDeleted: "0",
      lock: "0",
      name: "Folder-B",
      project_id: "1670",
      type: "folder",
      children: []
    }
  ]; */

  constructor(
    private attachmentService: AttachmentService
  ) { }


  getListOfFolders() {
    return this.listOfFolders.filter(x => x.belongs_to == "0");
  }

  childrenFolders

  openFolder(folder) {
    // Get uraditi iz baze i ubaciti childove u otvoreni folder
    /* const selectedFolder = this.listOfFolders.find(x => x.Id == id);
    if (selectedFolder.children.length <= 0) {
      for (let item of this.listOfFolders) {
        if (item.belongs_to == selectedFolder.Id) selectedFolder.children.push(item);
      }
    } */

  
  }


  folder;
  getFolder(folderId, projectId) {
    this.attachmentService.getAttachment(folderId, projectId).subscribe({
      next: response => this.folder = response,
      error: error => console.log(error)
    });

  }
  
}
