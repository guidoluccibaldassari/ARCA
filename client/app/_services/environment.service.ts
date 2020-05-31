//Nativi
import {Injectable} from '@angular/core';

//Modelli
import {HyperlinkEnabledFields} from '../_models/index_e'; 
import {User} from '../_models/index';

@Injectable()
export class EnvironmentService {
	
  private ricercaGlobalePerCollezioni:number;
  private ricercaPerNodiGeografici:number;
  private vistaIniziale:number;
  private ricercaInviata:number;
  private ricercaLocaleInviata:number;
  private nomeNodoGeografico:String;
  private collezioniNG:any[];
  private collezioniNGReady:number;
  private idNodoGeografico:String;
  private cameraReadyRetKeysDetNG:String[];
  private cameraReadyRetValuesDetNG:String[];
  private collezioneSelezionata:string;
  private linksFormNodiGeografici:number;
  private formNodiGeografici:number;
  private queryResultsDetailsSerializedEnv:any[];
  private globalSearchQueryArgumentsEnv:any[];
  private queryResultsDetailsIdEnv:String[];
  private globalResultsElementsLineNumberEnv:number;
  private globalResultsElementsLineNumberIndexEnv:number;
  private hyperlinkEnabledFields:HyperlinkEnabledFields;
  private detailLocalCollection:String; //la collezione a cui appartiene il dettaglio attualmente visualizzato
  private cRValuesIndex:number; 
  private currentUserData:User[]; //= new User();

  constructor(){
    //this.initCurrentUserData();
  };

  setRicercaGlobalePerCollezioni(val:number){this.ricercaGlobalePerCollezioni=val;}

  getRicercaGlobalePerCollezioni(){return this.ricercaGlobalePerCollezioni;}

  setRicercaPerNodiGeografici(val:number){this.ricercaPerNodiGeografici=val;}

  getRicercaPerNodiGeografici(){return this.ricercaPerNodiGeografici;}

  setVistaIniziale(val:number){this.vistaIniziale=val;}

  getVistaIniziale(){return this.vistaIniziale;}

  setRicercaInviata(val:number){this.ricercaInviata=val;}

  getRicercaInviata(){return this.ricercaInviata;}
  
  setRicercaLocaleInviata(val:number){this.ricercaLocaleInviata=val;}

  getRicercaLocaleInviata(){return this.ricercaLocaleInviata;}

  setNomeNodoGeografico(val:String){this.nomeNodoGeografico=val;}

  getNomeNodoGeografico(){return this.nomeNodoGeografico;}

  setCollezioniNGReady(val:number){this.collezioniNGReady=val;}

  getCollezioniNGReady(){return this.collezioniNGReady;}
  
  setIdNodoGeografico(val:String){this.idNodoGeografico=val;}

  getIdNodoGeografico(){return this.idNodoGeografico;}

  setCollezioniNG(val:any[]){
    //console.log("Init1");
    this.collezioniNG=[];
	this.collezioniNG.push(val[0]);
	//console.log(this.collezioniNG);
  }

  getCollezioniNG(){return this.collezioniNG;}
  
  //questa la usa solo nel component per ritornarmi le collezioni "benformate" a partire dai dati ritornati dalla query.
  getCollezioniNGEnabled(){
	//console.log("Init2");
	var enabledColl=[];
	if(this.getCollezioniNGReady()===1){
	  //console.log(this.collezioniNG);
	  let fieldValues = this.collezioniNG[0];
	  //console.log(fieldValues);
	  let keys = Object.keys(fieldValues);
	  let values = Object.keys(fieldValues).map(key => fieldValues[key]);
	  for(var j=0;j<keys.length;j++){
		//console.log(keys[j]);
		//console.log(values[j]);
		if(values[j]){
		  enabledColl.push(keys[j]);
		}
	  }
	}
	return enabledColl;
  }
  
  setCameraReadyRetKeysDetNG(val:any[]){
	//console.log(val);
    this.cameraReadyRetKeysDetNG=[];
	this.cameraReadyRetKeysDetNG=val;
	//console.log(this.cameraReadyRetKeysDetNG);
  }

  getCameraReadyRetKeysDetNG(){return this.cameraReadyRetKeysDetNG;}
  
  setCameraReadyRetValuesDetNG(val:any[]){
	//console.log(val);
    this.cameraReadyRetValuesDetNG=[];
	this.cameraReadyRetValuesDetNG=val;
	//console.log(this.cameraReadyRetValuesDetNG);
  }

  getCameraReadyRetValuesDetNG(){return this.cameraReadyRetValuesDetNG;}
  
  setCollezioneSelezionata(val:string){
	  //console.log(val);
	  this.collezioneSelezionata=val;
  }

  getCollezioneSelezionata(){return this.collezioneSelezionata;}
  
  setFormNodiGeografici(val:number){this.formNodiGeografici=val;}

  getFormNodiGeografici(){return this.formNodiGeografici;}
  
  setLinksFormNodiGeografici(val:number){this.linksFormNodiGeografici=val;}

  getLinksFormNodiGeografici(){return this.linksFormNodiGeografici;}
  
  setQueryResultsDetailsSerializedEnv(val:any[]){
    //console.log("Init1");
    this.queryResultsDetailsSerializedEnv=[];
    for(var i=0;i<val.length;i++){
	  this.queryResultsDetailsSerializedEnv.push(val[i]);
    }
	//console.log(this.queryResultsDetailsSerializedEnv);
  }

  getQueryResultsDetailsSerializedEnv(){return this.queryResultsDetailsSerializedEnv;}

  setGlobalSearchQueryArgumentsEnv(val:any[]){
    //console.log("Init1");
    this.globalSearchQueryArgumentsEnv=[];
    for(var i=0;i<val.length;i++){
	  this.globalSearchQueryArgumentsEnv.push(val[i]);
    }
	//console.log(this.globalSearchQueryArgumentsEnv);
  }

  getGlobalSearchQueryArgumentsEnv(){return this.globalSearchQueryArgumentsEnv;}

  setQueryResultsDetailsIdEnv(val:any[]){
    //console.log("Init1");
    this.queryResultsDetailsIdEnv=[];
    for(var i=0;i<val.length;i++){
	  this.queryResultsDetailsIdEnv.push(val[i]);
    }
	//console.log(this.queryResultsDetailsIdEnv);
  }

  getQueryResultsDetailsIdEnv(){return this.queryResultsDetailsIdEnv;}

  setGlobalResultsElementsLineNumberEnv(val:number){this.globalResultsElementsLineNumberEnv=val;}

  getGlobalResultsElementsLineNumberEnv(){return this.globalResultsElementsLineNumberEnv;}
  
  setGlobalResultsElementsLineNumberIndexEnv(val:number){this.globalResultsElementsLineNumberIndexEnv=val;}

  getGlobalResultsElementsLineNumberIndexEnv(){return this.globalResultsElementsLineNumberIndexEnv;}
  
  setHyperlinkEnabledFields(val:HyperlinkEnabledFields){this.hyperlinkEnabledFields=val;}

  getHyperlinkEnabledFields(){return this.hyperlinkEnabledFields;}

	setDetailLocalCollection(val:String){this.detailLocalCollection=val;}

	getDetailLocalCollection(){return this.detailLocalCollection;}
	
//	initCurrentUserData(){
//	  this.currentUserData._id='';
//    this.currentUserData.Username='';
//    this.currentUserData.Nome='';
//    this.currentUserData.Cognome='';
//    this.currentUserData.Gruppi_associati=[];
//    this.currentUserData.Progetto='';
//	}
	
	setCurrentUserData(val:string){
	  var currentUserData0=Object();
	  currentUserData0._id=JSON.parse(val)._id;
	  currentUserData0.Username=JSON.parse(val).Username;
	  currentUserData0.Nome=JSON.parse(val).Nome;
	  currentUserData0.Cognome=JSON.parse(val).Cognome;
	  //for(var i=0;i<JSON.parse(val).Gruppi_associati.length;i++){this.currentUser.Gruppi_associati.push(JSON.parse(val).Gruppi_associati[i]);};
	  currentUserData0.Progetto=JSON.parse(val).Progetto;
	  this.currentUserData.push(currentUserData0);
	  console.log(this.currentUserData);
	  }

	getCurrentUserData(){return this.currentUserData[0];}
	
	resetCurrentUserData(){
//	  Object.keys(this.currentUser).forEach(function(k){delete this.currentUser[k]})
	  this.currentUserData=[];
	}

}
