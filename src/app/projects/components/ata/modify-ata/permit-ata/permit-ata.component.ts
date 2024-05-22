import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AtaService } from 'src/app/core/services/ata.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-permit-ata',
  templateUrl: './permit-ata.component.html',
  styleUrls: ['./permit-ata.component.css'],
  providers: [DatePipe]
})
export class PermitAtaComponent implements OnInit {
    public project;
    public spinner = false;
    public Check: boolean;
    public ata_workers = [];
    currentDate :any = new Date();
    @Input() atas;
    @Input() ata_permission;


    constructor(  
        private route: ActivatedRoute,
        private ataService: AtaService,
        private datePipe: DatePipe
        ) {
            this.currentDate = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd');
         }

    ngOnInit(): void {
        this.project = this.route.snapshot.data["project"]["data"];
        this.changeSelectedTab();
    }

    changeSelectedTab() {
        this.spinner = true;
        this.ataService
            .getAtaWorkersAndResponsiblePersons(this.project.id, this.atas[0].ATAID)
            .subscribe((res) => {     
            this.ata_workers = res["data"];
            this.sortUsersByActiv();
            this.spinner = false;
            });
        
    }

    updateAtaWorkers(index, isChecked) {
        this.spinner = true;
        this.ataService.updateAtaWorkers(this.ata_workers[index].UserID,this.atas[0].ATAID, isChecked ? 1 : 0, this.project.id)
        .subscribe((res) => {
            if (res["status"]) {
                this.ata_workers.forEach((user) =>{
                    if(user.UserID == this.ata_workers[index].UserID){
                        this.ata_workers[index].isAssigned = isChecked
                    }
                  })
                this.spinner = false;
            }
        });
    }

    sortUsersByActiv(){
        this.ata_workers.forEach(user => {
            if(user.EndDate >= this.currentDate){
                user.isActive = 1;
                user.background = '#CAE5AF'
            }else{
                user.isActive = 0;
                user.background = '#FFFFFF'
            } 
        })

        this.ata_workers.sort((a, b) => { 
            if(a.isActive == 1) return -1;
            else return 1;
        })

        this.sortUserByType();
    }

    sortUserByType(){
        this.ata_workers.sort((a, b) => { 
            if(a.Type == 'Main person') return -1;
            else if(a.Type == 'Responsible person') return -1;
            else return 1;  
        })
    }
}
