//Nativi
import { Component,OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';

//Servizi
//import { AlertService } from '../_services/index';
import { AuthenticationService } from '../_services/index';

@Component({
  moduleId: module.id,
  templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {
  model: any={};
  loading=false;
  returnUrl: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
//    private alertService: AlertService
  ) { }

  ngOnInit() {
    // reset login status
    /* commentato perchè falliva e piantava tutto */
    //this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl=this.route.snapshot.queryParams['returnUrl']||'/';
  }

  login() {
    this.authenticationService.logout();
    this.loading=true;
    /* commentato perchè falliva e piantava tutto */
    this.authenticationService.login(this.model.username, this.model.password)
        .subscribe(
            data => {
              this.router.navigate([this.returnUrl]);
            },
            error => {
              //this.alertService.error(error);
              this.loading = false;
            });
  }
}
