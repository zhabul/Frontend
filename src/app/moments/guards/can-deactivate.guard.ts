import {Injectable } from '@angular/core';
import {CanDeactivate} from '@angular/router';
import { Observable } from 'rxjs';
import { MatDialog,MatDialogConfig } from '@angular/material/dialog';
import { Observer } from 'rxjs';
import { ConfirmModalComponent } from 'src/app/shared/modals/confirm-modal/confirm-modal.component';
import { TranslateService } from '@ngx-translate/core';


export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}


@Injectable({
  providedIn: 'root'
})
export class UnsavedChangesGuard implements CanDeactivate<CanComponentDeactivate> {



  constructor(private dialog: MatDialog, private translate:TranslateService) {

  }

  canDeactivate(component: CanComponentDeactivate) {
      // Allow navigation if the component says that it is OK or it doesn't have a canDeactivate function
      if (!component.canDeactivate || component.canDeactivate()) {
          return true;
      }
      return new Observable((observer: Observer<boolean>) => {
          // UnsavedChangesDialog defined somewhere else and imported above
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.disableClose = true;
        dialogConfig.width = "185px";
        dialogConfig.data = {
          questionText:this.translate.instant("If you leave before saving, your changes will be lost") + "?",
        };
        dialogConfig.panelClass = "confirm-modal";

        let dialogRef = this.dialog.open(ConfirmModalComponent,dialogConfig);
        dialogRef.afterClosed().subscribe({next:(result) => {
          observer.next(result.result);
          observer.complete();
          }, error:(error) => {
          observer.next(false);
          observer.complete();
          }})
          dialogRef.afterOpened().subscribe(()=>{
          let bouncingSpinner=document.querySelectorAll(".spinner-container")as unknown as HTMLElement[]
          bouncingSpinner.forEach((spinner)=>spinner.style.display="none")
          })
          })
      }
  }
