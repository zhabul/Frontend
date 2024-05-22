import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AtaInfoService } from './ata-info.service';

@Component({
  selector: 'app-ata-info',
  templateUrl: './ata-info.component.html',
  styleUrls: ['./ata-info.component.css']
})
export class AtaInfoComponent implements OnInit {
  public selectedAta:any = 1;
  public atas: any = [];
  public reportsData:any = [];
  public weeklyReports = [];
  public showParentKS:any= [];
  public showChildKS:any = [];
  public showKSFromParent: any = [];
  public showKS:any;
  public atasSub;
  public type:any;
  public ataKsSub;
  public ksChild = {
    isMin: true,
    isMax: true,
    children: [],
    activeChildIndex: -1
  };
  public ksChildren = [];
  public activeKsChild = -1;
  public ksActive = false;
  public ataActive = true;
  public selectedAtaSub;
  public activeComponent:any = 'ata';
  public permissionSub;
  public ActiveComponentSub;
  public project_id;

  constructor(
    private route: ActivatedRoute,
    private ataInfoService: AtaInfoService
  ) { }

    ngOnInit(): void {
        this.route.queryParamMap.subscribe((params) => {
            this.type = params.get("type") || null;
            this.project_id = params.get("projectId") || 0;
        });      
        this.subToAtaSubject();
        if(this.type == 'internal') {
            this.ataInfoService.setAtas(this.route.snapshot.data.internalAtas.data);
        }else {
            this.ataInfoService.setAtas(this.route.snapshot.data.atas.data);
        }
        
        this.ataInfoService.setSelectedAta(this.getLastAtaIndex());
        this.reportsData = this.route.snapshot.data["weekly_reports"];
        
        this.getActiveComponents();
       // this.subToAtaKs();
    }

    getLastAtaIndex() {
        if(this.type == 'external') {
            return this.route.snapshot.data.atas.data.length - 1;
        }else {
            return this.route.snapshot.data.internalAtas.data.length - 1;
        }
    }

 
    ngOnDestroy() {
        this.unsubFromAtaSubject();
        this.unsubFromAtaKs();
        this.unSubActiveComponent();
        this.unSubPermission();
    }

    unSubPermission() {
        if (this.permissionSub) {
          this.permissionSub.unsubscribe();
        }
    }

  unSubActiveComponent() {
    if (this.ActiveComponentSub) {
      this.ActiveComponentSub.unsubscribe();
    }
  }

  unsubFromAtaKs() {
    if (this.ataKsSub) {
      this.ataKsSub.unsubscribe();
    }
  }

  subToAtaSubject() {
    this.atasSub = this.ataInfoService.getAtas().subscribe((atas)=>{
      this.atas = atas;
    });
  }

  unsubFromAtaSubject() {
    if (this.atasSub) {
      this.atasSub.unsubscribe();
    }
  } 
/*
  subToAtaKs() {
    this.ataKsSub = this.ataInfoService.getWeeklyReports().subscribe((reportsData)=>{
      this.setAtaChildren(reportsData);
    })
  }

  setAtaChildren(reportsData) {
    if (reportsData && reportsData.data[reportsData.activeReport]) {
      this.ksActive = true;
      this.ataActive = false;
      return;
    } 
    this.ksActive = false;
    this.ataActive = true;
  }

    getPermisssions() {
        this.permissionSub = this.ataInfoService.getAtas().subscribe((atas)=>{
            this.atas = atas;
        });
    }
*/
  getActiveComponents() {
    this.activeComponent = 'ata';
    this.ActiveComponentSub = this.ataInfoService.getActiveComponents().subscribe((component)=>{
        this.activeComponent = component;
    });
  }
}