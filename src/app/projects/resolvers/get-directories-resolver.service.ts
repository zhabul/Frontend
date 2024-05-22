import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { AttachmentService } from "src/app/core/services/attachment.service";

@Injectable()
export class GetAttachmentsResolverService implements Resolve<any> {
  constructor(private attachmentService: AttachmentService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    let directory_id = route.params.directory_id;
    if (!route.params.directory_id) {
      directory_id = "0";
    }

    let attachmentCategory = "default";

    if (route.data.attachmentCategory) {
      attachmentCategory = route.data.attachmentCategory;
    }
    return this.attachmentService.getAttachments(
      directory_id,
      route.params.id || route.parent.params.id,
      attachmentCategory
    );
  }
}
