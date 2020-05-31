//JQ
import * as $ from 'jquery';

//Bootstrap
import 'bootstrap';

//Other CustomLibs without typeings
declare var init_page: any;

//Nativi
import { Component,OnInit,Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

//Servizi
import { AuthenticationService } from '../_services/index'; //la import del servizio
import { ModalService } from '../_services/index';
import { WorkareaService } from '../_services/index'; //la import del servizio
import { EnvironmentService } from '../_services/index'; //la import del servizio

//Modelli
import { SidebarLinksSettingsLocalStorage } from '../_models/index';
import { SearchIndexedFieldLocalStorage } from '../_models/index';
import { GlobalQueryArgument } from '../_models/index';
import { QueryResultsDetailsSerialized } from '../_models/index';
import { QueryResultsDetailsId } from '../_models/index';
import { HyperlinkEnabledFields } from '../_models/index_e'; //creo un indice di modelli a parte per quelli in comune con l'env service
import { User } from '../_models/index';

//Pipes
import { UnderscoreToBlankSpacesPipe } from '../_pipes/index';

//Componente principale
@Component({
  moduleId: module.id,
  templateUrl: 'workareaIntranet.component.html'
})

//OnInit generale fa roba
export class WorkareaIntranetComponent implements OnInit {
  globalsearchtarget: String;
  globalresultslinesnumber: number;
  globalresultselementslinenumber: number;
  sidebarlinkssettingslocalstorage: SidebarLinksSettingsLocalStorage;
  searchindexedfieldlocalstorage: SearchIndexedFieldLocalStorage;
  globalsearchqueryarguments: GlobalQueryArgument[];
  queryresultsdetailsserialized: QueryResultsDetailsSerialized[];
  queryresultsdetailsid: QueryResultsDetailsId[];
  hyperlinkenabledfields: HyperlinkEnabledFields;
  currentUser:User;

  //Devo istanziare il lato service di angular con cui poter instaurare la comunicazione (se lo istanzia al suo interno la component)
  constructor(
    private _authenticationService: AuthenticationService
   ,private _environmentService: EnvironmentService
   ,private modalService: ModalService
   ,private _router: Router
   ,private workareaService: WorkareaService
   ) {
    //il costruttore al momento dell'invocazione pu� anche fare cose!!!
    console.log("Init Done!");
  }

  //on init di angular fa altre robe.
  ngOnInit() {
    this.getSideBarLinks(this);
    this._environmentService.setRicercaGlobalePerCollezioni(0);
    this._environmentService.setRicercaPerNodiGeografici(0);
    this._environmentService.setVistaIniziale(1);
    this._environmentService.setRicercaInviata(0);
    this._environmentService.setRicercaLocaleInviata(0);
    this.currentUser = this._environmentService.getCurrentUserData();
    this.getHyperlinkEnabledFieldsFromQuery(this);
  }

  ngAfterViewInit() {
    $(document).ready(function() {
      if(typeof ($.fn.popover)!='undefined') {/*alert('Bootstrap ready!'); */init_page(); }
    });
  }

  //qui dentro non è definita nessuna getSideBarLinks
  
  getSideBarLinks(parent: any) {
    this.workareaService.getContent('SideBarLinks').subscribe(
      function(response) {
        var tmp_StringArray=[];
        var tmp_json=JSON.parse((<any>response)._body);
        for(var i=0;i<tmp_json.length;i++) {
          tmp_StringArray.push(tmp_json[i].Titolo_Nodo);
        }
        parent.sidebarlinkssettingslocalstorage=tmp_StringArray;
      });
  }

  getHyperlinkEnabledFieldsFromQuery(parent: any) {
    this.workareaService.getContent('ExtractHyperlinkEnabledFields').subscribe(
      function(response) {
        var tmp_StringArray=[];
        var tmp_json=JSON.parse((<any>response)._body);
        //console.log(JSON.stringify(tmp_json));
        for(var i=0;i<tmp_json.length;i++) {
          //console.log(tmp_json[i]);
          tmp_StringArray.push(tmp_json[i]);
        }
        parent.hyperlinkenabledfields=tmp_StringArray;
        parent._environmentService.setHyperlinkEnabledFields(parent.hyperlinkenabledfields);
        //console.log(parent._environmentService.getHyperlinkEnabledFields());//?
        //parent._environmentService.setHyperlinkEnabledFields(tmp_StringArray);
        //qui abbiamo già settato gli array contenenti le info di applicazione che ci servono per gestire i link dinamici (per ora solo orizzontali)
      }
    );
    //console.log(this.hyperlinkenabledfields);
    //this._environmentService.setHyperlinkEnabledFields(parent.hyperlinkenabledfields);//?
    //console.log(this._environmentService.getHyperlinkEnabledFields());//?
    //mi confondo sempre con la consecutio temporum in js - la console qui fuori ritorna sempre undefined perchè conclude prima della subscribe!!!
    //sostanzialmente prima faceva la stampa della get e poi ritornava il risultato e faceva la set.
  }

  //la funzione per richiedere al db in campi indicizzati load search page indexed field
  loadSearchPageIF(parent: any,target: string) {
    this._environmentService.setRicercaGlobalePerCollezioni(1);
    this._environmentService.setRicercaPerNodiGeografici(0);
    this._environmentService.setVistaIniziale(0);
    this._environmentService.setRicercaInviata(0);
    this._environmentService.setRicercaLocaleInviata(0);
    parent.globalresultslinesnumber=0;
    parent.globalresultselementslinenumber=0;
    parent.queryresultsdetailsserialized=[];
    parent.queryresultsdetailsid=[];
    parent.globalsearchtarget=target;
    var ap=[];
    ap.push('ExtractSearchFields');
    ap.push('Y');//la ricerca di default per soli campi indicizzati
    ap.push(target);
    this.workareaService.getContentM(ap).subscribe(
      function(response) {
        var tmp_StringArray=[];
        var tmp_json=JSON.parse((<any>response)._body);
        parent.globalsearchqueryarguments=[];
        parent.globalsearchqueryarguments.push(["GlobalCollection",tmp_json[0]]);
        for(var i=1;i<tmp_json.length;i++) {
          tmp_StringArray.push(tmp_json[i]);
        }
        for(var i=0;i<tmp_StringArray.length;i++) {
          parent.globalsearchqueryarguments.push([tmp_StringArray[i][0],""]);
        }
        parent.searchindexedfieldlocalstorage=tmp_StringArray;
      }
    );
  }

  onSearchSubmit(parent: any) {
    this._environmentService.setRicercaInviata(1);
    var ap=[];
    for(var i=0;i<parent.globalsearchqueryarguments.length;i++) {
      ap.push(parent.globalsearchqueryarguments[i][0]);
      ap.push(parent.globalsearchqueryarguments[i][1]);
    }
    this._environmentService.setGlobalSearchQueryArgumentsEnv(ap);
    this.workareaService.getListOfDocuments(ap).subscribe(
      function(response) {
        var tmp_GlobalArrayOfId=[];
        var tmp_GlobalArrayOfString=[];
        var tmp_json=JSON.parse((<any>response)._body);
        if(tmp_json==null) { return; }
        parent.globalresultslinesnumber=tmp_json.length;
        var num_elem_per_riga=0;
        for(let key in tmp_json[0]) {
          if(key!='_id') {
            num_elem_per_riga++;
          }
        }
        parent.globalresultselementslinenumber=num_elem_per_riga;
        parent._environmentService.setGlobalResultsElementsLineNumberEnv(parent.globalresultselementslinenumber);
        for(var i=0;i<tmp_json.length;i++) {
          for(let key in tmp_json[i]) {
            let value=tmp_json[i][key];
            if(key=='_id') {
              tmp_GlobalArrayOfId.push(value);
            }
          }
          for(let key in tmp_json[i]) {
            let value=tmp_json[i][key];
            if(key!='_id') {
              tmp_GlobalArrayOfString.push(key);
              if(value==null) { tmp_GlobalArrayOfString.push("Indefinito"); }
              else { tmp_GlobalArrayOfString.push(value); }
            }
          }
        }
        parent.queryresultsdetailsserialized=tmp_GlobalArrayOfString;
        parent.queryresultsdetailsid=tmp_GlobalArrayOfId;
        parent._environmentService.setQueryResultsDetailsIdEnv(parent.queryresultsdetailsid);
        parent._environmentService.setGlobalResultsElementsLineNumberIndexEnv(1);
      }
    );
  }

  openDetailsPage(parent: any,indice: number) {
    var tmpArray=[];
    for(var i=0;i<parent._environmentService.getGlobalSearchQueryArgumentsEnv().length;i++) {
      tmpArray.push(parent._environmentService.getGlobalSearchQueryArgumentsEnv()[i]);
    }
    var tmpNumero=parent._environmentService.getGlobalResultsElementsLineNumberEnv();
    var tmpArray2=[];
    for(var i=0;i<parent._environmentService.getQueryResultsDetailsIdEnv().length;i++) {
      tmpArray2.push(parent._environmentService.getQueryResultsDetailsIdEnv()[i]);
    }
    //    console.log(tmpArray);
    //    console.log(tmpNumero);
    //    console.log(tmpArray2);
    var ap=[];
    ap.push(tmpArray[parent._environmentService.getGlobalResultsElementsLineNumberIndexEnv()]);
    ap.push(JSON.stringify(tmpArray2[Math.floor(indice/(tmpNumero*2))]));
    this._router.navigate(['/redirectdvIntranet',ap]);
  }
  
  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }

  get ricercaGlobalePerCollezioni() {
    return this._environmentService.getRicercaGlobalePerCollezioni();
  }

  get ricercaPerNodiGeografici() {
    return this._environmentService.getRicercaPerNodiGeografici();
  }

  get vistaIniziale() {
    return this._environmentService.getVistaIniziale();
  }

  get ricercaInviata() {
    return this._environmentService.getRicercaInviata();
  }

  get ricercaLocaleInviata() {
    return this._environmentService.getRicercaLocaleInviata();
  }

  get nomeNodoGeografico() {
    return this._environmentService.getNomeNodoGeografico();
  }

  get collezioniNG() {
    return this._environmentService.getCollezioniNGEnabled();
  }

  get cameraReadyRetKeysDetNG() {
    return this._environmentService.getCameraReadyRetKeysDetNG();
  }

  get cameraReadyRetValuesDetNG() {
    return this._environmentService.getCameraReadyRetValuesDetNG()
  }

  get collezioneSelezionata() {
    return this._environmentService.getCollezioneSelezionata();
  }

  get formNodiGeografici() {
    return this._environmentService.getFormNodiGeografici();
  }

  get linksFormNodiGeografici() {
    return this._environmentService.getLinksFormNodiGeografici();
  }

  subFormUpdate(parent: any,arg: string) {
    parent._environmentService.setCollezioneSelezionata(arg);
    parent._environmentService.setFormNodiGeografici(1);
    parent._environmentService.setLinksFormNodiGeografici(0);
  }

  get queryResultsDetailsSerializedEnv() {
    return this._environmentService.getQueryResultsDetailsSerializedEnv();
  }

  get globalResultsElementsLineNumberEnv() {
    return this._environmentService.getGlobalResultsElementsLineNumberEnv();
  }
  
  get currentUserData() {
    return this._environmentService.getCurrentUserData();
  }

}
