//Nativi
import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { Router } from '@angular/router';

//Servizi
import { EnvironmentService } from './index'; //la import del servizio

@Injectable()
export class AuthenticationService {
  constructor(
    private http: Http
   ,private _environmentService: EnvironmentService
   ,private router: Router
  ){
    console.log("Auth contruction done!");
  }

  login(username: string, password: string) {
    return this.http.post('/users/authenticate', { username: username, password: password })
                    .map((response: Response) => {
                     // login successful if there's a jwt token in the response
                         let user = response.json();
                           if (user && user.token) {
                           // store user details and jwt token in local storage to keep user logged in between page refreshes
                           localStorage.setItem('currentUser', JSON.stringify(user));
                           this._environmentService.setCurrentUserData(localStorage.getItem('currentUser'));
                         }
                         return user;
                      }
                    );
    }
  
  logout() {
    // remove user from local storage to log user out
    console.log('logout');
    localStorage.removeItem('currentUser');
    this._environmentService.resetCurrentUserData();
  }
  
  homeRedirect(){
    this.router.navigate(['/']);
  }
  
  theExit(){
    this.homeRedirect();
    this.logout();
  }
}