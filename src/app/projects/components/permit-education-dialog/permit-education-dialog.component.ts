import { Component, OnInit,ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Subject } from 'rxjs';
import { UsersService } from "src/app/core/services/users.service";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { SendDropdownComponent } from 'src/app/users/components/edit-user/user-education/send-dropdown/send-dropdown.component';
import { ConfirmationModalComponent } from 'src/app/shared/modals/confirmation-modal/confirmation-modal.component';
import {MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ProjectsService } from "src/app/core/services/projects.service";

@Component({
  selector: 'app-permit-education-dialog',
  templateUrl: './permit-education-dialog.component.html',
  styleUrls: ['./permit-education-dialog.component.css']
})
export class PermitEducationDialogComponent implements OnInit {

    @ViewChild(SendDropdownComponent) dropdownComponent : SendDropdownComponent;
    public formCreate: FormGroup;
    public _filterText:any;
    public inputEmail:any;
    public username;
    public CurrentDate;
    public selectedEmail:any[] = [];
    public selectedDocument;
    public client_workers;
    public subject: Subject<boolean>;
    public today;
    public education;
    public emailValidator:any = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    public sending = false;
    public educations;
    public userId;
    public fetchError = false;
    public swiper = {
        images: [],
        active: -1,
        album: -2,
        index: -1,
        parent: null,
    };
    public spinner:boolean = true;
    public whichNumber: number[] = [];
    public selectedDocuments: {
        index: number;
        name: string;
        images:any[];
        pdfs:any[];
    }[] = [];
    public dropdownIsOpen:boolean = false;
    public backspace = 0;

    constructor(
        private fb: FormBuilder,
        public dialogRef: MatDialogRef<PermitEducationDialogComponent>,
        private userService: UsersService,
        @Inject(MAT_DIALOG_DATA) public modal_data: any,
        private toastr: ToastrService,
        private translate: TranslateService,
        private dialog: MatDialog,
        private projectsService: ProjectsService,
    ){}

    ngOnInit(): void {

        this.userId = this.modal_data.user.type == 'user' ? this.modal_data.user.UserID : this.modal_data.user.Id;
        this.username = this.modal_data.user.finalName;
        this.today = new Date();
        this.CurrentDate =
            this.today.getFullYear() +
            "-" +
            (this.today.getMonth() + 1) +
            "-" +
            this.today.getDate();

        this.formCreate = this.fb.group({
            to: new FormControl(),
            subject: [`${this.username} ${this.CurrentDate}`, new FormControl()],
            message: new FormControl(),
        });
        this.getEducations();
        this.getAllClientsWhereWorkingThisUser();
    }

    getAllClientsWhereWorkingThisUser() {

        this.projectsService.getAttestClientWorkers(this.modal_data.project_id).then((res) => {
            let data = [];
            res.forEach((item,index)=>{
                let object = {
                    'contact': item.email,
                    'email': item.email,
                    'id': item.Id,
                    'name': item.Name,
                }

                data.push(object);
            });
            this.client_workers = data;
        });
    }

    getEducations() {
        if (this.sending) {
            return false;
        }
        this.sending = true;

        this.userService
            .getEducationsForEditUser(this.userId)
            .subscribe({
            next: (res: any) => {
                this.sending = false;
                if (res.status) {
                    this.spinner = false;
                    this.educations = res.data;
                } else {
                    this.fetchError = true;
                }
            },
            error: () => {
                this.fetchError = true;
            }
        });
    }

    get inputText() {
       return this._filterText;
     }

    set inputText(value: string){
        this.inputEmail = value;
        let lastCaracter:any

        if(value != undefined){
            lastCaracter = this.inputEmail.charAt(this.inputEmail.length-1);
        }
        if(lastCaracter == ',' || lastCaracter == ';'){
            if(this.emailValidator.test(this.inputEmail.slice(0,-1))){
                let index = this.selectedEmail.findIndex((arg) => {
                    return arg.contact = this.inputEmail.slice(0,-1) && arg.email == this.inputEmail.slice(0,-1)
                });
                if(index > -1) {
                    this.selectedEmail.splice(index, 1);
                }
                this.selectedEmail.push({contact:this.inputEmail.slice(0,-1), email:this.inputEmail.slice(0,-1)});
                this._filterText = '';
                this.formCreate.get('to').reset();
                this.refreshSelectedEmail();
            }
        }
    }

    addEmailByEnter(){
        if(this.emailValidator.test(this.inputEmail)){
            let index = this.selectedEmail.findIndex((arg) => {
                return arg.contact = this.inputEmail && arg.email == this.inputEmail
            });
            if(index > -1) {
                this.selectedEmail.splice(index, 1);
            }
            this.selectedEmail.push({contact:this.inputEmail, email:this.inputEmail});
            this._filterText = '';
            this.formCreate.get('to').reset();
            this.refreshSelectedEmail();
        }
    }

    refreshSelectedEmail() {
        this.selectedEmail.forEach(function(data, index){
            data.contact = data.email;
        });
    }

  removeEmailByBackSpace(){
   if(this.inputEmail == undefined){
    this.removeEmail(this.selectedEmail.length-1);
    this.dropdownComponent.updateCheckedEmails();
   }

    if(this.inputEmail == ''){
    if(this.backspace>0){
        this.removeEmail(this.selectedEmail.length-1);
        this.dropdownComponent.updateCheckedEmails();
        this.formCreate.get('to').reset();
        this.backspace = 0;
    } else {
      this.backspace++;
    }
   }
  }

    checkedEmail(event){

        let alreadyExist=false;
        this.selectedEmail.forEach((item,index)=>{
            if(item.id == event.id) {
                this.selectedEmail.splice(index,1);
                alreadyExist = true;
            }
        })
        if(!alreadyExist){
            this.selectedEmail.push(event);
        }
    }

    sendEducation(){
        let data = {
            'selected_documents': this.selectedDocuments,
            'to': this.selectedEmail,
            'message': this.formCreate.get('message').value,
            'subject': this.formCreate.get('subject').value
        }

        if(this.selectedEmail.length == 0){
           this.toastr.info(this.translate.instant('Please select or write email'));
        }else{

            let emails = '';
            this.selectedEmail.forEach(email =>{
              emails += email.contact + ' ';
            })
            const diaolgConfig = new MatDialogConfig();
            diaolgConfig.position = {left:'400px', top:'200px'};
            diaolgConfig.disableClose = true;
            diaolgConfig.panelClass = "mat-dialog-confirmation";
            diaolgConfig.data = { questionText: this.translate.instant('Are you sure you want to send email to: ') + emails + '?' };
            this.dialog.open(ConfirmationModalComponent, diaolgConfig).afterClosed().subscribe(response =>{
              if(response.result){
                    this.spinner = true;
                    this.userService.sendDataToClients(data).subscribe((result:any) => {
                        if(result.status) {
                          this.toastr.info(
                            this.translate.instant("You have successfully sent documents"),
                            this.translate.instant("Info")
                          );
                          this.close();
                        }
                    })
              }
            });
        }
    }

    removeEmail(index){
      this.selectedEmail.forEach((item,i)=>{
        if(i==index) {
          this.selectedEmail.splice(i,1);
        }
      })
    }

    close(): void {
        this.dialogRef.close();
    }

    isPDFViewer: boolean = false;
    openSwiper(index, images, album) {

        if (images[index].document_type === "Image") {
           this.isPDFViewer = false;
            this.swiper = {
                active: index,
                images: images,
                album: album,
                index: -1,
                parent: null,
            };
        } else {
            const imageArray = this.createImageArray(images[index]);
            this.isPDFViewer = true;
            this.swiper = {
                active: 0,
                images: imageArray,
                album: album,
                index: index,
                parent: images[index],
            };
        }
    }

    closeSwiper() {
        this.swiper = {
            active: -1,
            images: [],
            album: -2,
            index: -1,
            parent: null,
        };
    }

    createImageArray(image) {

        const id = image.id;
        const comment = image.Description;
        const name = image.Name ? image.Name : image.name;
        // const image_path = image.image_path;
        const file_path = image.file_path;
        const imageArray = file_path.split(",").map((imageString) => {
            return {
                image_path: imageString,
                id: id,
                Description: comment,
                name: name,
                file_path: file_path,
            };
        });
        return imageArray;
    }

    toggleRow(event, name: string, index: number): void {
        this.educations[index] = {...this.educations[index], isChecked: event.target.checked};
        const isChecked = event.target.checked;


        if(isChecked) {
            this.whichNumber.push(index);
            const selectedDocument = {
                index: index,
                name: name,
                images: this.educations[index].images,
                pdfs: this.educations[index].pdfs,
            };
            this.selectedDocuments.push(selectedDocument);
        }
        else {
            this.whichNumber = this.whichNumber.filter(x => x != index);
            this.selectedDocuments = this.selectedDocuments.filter(x => x.index != index);
        }

        if(this.selectedDocuments.length == 0){
            this.dropdownIsOpen = false;
        }else {
            this.dropdownIsOpen = true;
        }
    }
}
