import { Component,OnInit } from '@angular/core';

//con un giro di redirect -> nient'altro che un elenco di proprietà da _models/user.ts
import { User } from '../_models/index';
//tutti i metodi di svariate "librerie" [directives? services? dal nome direi services]
import { UsersService } from '../_services/index';

//Componente
@Component({
  moduleId: module.id,
  templateUrl: 'users.component.html'
})

//OnInit fa roba
export class UsersComponent implements OnInit {
  currentUser: User;
  users: User[] = [];
  //il fulcro di ogni chiamata è  JSON.parse(localStorage.getItem('currentUser'));
  constructor(private userService: UsersService) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }
  ngOnInit() {
    this.loadAllUsers();
    null;
  }
  deleteUser(_id: string) {
    this.userService.delete(_id).subscribe(() => { this.loadAllUsers() });
  }
  private loadAllUsers() {
    this.userService.getAll().subscribe(users => { this.users = users; });
  }
}
