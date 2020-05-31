import { Component,OnInit } from '@angular/core';
import { AuthenticationService } from './_services/index';

@Component({
  moduleId: module.id,
  selector: 'app',
  templateUrl: 'app.component.html'
})

export class AppComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService){}
  ngOnInit() {
    this.authenticationService.logout();
    null;
  }
}