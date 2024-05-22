import { Component, OnInit } from '@angular/core';
import { SuppliersService } from "src/app/core/services/suppliers.service";
import { ActivatedRoute } from "@angular/router";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ConfirmationModalComponent } from "src/app/shared/modals/confirmation-modal/confirmation-modal.component";
import { TranslateService } from "@ngx-translate/core";
//import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-selected-suppliers',
  templateUrl: './selected-suppliers.component.html',
  styleUrls: ['./selected-suppliers.component.css']
})
export class SelectedSuppliersComponent implements OnInit {

	project_id;
	suppliers;
	material_categories;
	public selectStylePosition = {
        'left': '-3px',
        'right': '-4px',
        'top': '31px',
        'bottom': '0px'
    };
	public spinner:boolean = false;
	public newAtaIcon = '#82a7e2';
	public dropdownSettings;
	public userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
	public selected_material_categories = 'Välj kategori';
	public selected_supplier_category = 'Välj Leverantör';
	public suppliers_category:any = [];
	public selectdSupplier;
	public newProjectSupplier = {
		'projectId': null,
		'cateogryId': null,
		'supplierId': null
	};

	constructor(
		private suppliersService: SuppliersService, 
		private route: ActivatedRoute,
		private dialog: MatDialog,
		private translate: TranslateService,
	//	private toastr: ToastrService,
	) { }

	ngOnInit(): void {

		this.project_id = this.route.params["value"]["id"];
		this.newProjectSupplier.projectId = this.project_id;
		this.getProjectMaterialSupplier();
		this.getSupplierCategories();
	}

	async getProjectMaterialSupplier() {
		this.suppliersService.getProjectMaterialSupplier(this.project_id).subscribe((res) => {
			this.suppliers = res;
		});
	}

	async getSupplierCategories() {
		this.suppliersService.getSupplierCategories().subscribe((res:any) => {
			this.material_categories = res['data'];
		});
	}

	onRemoveClick(id, i) {	

		const dialogConfig = new MatDialogConfig();
		dialogConfig.autoFocus = false;
		dialogConfig.disableClose = true;
		dialogConfig.width = "auto";
		dialogConfig.panelClass = "mat-dialog-confirmation";
		dialogConfig.data = {
		  questionText: this.translate.instant(
			"Are you sure you want to delete?"
		  ),
		};

		this.dialog
		  .open(ConfirmationModalComponent, dialogConfig)
		  .afterClosed()
		  .subscribe((response) => {
			if (response.result) {
				this.spinner = true;
				this.suppliersService.deleteProjectMaterialSupplier(id).subscribe((response) => {
					if (response["status"]) {
						this.suppliers.splice(i, 1);
					}
					this.spinner = false;
				});
			}
		});
	}


	onMaterialCategorySelect(item) {

		this.suppliers_category = [];
		this.selected_material_categories = item.Name;
		this.onCateogryChange(item.Id);
		this.newProjectSupplier.cateogryId = item.Id;
		this.newProjectSupplier.supplierId = null;
		this.selected_supplier_category = 'Välj Leverantör';
	}


	onCateogryChange(selectedCategory) {

		this.spinner = true;
		this.suppliersService.getSuppliersByCateogryId(selectedCategory).subscribe((suppliers: any) => {

			this.spinner = false;
			this.suppliers_category = suppliers;
			this.selectdSupplier = this.suppliers_category[0].Id;
		});
	}

	onSupplierCategorySelect(item) {

		this.newProjectSupplier.supplierId = item.Id;

	}

	allowAddSupplierOnProject() {

		let status = true;
		let alreadyAdded = null;
		if( this.newProjectSupplier.cateogryId && this.newProjectSupplier.supplierId) {
			alreadyAdded = this.suppliers.some(
				(matSup) =>
				  matSup.categoryId == this.newProjectSupplier.cateogryId &&
				  matSup.supplierId == this.newProjectSupplier.supplierId
			);
		}else {
			status = false;
		}

		if(alreadyAdded) {
			status = false;
		}
		return status;
	}

	create() {
		this.spinner = true;
		this.suppliersService
		.addProjectMaterialSupplier(
			this.newProjectSupplier.projectId,
			this.newProjectSupplier.cateogryId,
			this.newProjectSupplier.supplierId
		)
		.subscribe(async(response) => {
			if (response["status"]) {
				await this.getProjectMaterialSupplier();
				await this.getSupplierCategories();
				this.spinner = false;
			} else {
				this.spinner = false;
			}
		});
	}
}