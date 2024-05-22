import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FileStorageService } from 'src/app/core/services/file-storage.service';
import { OffersService } from 'src/app/core/services/offers.service';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ConfirmationModalComponent } from 'src/app/shared/modals/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-client-response-form',
  templateUrl: './client-response-form.component.html',
  styleUrls: ['./client-response-form.component.css']
})
export class ClientResponseFormComponent implements OnInit {

  @Input('item') item;
  @Input('pageTotal') pageTotal;
  public spinner = false;
  public buttons = [
    {
      name: 'Accepterar',
      msg: 'Jag accepterar offerten enligt redovisat.',
      color: '#4CB185',
      borderColor: '#4CB185',
      status: 2
    },
    {
      name: 'Fråga?',
      msg: 'Önskar komplettering enligt beskrivning.',
      color: '#F0E264',
      borderColor: '#FDC224',
      status: 6
    },
    {
      name: 'EJ Accepterat',
      msg: 'Accepterar inte offerten.',
      color: '#FF5454',
      borderColor: '#FF5454',
      status: 3
    },

  ];

  public message = '';
  public msgBorder = 'var(--border-color)';

  validateTextarea($event) {
    const value = $event.target.value;
    if (value === '') {
      this.msgBorder = 'red';
      return false;
    } else {
      this.msgBorder = 'var(--border-color)';
      return true;
    }
  }

  constructor(
    private offersService: OffersService,
    private router: Router,
    private route: ActivatedRoute,
    private fsService: FileStorageService,
    private dialog: MatDialog,
    ) { }

  ngOnInit(): void {
    this.getParams();
  }

  public params = {
    id: -1
  };
  private paramsSub;
  getParams() {
    this.paramsSub = this.route.params.subscribe((params)=>{
      this.params = {
        ...params,
        id: this.item.emailLogs[0].id
      };
    });
  }
  unsubFromParams() {
    if (this.paramsSub) {
      this.paramsSub.unsubscribe();
    }
  }

  public files = {
    pdfs: [],
    images: []
  };
  setFiles($event) {
    this.files = $event;
  }

  ngOnDestroy() {
    this.unsubFromParams();
  }

  onConfirmationModal(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = false;
      dialogConfig.disableClose = true;
      dialogConfig.width = "185px";
      dialogConfig.panelClass = "mat-dialog-confirmation";
      this.dialog.open(ConfirmationModalComponent, dialogConfig).afterClosed()
        .subscribe((response) => {
          if(response.result) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
    });
  }

  async sendOfferResponse(event) {
    event.preventDefault();
    const submitter = event.submitter;
    const status = submitter.dataset.status;
    if (!this.validateTextarea({ target: { value: this.message } })) return;

    const res = await this.onConfirmationModal();
    if (!res) return;

    const res2 = await this.fsService.mergeFilesAndAlbums(this.files);

    if(res2 != null) {
        this.files = {
          pdfs: res2.pdfs,
          images: res2.images
        };
    }

    const data = {
      status: status,
      id: this.item.id,
      params: this.params,
      message: this.message,
      files: this.files
    };
    this.spinner = true;
    try {
      if (status == 2) {
        await this.offersService.acceptOffer(data);
      } else if (status == 3) {
        await this.offersService.rejectOffer(data);
      } else if (status == 6) {
        await this.offersService.revisionOffer(data);
      }
      this.router.navigate(['/external/response/success']);
      this.spinner = false;
    } catch(e) {
      this.router.navigate(['/external/response/success']);
      this.spinner = false;
    }
  }
}
