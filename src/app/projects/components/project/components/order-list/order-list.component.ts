import { Component, OnInit, Input } from "@angular/core";
import { Order } from "src/app/core/models/order";
import { ActivatedRoute, Router } from "@angular/router";
import { CartService } from "src/app/core/services/cart.service";
import { InitProvider } from "src/app/initProvider";
import {  MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { ChangeOrderDateComponent } from "src/app/orders/components/change-order-date/change-order-date.component";
// import { ChangeOrderDateComponent } from "src/app/orders/components/change-order-date/change-order-date.component";
// import { ToastrService } from "ngx-toastr";
// import { TranslateService } from "@ngx-translate/core";

@Component({
    selector: "order-list",
    templateUrl: "./order-list.component.html",
    styleUrls: ["./order-list.component.css"],
})
export class OrderListComponent implements OnInit {
    @Input() orders: any;
    @Input() project: any;
    public orderData: Order;
    public projectID: any;
    public userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
    public originalOrders = [];
    public orderAccess = false;
    public currentClass = "title-new-project";
    public activeTab = 0;
    swiper = {
        images: [],
        active: -1,
        album: -2,
        index: -1,
        parent: null,
    };

    public spinner: boolean = true;
    public container_height = "calc(100vh - 154px - 0px)";
    @Input("top_menu_status") set containerHeight(status) {
      if (status == true) {
        this.container_height = "calc(100vh - 537px - 0px)";
      } else {
        this.container_height = "calc(100vh - 154px - 0px)";
      }
    }
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private cartService: CartService,
        public initProvider: InitProvider,
        private dialog: MatDialog,
        private toastr: ToastrService,
        private translate: TranslateService,
    ) { }

    ngOnInit() {
        this.originalOrders = JSON.parse(JSON.stringify(this.orders));
        this.orderData = JSON.parse(sessionStorage.getItem("orderData"));
        this.projectID = this.route.snapshot.paramMap.get("id");
        this.filterByStatus("-1");
        this.orderAccess = this.userDetails.show_project_Order && this.initProvider.hasComponentAccess('orders');
        this.redirectIfHasNoAccess();
    }

    redirectIfHasNoAccess() {
        if (!this.orderAccess) {
            this.router.navigate(["/"]);
        }
    }

    filterByStatus(status) {
        if (status == "-3") {
            this.orders = this.originalOrders;
        } else if (status == "-1") {
            this.orders = this.originalOrders.filter((order) => {
                return (
                    order.status == "-1" ||
                    (order.status == "1" && order.saved != "1") ||
                    order.status == "2"
                );
            });
        } else if (status == "5") {
            this.orders = this.originalOrders.filter((order) => {
                return (
                    (order.status == "1" &&
                        order.saved == "1" &&
                        order.hasErrors == "0") ||
                    (order.status == "1" &&
                        order.saved == "1" &&
                        order.hasErrors == "1" && order.errorsResolved == '1')  ||
                    order.status == "3" ||
                    order.status == "4"
                );
            });
        } else if (status == "-2") {
            this.orders = this.originalOrders.filter((order) => {
                return order.status == "-2";
            });
        } else {
            this.orders = this.originalOrders.filter((order) => {
                return order.status == "0";
            });
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

    removeSwiperImage(event) { }


    createImageArray(image) {

      const id = image.id;
      const comment = image.Description;
      const name = image.Name ? image.Name : image.name;
      //const image_path = image.image_path;
      const file_path = image.file_path;
      const type = image.document_type;

      const imageArray = file_path.split(",").map((imageString) => {
          return {
              image_path: imageString,
              id: id,
              Description: comment,
              name: name,
              file_path: file_path,
              type: type
          };
      });
      return imageArray;
  }

    isPDFViewer: boolean = false;
    openSwiper($event, order) {
        $event.stopPropagation();
        const images = [
          {
              image_path: order.image_path,
              id: order.id,
              Description: null,
              file_path: order.image ? order.image : order.file,
              Url: order.image ? order.image : order.file,
              document_type: order.image ? "Image" : "pdf"
          },
      ];

      if (images[0].document_type === "Image") {
        this.isPDFViewer = false;
          this.swiper = {
              active: 0,
              images: images,
              album: -1,
              index: -1,
              parent: null,
          };
      } else {
          const imageArray = this.createImageArray(images[0]);
          this.isPDFViewer = true;
          this.swiper = {
              active: 0,
              images: imageArray,
              album: -1,
              index: 0,
              parent: images[0],
          };
      }
    }

    navigateToOrder(order, $event) {

        const nodeName = $event.target.nodeName.toLowerCase();
        const nodeNameIsImage = nodeName === 'img' || nodeName === 'a' || nodeName === 'span';
        if (nodeNameIsImage) return;
        if (order.status != -2) {
            this.router.navigate([`/orders/order/${order.orderID}`]);
            return;
        }

        this.cartService.orderData.next(order);
        sessionStorage.setItem("orderData", JSON.stringify(order));
        this.cartService.updateCartItems(0);
        this.router.navigate(["orders", "categories"]);
    }
    enter() {
        this.currentClass = "title-new-project-hover";
      }

      leave() {
        this.currentClass = "title-new-project";
      }


      openModal(order) {
        const diaolgConfig = new MatDialogConfig();
        diaolgConfig.autoFocus = true;
        diaolgConfig.disableClose = true;
        // diaolgConfig.width = "932px";
        diaolgConfig.data = {
          data: {'date': order.date, 'id': order.orderID},
        };
        diaolgConfig.panelClass = "bdrop";


        this.dialog
          .open(ChangeOrderDateComponent, diaolgConfig)
          .afterClosed()
          .subscribe((response) => {
            if (response) {
                order.date = response
                this.spinner = false;
                this.toastr.success(
                  this.translate.instant("Successfully sent weekly report"),
                  this.translate.instant("Success")
                );
            }
          });
      }
    
    async canYouChangeTab(index: number) {
        /* let theFormHasBeenChanged: boolean;
        this.atestInfoService.getIfHasChangesOnForm().subscribe((response) => {
            theFormHasBeenChanged = response;
        });

        if(theFormHasBeenChanged) {
        if(await this.onConfirmationModal()) {
            this.atestInfoService.setIfHasChangesOnForm(false);
            this.setActiveTab(index);
        }
        } else {
            this.setActiveTab(index);
        }*/

        console.log("*******************")
        console.log(index)
        this.activeTab = index;
    }    
}
