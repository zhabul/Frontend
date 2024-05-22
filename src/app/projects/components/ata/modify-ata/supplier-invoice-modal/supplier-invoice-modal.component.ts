import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'app-supplier-invoice-modal',
  templateUrl: './supplier-invoice-modal.component.html',
  styleUrls: ['./supplier-invoice-modal.component.css']
})
export class SupplierInvoiceModalComponent implements OnInit {

    constructor(
        @Inject(MAT_DIALOG_DATA) public modal_data: any,
        public dialogRef: MatDialogRef<SupplierInvoiceModalComponent>
    ) { }

    public supplierInvoices:any[] = [];
    public supplier_checked:any = [];
    public supplier_unchecked:any = [];
    public project:any;
    offDiv: boolean = false;
    swiper = {
        images: [],
        active: -1,
        album: -2,
        index: -1,
        parent: null,
    };
    swiperSupplierInvoice = {
        images: [],
        active: -1,
        album: -2,
        index: -1,
        parent: null,
    };

    ngOnInit(): void {
        this.supplierInvoices = this.modal_data.supplierInvoices;
        this.project = this.modal_data.project;
    }

    checkAll($event) {
        let checkboxes = document.getElementsByClassName(
          `supplier-invoice-checkbox`
        );
        if ($event.target.checked) {
          for (let i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i]["checked"] == false) {
              const element = checkboxes[i] as undefined as HTMLElement;
              element.click();
            }
          }
        } else {
          for (let i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i]["checked"] == true) {
              const element = checkboxes[i] as undefined as HTMLElement;
              element.click();
            }
          }
        }
    }

    supplierInvoiceChecked(value, index) {

        this.supplierInvoices[index].isChecked = value;
        const invoice = this.supplierInvoices[index];

        if (value) {
            this.supplier_checked.push({
                id: "",
                Name: invoice.SupplierName,
                Quantity: 1,
                Unit: "pieces",
                Price: invoice.Price,
                Deduct:
                invoice.Deduct == 0
                  ? this.project["ataChargeMaterial"]
                  : invoice.Deduct,
                Total:
                invoice.Deduct == 0
                  ? (this.project["ataChargeMaterial"] / 100 + 1) * invoice.Total
                  : invoice.Total,
                Account:
                invoice.Type == "SupplierInvoice" ||
                invoice.Type == "SupplierInvoiceRow"
                  ? invoice.Account
                  : "",
                OrderNR: invoice.OrderNR,
                importedFromFortnox: true,
                Type: invoice.Type,
                SupplierInvoiceId: invoice.id,
                Number:
                invoice.Type == "SupplierInvoice" ||
                invoice.Type == "SupplierInvoiceRow"
                  ? invoice.Account
                  : "",
                pdf_images: invoice.image_path,
                pdf_doc: invoice.pdf_link,
                file_path : invoice.pdf_link,
                pdf_link: invoice.pdf_link,
            });

            if(this.supplier_unchecked.includes(invoice.id)) {

                const i2 = this.supplier_unchecked.findIndex((inv_id) => inv_id == invoice.id);
                if(i2 > -1) {
                    this.supplier_unchecked.splice(i2, 1);
                }
            }
        } else {
            this.supplier_checked.splice(index, 1);
            this.supplier_unchecked.push(invoice.id);
        }
    }

    close(){
        this.dialogRef.close({'supplier_checked': this.supplier_checked, supplier_unchecked: this.supplier_unchecked})
    }

    isPDFViewer: boolean = false;
    openSwiperSupplierInvoice(invoice = null, article = null) {

      let fileArray = [];

      if(invoice){
        if (invoice.pdf_link !== "") {
          this.isPDFViewer = true;
          fileArray = this.createImageArraySupplierInvoice(invoice);
          this.swiperSupplierInvoice = {
              active: 0,
              images: fileArray,
              album: invoice.id,
              index: -1,
              parent: null
          };
        }
      }else if(article){
        if (article.pdf_doc !== "") {
          this.isPDFViewer = true;
          let obj = {
            'id': 5555555555,
            'comment': '',
            'name': article.Name,
            'image_path': article.pdf_images,
            'file_path': article.pdf_doc
        }

        fileArray = this.createImageArraySupplierInvoice(obj);

        this.swiperSupplierInvoice = {
            active: 0,
            images: fileArray,
            album: 5555555555,
            index: -1,
            parent: null
        };
        }
      } else {
        this.isPDFViewer = false;
      }
      this.offDiv = true;
    }

    closeSwiperSupplierInvoice() {
        this.swiperSupplierInvoice = {
            images: [],
            active: -1,
            album: -2,
            index: -1,
            parent: null,
        };
        this.offDiv = true;
    }


    createImageArraySupplierInvoice(invoice) {

        const segments = invoice.pdf_link.split('/');
        const id = invoice.id;
        const comment = '';
        const name = invoice.SupplierName || '';
        //const file_path = segments.slice(4).join('/');
        const file_path = segments.slice(4).join('/') ? segments.slice(4).join('/') : invoice.pdf_link.slice(invoice.pdf_link.indexOf('file/'));
        const type = this.isPDFViewer ? 'pdf' : 'image';
        let imageArray = file_path.split(",").map((imageString) => {
            return {
                image_path: imageString,
                id: id,
                Description: comment,
                name: name,
                file_path: file_path,
                type: type,
            };
        });
        return imageArray;
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
}
