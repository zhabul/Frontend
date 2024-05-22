import { Injectable } from "@angular/core";
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { AttachmentService } from "src/app/core/services/attachment.service";

@Injectable()
export class GetAttachmentResolverService implements Resolve<any> {
  constructor(private attachmentService: AttachmentService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.attachmentService.getAttachment(
      route.params.directory_id,
      route.params.id
    );
  }
}
