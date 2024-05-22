import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot,
  UrlTree,
  Router
} from "@angular/router";

import { Observable } from "rxjs";
import { CanDeactivateComp } from "./can-deactivate";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { ConfirmModalComponent } from "src/app/shared/modals/confirm-modal/confirm-modal.component";

@Injectable({
  providedIn: "root",
})
export class DirtyCheckGuard implements CanDeactivate<CanDeactivateComp> {
  constructor(
    private translate: TranslateService,
    private dialog: MatDialog,
    private router: Router
  ) {}
  canDeactivate(
    component: CanDeactivateComp,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {

    if ((component && component.canDeactivate()) || nextState.url.includes('skip')) {
      return true;
    } else {
      const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.width = "185px";
        dialogConfig.data = {
          questionText: this.translate.instant("If you leave before saving, your changes will be lost") + "?",
        };
        dialogConfig.panelClass = "confirm-modal";
        this.dialog
          .open(ConfirmModalComponent, dialogConfig)
          .afterClosed()
          .subscribe((response) => {
            if (response.result) {
              this.router.navigate([nextState.url], {
                queryParams: {
                  skip: 1
                }
              });
            }
          });
    }
  }
}
