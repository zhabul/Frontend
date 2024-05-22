import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { TimeRegistrationService } from "src/app/core/services/time-registration.service";

@Component({
  selector: 'app-user-select',
  templateUrl: './user-select.component.html',
  styleUrls: ['./user-select.component.css']
})
export class UserSelectComponent implements OnInit {

  @Input('userId') userId;
  @Output('emitSelectedUser') emitSelectedUser:EventEmitter<number> = new EventEmitter();

  public selectForm = this.fb.group({
    type: ['', []],
    type_name: ['', []],
    user: ['', []],
    user_name: ['', []]
  });
  public users = [];
  public allUsers = [];
  public selectedTypes: any[] = [];

  constructor(private fb: FormBuilder,
              private translate: TranslateService,
              private timeRegistrationService: TimeRegistrationService) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    this.timeRegistrationService.getUsersIds(this.userId).subscribe((response) => {
      this.allUsers = response["users"];
      this.users = this.allUsers;
      this.selectDefaultUser();
      this.changeSelectedUser({ 
        ataType: null,
        impName: null,
        index: "-1",
        name: this.selectForm.get('user_name').value,
        value: this.selectForm.get('user').value
      });
    });
  }

  selectDefaultUser() {
    const filterUsersById = user => this.userId == user.id;
    const defaultUser = this.users.filter(filterUsersById);
    if (!defaultUser[0]) return;
    this.selectForm.get('user').patchValue(defaultUser[0].id);
    this.selectForm.get('user_name').patchValue(defaultUser[0].finalName);
  }

  onItemSelect($event) {
    this.selectedTypes = $event;
    this.filterUsersByType();
  }

  filterUsersByType() {
    if (this.selectedTypes.length === 0) {
      this.users = this.allUsers;
    } else {
      const filterUsersByType = user => this.selectedTypes.some(type => this.translate.instant(type.Name) === this.translate.instant(user.type));
      this.users = this.allUsers.filter(filterUsersByType);
    }
  }

  changeSelectedUser($event) {
    const userId = Number($event.value);
    if (userId < 1) return;
    this.emitSelectedUser.emit($event);
  }
};