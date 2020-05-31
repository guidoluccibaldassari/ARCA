//Nativi
import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute,Params,Router } from '@angular/router';

//Componente
@Component({
  moduleId: module.id,
  templateUrl: 'database.component.html'
})

//OnInit generale fa roba
export class DatabaseComponent implements OnInit {

  constructor(private router: Router,private route: ActivatedRoute) {
  }

  ngOnInit() {
  }

}
