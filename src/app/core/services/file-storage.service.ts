import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, of } from "rxjs";
import { BASE_URL } from "../../config/index";

@Injectable({
  providedIn: "root",
})
export class FileStorageService {
  protected fileChunkSize: number = 5;

  constructor(private http: HttpClient) {}

  uploadFiles(files: File[]) {
    const formData = new FormData();
    files.forEach((file: File, index) => {
      formData.append(`file-${index}`, file, file.name);
    });
    
    return this.http.post(`${BASE_URL}file/store`, formData).pipe(
      catchError((e) => {
        return of({
          status: false,
          data: [],
        });
      })
    );
  }

  async mergeFilesAndAlbums(albumData: any) {
    if (albumData.pdfs == undefined && albumData.images == undefined) {
      return null;
    }

    const requests = [];
    const hasImages =
      albumData.images !== undefined && albumData.images.length > 0;
    const hasPdfs = albumData.pdfs !== undefined && albumData.pdfs.length > 0;

    let numOfRequestsImages = 0;
    let numOfRequestsPdfs = 0;

    if (hasImages) {
      const images = albumData.images.map((f) => f.file);
      for (let i = 0; i < images.length; i += this.fileChunkSize) {
        const chunk = images.slice(i, i + this.fileChunkSize);
        requests.push(this.uploadFiles(chunk).toPromise2());
        numOfRequestsImages++;
      }
    }

    if (hasPdfs) {
      const pdfs = albumData.pdfs.map((f) => f.file);
      for (let i = 0; i < pdfs.length; i += this.fileChunkSize) {
        const chunk = pdfs.slice(i, i + this.fileChunkSize);
        requests.push(this.uploadFiles(chunk).toPromise2());
        numOfRequestsPdfs++;
      }
    }

    const responses: any[] = await Promise.all(requests);

    if (responses.length == 0) {
      return null;
    }

    let responseIndex = 0;

    if (hasImages) {
      const files = [];
      while (responseIndex < numOfRequestsImages) {
        if (!responses[responseIndex].status) {
          files.push(...new Array(this.fileChunkSize).fill(false));
          responseIndex++;
          continue;
        }
        files.push(...responses[responseIndex].data);
        responseIndex++;
      }
      albumData.images = albumData.images.map((f: any, index) => {
        return { ...f, file: files[index], fileSize: f.file.size };
      });
    }

    if (hasPdfs) {
      const files = [];
      while (responseIndex < numOfRequestsPdfs + numOfRequestsImages) {
        if (!responses[responseIndex].status) {
          files.push(...new Array(this.fileChunkSize).fill(false));
          responseIndex++;
          continue;
        }

        files.push(...responses[responseIndex].data);
        responseIndex++;
      }

      albumData.pdfs = albumData.pdfs.map((f: any, index) => {
        return { ...f, file: files[index], fileSize: f.file.size };
      });
    }

    return albumData;
  }
}
