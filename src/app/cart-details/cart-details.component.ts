import { Component, OnInit } from '@angular/core';
import { HideMenusService } from '../hide-menus.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from '../data.service';

import { Globals } from '../globals/global';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',  
  styleUrls: ['./cart-details.component.scss']
})
export class CartDetailsComponent implements OnInit {
  empList: Array<any> = [];
  cartItems: Array<any> = [];
  grandTotal: number = 0;
  key$: Object;
private custId:String;
  constructor(private data: DataService, public nav: HideMenusService, private spinner: NgxSpinnerService,private global:Globals) { 
    this.custId=global.CUSTOMER_ID;
  }


  ngOnInit() {

    sessionStorage.setItem("redirectPage",window.location.href);
    this.cartItems = JSON.parse(sessionStorage.getItem('cartList'));
    // FROM CARD ADDING PAGE
    if(sessionStorage.getItem("fusebillRedirect")=='true' ){
      this.spinner.show();
      setTimeout(() => { 
        /** spinner ends after 5 seconds */
        this.spinner.hide();
      }, 4000);
      this.cartItems.forEach(element => {
        var status = this.data.createSub(element.selectedFreId, this.custId);
      });
      sessionStorage.removeItem('cartList');
      var json = JSON.stringify(status);
      sessionStorage.setItem("fusebillRedirect","false");
    }
  // FROM CARD ADDING PAGE
    this.nav.show();

    this.cartItems.forEach(element => {
      this.grandTotal += element.amount;
    });
  
    
    console.log(JSON.stringify(this.cartItems));
  } 
  remove(cartModel) {
    // this.cartItems.splice(cartModel);   
    const index1 = this.cartItems.indexOf(cartModel);
    this.cartItems.splice(index1, 1);
    sessionStorage.setItem("cartList", JSON.stringify(this.cartItems));
    this.grandTotal=0;
    this.cartItems.forEach(element => {
      this.grandTotal += element.amount;
    });
  }
  subscribe(checkOutItems) {
    if(sessionStorage.getItem("isCardAdded")=="true"){
      if (confirm("Click OK to continue payment using your saved card ending in " + sessionStorage.getItem("cardNumner") + ". To use different payment method, please select Manage Payment option in the Home page.")) {
      this.spinner.show();
      setTimeout(() => {
        /** spinner ends after 5 seconds */
        this.spinner.hide();
      }, 4000);
      checkOutItems.forEach(element => {
        var status = this.data.createSub(element.selectedFreId, this.custId);
      });
      sessionStorage.removeItem('cartList');
      var json = JSON.stringify(status);
    }
    }else{
      if (confirm("You need to add a payment method to subscrribe a service. Click OK to proceed.")) {
        sessionStorage.setItem("fusebillRedirect","true");
        this.spinner.show();
        this.data.getSingleSignOnKey(this.custId).subscribe(
    
          data => { this.key$ = data },
          err => {
            console.log(err)
          }, () => {
            sessionStorage.setItem("redirectPage",window.location.href);
            window.location.href = 'https://zoftsolutions3.mybillsystem.com/ManagedPortal/PaymentMethod?token=' + this.key$;
          }
    
        );
        setTimeout(() => {
          /** spinner ends after 5 seconds */
          this.spinner.hide();
        }, 3500);
      }
      
    }
    


  }
}
