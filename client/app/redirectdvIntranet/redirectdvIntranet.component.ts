//Nativi
import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute,Params,Router } from '@angular/router';

//Servizi
import { DetailviewerService } from '../_services/index';
import { EnvironmentService } from '../_services/index'; //la import del servizio

//Direttive

//Other libs without typings
declare var System: any;

//Componente
@Component({
  moduleId: module.id,
  templateUrl: 'redirectdvIntranet.component.html'
})

//OnInit generale fa roba
export class RedirectDVIntranetComponent implements OnInit {

  globalParams: String[];

  constructor
  (
    private detailviewerService: DetailviewerService
   ,private router: Router
   ,private route: ActivatedRoute
   ,private _environmentService: EnvironmentService) {
      route.params.subscribe(params => {
        this.globalParams=[];
  //      var ap=[];
  //      ap.push(params[0]);
        this.globalParams.push(params[0]);
  //      ap.push(params[1]);
        this.globalParams.push(params[1]);
  //      console.log(this.globalParams);
        this.retriveDetails(this,this.globalParams);
      });
  }

  ngOnInit() {
  }

  retriveDetails(parent: any,ap: any) {
    parent._environmentService.setDetailLocalCollection(ap[0]);
    this.detailviewerService.getDetailsFromOID(ap).subscribe(
      function(response) {
        var tmp_json=((<any>response)._body);
        if(tmp_json==null) { return; }
        var processed_json=JSON.parse(tmp_json);
        for(var i=0;i<processed_json.length;i++) {
          for(let key in processed_json[i]) {
            let value=processed_json[i][key];
            if((key=='user_access')&&value=='rw'){
//              console.log('RW '+parent.globalParams[0]+parent.globalParams[1]);
              parent.openDetailsPageRW(parent.globalParams[0],parent.globalParams[1]);
            }
            else {
//              console.log('RO '+parent.globalParams[0]+parent.globalParams[1]);
              parent.openDetailsPageRO(parent.globalParams[0],parent.globalParams[1]);
            } 
          }
        }
      }
    );
  }

  openDetailsPageRO(coll: String,id: String) {
    var ap=[];
    ap.push(coll);
    ap.push(id);
    //console.log(ap);
    this.router.navigate(['/detailviewerIntranetRO',ap]);
  }

  openDetailsPageRW(coll: String,id: String) {
    var ap=[];
    ap.push(coll);
    ap.push(id);
    //console.log(ap);
    this.router.navigate(['/detailviewerIntranetRW',ap]);
  }

}
