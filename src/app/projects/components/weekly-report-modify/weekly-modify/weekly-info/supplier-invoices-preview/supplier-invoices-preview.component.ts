import { Component, OnInit, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: 'app-supplier-invoices-preview',
  templateUrl: './supplier-invoices-preview.component.html',
  styleUrls: ['./supplier-invoices-preview.component.css']
})
export class SupplierInvoicesPreviewComponent implements OnInit {

/*   public zatvoreno;
 */
/*   @Output() onCloseModal = new EventEmitter()
 */
/*    @Output() zatvoreno = new EventEmitter<{ zatvoreno: boolean }>();
 */
  constructor(    public dialogRef: MatDialogRef<SupplierInvoicesPreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public modal_data: any,
    ) { }
    public supplier_invoices:any;
    public isPDFViewer: boolean = false;
    public swiper = {
        images: [],
        active: -1,
        album: -2,
        index: -1,
        parent: null,
    };
    offDiv: boolean = false;

    ngOnInit(): void {
        this.supplier_invoices = this.modal_data.data;
    }

    close(parameter = false, from) {
        this.dialogRef.close(this.supplier_invoices);
    }

    public widthParams = 17.65;
    public heightParams = 17.65;

    supplierInvoiceChecked(value, index) {
        this.supplier_invoices[index].isChecked = value;
    }

    getAlbumFilesKS(index) {
        const activeSupplier = this.supplier_invoices[index];

        return activeSupplier["pdf_link"];
    }

    openSwiper(index, supplier) {

        const fileArray = this.createFileArray(supplier);
        this.swiper = {
            active: 0,
            images: fileArray,
            album: 50000,
            index: index,
            parent: null,
        };

        this.offDiv = true;//
        this.isPDFViewer = supplier.pdf_link.length > 0 ? true : false;
    }

    closeSwiper() {
        this.swiper = {
            active: -1,
            images: [],
            album: -2,
            index: -1,
            parent: null,
        };
        this.offDiv = false;
    }

    createFileArray(file) {
        const id = file.id;
        const comment = '';
        const name = file.name;
        const file_path = (file.pdf_link && file.pdf_link.length > 0) ? file.pdf_link : file.image_path;
        const fileArray = file_path.split(",").map((fileString) => {
            return {
                image_path: fileString,
                id: id,
                Description: comment,
                name: name,
                file_path: file_path,
            };
        });
        return fileArray;
    }    
}


