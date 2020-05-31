//Nativi
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';

//Modelli
//import { User } from '../_models/index';

//Servizi
//import { EnvironmentService } from './index'; //la import del servizio

@Injectable()
export class DetailviewerService {

  constructor(
    private http: Http
//   ,private _environmentService: EnvironmentService
   ) { }

  getDetailsFromOID(_parametriQuery: string[]){
    var user;
//    let user = new User();
    let params = new URLSearchParams();
//    console.log(params.get('collection'));
//    console.log(params.get('objectId'));
    if(localStorage.getItem('currentUser'))
    {
//    user = this._environmentService.getCurrentUserData();
      user = JSON.parse(localStorage.getItem('currentUser'));
      params.set('numberOfGroups',user.Gruppi_associati.length);
      for(var i=0;i<user.Gruppi_associati.length;i++){
        params.set('g'+i,user.Gruppi_associati[i]);
      }
      params.set('collection',_parametriQuery[0]);
      params.set('objectId',_parametriQuery[1]);
      return this.http.get('/informationretrievalIntranet',{params: params}).map((response: Response) => response);
    }
    else
    {
      params.set('collection',_parametriQuery[0]);
      params.set('objectId',_parametriQuery[1]);
      return this.http.get('/informationretrieval',{params: params}).map((response: Response) => response);
    }
	}

  getAllChildrenDataFromAllCollUsingOID(_parametriQuery: string[]){
    var user;
//    let user = new User();
    let params = new URLSearchParams();
//    console.log(params.get('collection'));
//    console.log(params.get('objectId'));
//    console.log(params.get('selector'));
    if(localStorage.getItem('currentUser'))
    {
//    user = this._environmentService.getCurrentUserData();
      user = JSON.parse(localStorage.getItem('currentUser'));
      params.set('numberOfGroups',user.Gruppi_associati.length);
      for(var i=0;i<user.Gruppi_associati.length;i++){
        params.set('g'+i,user.Gruppi_associati[i]);
      }
      params.set('collection',_parametriQuery[0]);
      params.set('objectId',_parametriQuery[1]);
      params.set('selector',_parametriQuery[2]);
      return this.http.get('/informationretrievalIntranet',{params: params}).map((response: Response) => response);
    }
    else
    {
      params.set('collection',_parametriQuery[0]);
      params.set('objectId',_parametriQuery[1]);
      params.set('selector',_parametriQuery[2]);
      return this.http.get('/informationretrieval',{params: params}).map((response: Response) => response);
    }
  }

  getParentDataUsingOID(_parametriQuery: string[]){
    var user;
//    let user = new User();
    let params = new URLSearchParams();
//    console.log(params.get('collection'));
//    console.log(params.get('objectId'));
//    console.log(params.get('selector'));
    if(localStorage.getItem('currentUser'))
    {
//    user = this._environmentService.getCurrentUserData();
      user = JSON.parse(localStorage.getItem('currentUser'));
      params.set('numberOfGroups',user.Gruppi_associati.length);
      for(var i=0;i<user.Gruppi_associati.length;i++){
        params.set('g'+i,user.Gruppi_associati[i]);
      }
      params.set('collection',_parametriQuery[0]);
      params.set('objectId',_parametriQuery[1]);
      params.set('selector',_parametriQuery[2]);
      return this.http.get('/informationretrievalIntranet',{params: params}).map((response: Response) => response);
    }
    else
    {
      params.set('collection',_parametriQuery[0]);
      params.set('objectId',_parametriQuery[1]);
      params.set('selector',_parametriQuery[2]);
      return this.http.get('/informationretrieval',{params: params}).map((response: Response) => response);
    }
  }

  updSingleProp(_parametriQuery: string[]) {
    var user;
//    let user = new User();
    //console.log("service.ts: "+_parametriQuery);
    var body=[];
    if(localStorage.getItem('currentUser')) 
    {
      var internal_pq = [];
      var start;
//    user = this._environmentService.getCurrentUserData();
      user = JSON.parse(localStorage.getItem('currentUser'));
      internal_pq.push('numberOfGroups');
      internal_pq.push(user.Gruppi_associati.length);
      body.push('numberOfGroups');
      body.push(user.Gruppi_associati.length);
      for(var i=0;i<user.Gruppi_associati.length;i++){
        internal_pq.push('g'+i);
        internal_pq.push(user.Gruppi_associati[i]);
        body.push('g'+i);
        body.push(user.Gruppi_associati[i]);
      }
      start=0;
//      if(_parametriQuery[0]==="updSingleProp"){ //MEH!
//        internal_pq.push(_parametriQuery[start]);
//        body.push(_parametriQuery[start]);
//        start=1;
//      }
      for(var i=start;i<_parametriQuery.length;i+=2) {
//        console.log("Brutto loop: " +(_parametriQuery[i]+" : "+_parametriQuery[i+1] ));
        internal_pq.push(_parametriQuery[i]);
        internal_pq.push(_parametriQuery[i+1]);
        body.push(_parametriQuery[i]);
        body.push(_parametriQuery[i+1]);
      }
      return this.http.post('/informationretrievalIntranet',internal_pq).map((response: Response) => response);
    }
    else{
      return 'Error: access denied';//non dovrebbe mai succedere.
    }
  }

}
