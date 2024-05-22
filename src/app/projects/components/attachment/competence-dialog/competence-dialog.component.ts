import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { map, take } from "rxjs";
import { AttachmentService } from "src/app/core/services/attachment.service";
import { LoadingSpinnerService } from "src/app/core/services/loading-spinner.service";
import { SuppliersService } from "src/app/core/services/suppliers.service";
import { UsersService } from "src/app/core/services/users.service";
import { PEN_SVG } from "./svgs/competence-svgs";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-competence-dialog",
  templateUrl: "./competence-dialog.component.html",
  styleUrls: ["./competence-dialog.component.css"],
})
export class CompetenceDialogComponent implements OnInit {
  data;
  item;
  roles: any[] = [];
  suppliers = [];
  suppliersWorkers = [];
  selectedRoles = [];
  isLoading: boolean = false;

  rolesWithPermissions = [];
  isRolesChanged: boolean = false;
  penSvg: string = PEN_SVG;
  isNameInputFocus: boolean = false;
  isDescriptionInputFocus: boolean = false;

  nameDescriptionForm: FormGroup | undefined;

  constructor(
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private suppliersService: SuppliersService,
    private attachmentService: AttachmentService,
    private userService: UsersService,
    private dialogRef: MatDialogRef<CompetenceDialogComponent>,
    public loadingSpinnerService: LoadingSpinnerService,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    this.data = data;
    iconRegistry.addSvgIconLiteral('pen', sanitizer.bypassSecurityTrustHtml(this.penSvg));
  }

  ngOnInit(): void {
    this.loadData();
    this.initNameDescriptionForm();
  }

  loadData() {
    this.item = this.data.item;
    this.suppliers = this.data.suppliers;
    this.loadRoles();
  }

  initNameDescriptionForm() {
    this.nameDescriptionForm = this.fb.group({
      name: [this.data.item.name, Validators.required],
      description: [this.data.item.comment, Validators.required]
    });
  }

  loadRoles() {
    this.userService
      .getRoles()
      .subscribe({
        next: (roles) => {
          this.filterRoles(roles);
          this.checkedSelectedRolesWithPermissions(this.roles);
        },
      });
  }

  selectedSuppliers(e) {
    this.suppliersWorkers = [];
    for (let item of e) {
      this.suppliersService
        .getSupplierWorkers(item.supplierId)
        .pipe(
          map((workers) => {
            for (let item of workers) {
              if (item.Id) item.id = item.Id;
            }
            return workers;
          })
        )
        .subscribe({
          next: (workers) => {
            this.suppliersWorkers = [
              ...this.suppliersWorkers.slice(),
              ...workers,
            ];
          },
        });
    }
  }

  selectedRole(e) {
    this.selectedRoles = e;
  }

  onSave() {
    if (!this.isRolesChanged && !this.nameDescriptionForm?.dirty) return;
    if (this.isRolesChanged) {
      this.savePermissions();
      this.dialogRef.close({nameDescription: this.nameDescriptionForm?.value, howManyChecked: this.howManyChecked});
    }else {
      this.dialogRef.close({nameDescription: this.nameDescriptionForm?.value, howManyChecked: null});
    }
  }

  checkedSelectedRolesWithPermissions(gettingRoles) {
    this.isLoading = true;
    this.attachmentService
      .getDocumentPermissions(this.item.Id)
      .pipe(
        map((result: { status: boolean; data: any[] }) => {
          if (!result.status) return [];
          return result.data;
        })
      )
      .subscribe({
        next: (response) => {
          this.isLoading = true;
          for (let role of gettingRoles) {
            for (let selectedRole of response) {
              if (role.id === selectedRole.userRoleId) {
                role.checked = true;
                /*if (selectedRole.optionIds.includes(selectedRole.create))
                  role.canEdit = true;
                if (selectedRole.optionIds.includes(selectedRole.show))
                  role.canView = true;*/
                if(selectedRole.create == 1) {
                  role.canEdit = true;
                }
                if(selectedRole.show == 1) {
                  role.canView = true;
                }
              }
            }
          }
          this.filterRoles(this.roles);
          this.roles = [...gettingRoles];
          this.isLoading = false;
        },
      });
  }

  uniqueElements = [];
  howManyChecked: number = 0;
  selectedPermissionForAll(allPerms) {
    this.howManyChecked = 0;
    this.isRolesChanged = true;
    this.rolesWithPermissions = allPerms;
    for (let role of allPerms) {
      if (role.canEdit || role.canView) this.howManyChecked++;
    }
    this.uniqueElements = this.rolesWithPermissions.filter(obj1 => {
      const matchingElement = this.roles.find(obj2 => obj1.id === obj2.id);
      if (!matchingElement) return true;
      
      // Check for different properties
      for (let prop in obj1) {
        if (obj1[prop] !== matchingElement[prop]) return true;
      }
      
      return false;
    });
  }

  savePermissions() {
    this.loadingSpinnerService.setLoading(true);
    if (this.uniqueElements.length <= 0) {
      this.attachmentService
      .deleteUserPermissionRoleWithChildrenForAllRoles(this.item.Id)
      .subscribe({
        next: (_) => {
          let dataToSaveObject = {
            dataToSave: [],
          };
          for (let perm of this.rolesWithPermissions) {
            if (perm.checked) {
              if (perm.canEdit) {
                const data = {
                  roleId: parseInt(perm.id),
                  type: 'create',
                  contentType: "attachment",
                  contentId: parseInt(this.item.Id),
                };
                dataToSaveObject.dataToSave.push(data);
              }
              if (perm.canView) {
                const data = {
                  roleId: parseInt(perm.id),
                  type: 'show',
                  contentType: "attachment",
                  contentId: parseInt(this.item.Id),
                };
                dataToSaveObject.dataToSave.push(data);
              }
            }
          }
          this.attachmentService
            .createUserPermissionRoleWithChildrenForArray(dataToSaveObject)
            .pipe(take(1))
            .subscribe();
          
          this.loadingSpinnerService.setLoading(false);
        },
      });

    } else {
      for (let roleItem of this.uniqueElements) {
        this.attachmentService
          .deleteUserPermissionRoleWithChildren(this.item.Id, roleItem.id)
          .subscribe({
            next: (_) => {
              let dataToSaveObject = {
                dataToSave: [],
              };
              for (let perm of this.uniqueElements) {
                if (perm.checked) {
                  if (perm.canEdit) {
                    const data = {
                      roleId: parseInt(perm.id),
                      type: 'create',
                      contentType: "attachment",
                      contentId: parseInt(this.item.Id),
                    };
                    dataToSaveObject.dataToSave.push(data);
                  }
                  if (perm.canView) {
                    const data = {
                      roleId: parseInt(perm.id),
                      type: 'show',
                      contentType: "attachment",
                      contentId: parseInt(this.item.Id),
                    };
                    dataToSaveObject.dataToSave.push(data);
                  }
                }
              }
              this.attachmentService
                .createUserPermissionRoleWithChildrenForArray(dataToSaveObject)
                .pipe(take(1))
                .subscribe();
              
              this.loadingSpinnerService.setLoading(false);
            }
          });
      }
    }

    
  }

  filterRoles(roles) {
    this.roles = roles.filter(x => x.roles !== 'Administrator');

    if (this.item.belongs_to === '0') return;
    this.isLoading = true;
    this.attachmentService.getDocumentPermissions(this.item.belongs_to).subscribe({
      next: (response: {status: boolean, data: any[]}) => {
        if (response) {
          const userRoleIds = [];
          for (let item of response.data) userRoleIds.push(item.userRoleId);
          this.roles = this.roles.filter(
            x => userRoleIds.includes(x.id)
          );
          this.roles = [...this.roles];
          this.isLoading = false;
        }
      }
    });
  }

  onClose() {
    this.dialogRef.close();
  }

}
