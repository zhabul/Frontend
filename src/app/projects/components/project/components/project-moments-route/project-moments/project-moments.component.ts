/*import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { SetTimeComponent } from 'src/app/timesheets/components/set-time/set-time.component';

@Component({
  selector: 'app-project-moments',
  templateUrl: './project-moments.component.html',
  styleUrls: ['./project-moments.component.css']
})
export class ProjectMomentsComponent implements OnInit {
  
  public createForm: FormGroup;
  public modalHour: any;

  constructor(private fb: FormBuilder, private dialog: MatDialog) { }

  ngOnInit() {


    this.createForm = this.fb.group(
      {
        moments: ['', [Validators.required]],
        time: ['', [Validators.required]]
      }
    );
  }

  openModal() {
		const data = this.createForm.value;
		const diaolgConfig = new MatDialogConfig();
		diaolgConfig.autoFocus = true;
		diaolgConfig.disableClose =true;
		diaolgConfig.width = "50%";
		diaolgConfig.data = { data: data };
		this.dialog.open(SetTimeComponent, diaolgConfig).afterClosed().subscribe( (res) => {
		this.modalHour = diaolgConfig["data"]["Hours"];
		this.createForm.value["Hours"] = this.modalHour;
    });
  }

}*/
