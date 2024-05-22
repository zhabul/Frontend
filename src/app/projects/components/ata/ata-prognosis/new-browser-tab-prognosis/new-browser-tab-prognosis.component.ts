import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { AtaService } from 'src/app/core/services/ata.service';

@Component({
  selector: 'app-new-browser-tab-prognosis',
  templateUrl: './new-browser-tab-prognosis.component.html',
  styleUrls: ['./new-browser-tab-prognosis.component.css']
})
export class NewBrowserTabPrognosisComponent implements OnInit, OnDestroy {
  client_workers: any = [];
  projectId;
  prognosis;
  leftTab: string[] = [`<span>PROGNOS</span>`];

  getPrognosisSub: Subscription | undefined;

  constructor(
    private activatedRoute: ActivatedRoute,
    private ataService: AtaService,
    ) {}

  ngOnInit(): void {
    this.getPrognosis();
    this.getClientWorkers();
  }

  getPrognosis() {
    this.projectId = this.activatedRoute.snapshot.params["id"];
    if (!this.projectId) return;
    this.getPrognosisSub = this.ataService
      .getPrognosis(this.projectId)
      .subscribe({
        next: (result: { status: boolean; data: any }) => {
          if (!result || result.status === false) return;
          this.prognosis = result.data;
          console.log(this.prognosis)
        },
      });
  }

  getClientWorkers() {
    this.client_workers = this.activatedRoute.snapshot.data["client_workers"]
  }

  ngOnDestroy(): void {
      this.getPrognosisSub?.unsubscribe();
  }

}
