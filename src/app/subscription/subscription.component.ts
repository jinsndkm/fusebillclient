import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { HideMenusService } from '../hide-menus.service';
import { Session } from 'protractor';
import { FilterPipe } from 'ngx-filter-pipe';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxPaginationModule } from 'ngx-pagination';
@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {

  mysubscriptions$: Object;
  planDetails$: Object;

  autorenewal$: Object;


  items$: Object;




  users: any[] = [];
  userFilter: any = {};

  constructor(private data: DataService, public nav: HideMenusService, private spinner: NgxSpinnerService, private filterPipe: FilterPipe) { }


  ngOnInit() {
    
    this.spinner.show();
    this.nav.show();
    this.data.getMySubscription().subscribe(

      data => { this.mysubscriptions$ = data },
      err => {
        console.log(err)
      }, () => {
        setTimeout(() => {
          /** spinner ends after 5 seconds */
          this.spinner.hide();
        }, 2000);
      }

    );
   
  }
  //Method to delete an active subscription
  cancelSubscription(subId, planname) {
    if (confirm("Are you sure want to cancel this subscription?")) {
      this.items$ = this.data.cancelSubscription(subId);
      this.data.getMySubscription().subscribe(
        data => this.mysubscriptions$ = data
      );
    }
    
  }

  autorenewalFunction(subscriptionId: String, e) {
    if (e.target.checked == true) {
      this.data.disableAutorenewal(subscriptionId, "true").subscribe(
        data => this.autorenewal$ = data
      );
      alert("Auto renewal is turned on")
    } else if (e.target.checked == false) {
      this.data.enableAutorenewal(subscriptionId, "false").subscribe(
        data => this.autorenewal$ = data
      );
      alert("Auto renewal is turned off")
    }


  }
}
