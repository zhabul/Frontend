import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {
  public userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
  public clientsColor = "clients-color";
  public suppliersColor = "suppliers-color";
  public productsColor = "products-color";

  constructor(private router: Router) {
      if(!this.userDetails.show_register_Global) {
        this.router.navigate(["/home"]);
      }    
  }

  ngOnInit() {    
    this.userDetails = JSON.parse(sessionStorage.getItem("userDetails"));
  }

  goBack() {
    this.router.navigate(["/home"]);
  }
  clientsEnter() {
    this.clientsColor = "clients-color-hover";
  }

  clientsLeave() {
    this.clientsColor = "clients-color";
  }

  suppliersEnter() {
    this.suppliersColor = "suppliers-color-hover";
  }

  suppliersLeave() {
    this.suppliersColor = "suppliers-color";
  }
  productsEnter() {
    this.productsColor = "products-color-hover";
  }

  productsLeave() {
    this.productsColor = "products-color";
  }
}
