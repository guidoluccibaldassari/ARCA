//LEGACY COMPONENT NOT USED ANYMORE - TO BE REMOVED!


//Nativi
import { Component,OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute,Params,Router } from '@angular/router';

//3dParty
//import {PdfViewerComponent} from 'ng2-pdf-viewer';

//X3Dom
//import * from 'x3dom';

//Servizi
import { DetailviewerService } from '../_services/index';
import { ModaldocumentviewerService } from '../_services/index';
import { EnvironmentService } from '../_services/index'; //la import del servizio

//Modelli
import { HyperlinkEnabledFields } from '../_models/index_e'; //creo un indice di modelli a parte per quelli in comune con l'env service

//Pipes
import { UnderscoreToBlankSpacesPipe } from '../_pipes/index';

//Direttive

//Other libs without typings
declare var System: any;

//Componente
@Component({
  moduleId: module.id,
  templateUrl: 'detailviewerIntranet.component.html'
})

//OnInit generale fa roba
export class DetailviewerIntranetComponent implements OnInit {

  localRetRows: any[];
  childrenCollections: String[];
  childrenList: any[];
  parentsCollections: String[];
  parentsList: any[];
  hyperlinkenabledfields: HyperlinkEnabledFields;
  globalParams: String[];

  constructor
  (
    private detailviewerService: DetailviewerService
   ,private router: Router
   ,private route: ActivatedRoute
   ,private modaldvService: ModaldocumentviewerService
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

  importX3d(): void {
    System.import('x3dom').then(() => {
      console.log('loaded x3d');
    }).catch((e: any) => {
      console.warn(e);
    })
  }

  ngOnInit() {
    this.localRetRows=[];
    this.childrenCollections=[];
    this.childrenList=[];
    this.parentsCollections=[];
    this.parentsList=[];
    this.hyperlinkenabledfields=this._environmentService.getHyperlinkEnabledFields();
  }

  retriveDetails(parent: any,ap: any) {
    parent._environmentService.setDetailLocalCollection(ap[0]);
    this.detailviewerService.getDetailsFromOID(ap).subscribe(
      function(response) {
        var tmp_json=((<any>response)._body);
        if(tmp_json==null) { return; }
        var processed_json=JSON.parse(tmp_json);
        for(var i=0;i<processed_json.length;i++) {
          var tmp_RowsArray=[];
          for(let key in processed_json[i]) {
            var tmp_Row = {
              key:"",
              type:4,
              values:[""],
              links:[{}]
            };
            tmp_Row.key=key;
            let value=processed_json[i][key];
            if((key=='_id')||(key=='Discende_Da')) {
              //puri
              tmp_Row.type=4;
              tmp_Row.values=value;
              tmp_Row.links=[];
            }
            else if((value==null)||(value===' ')||(value==='')) { continue; }
            else if(key=='Path') {
              //path
              tmp_Row.type=4;
              tmp_Row.values=value;
              tmp_Row.links=[];
              if(((value.substr(value.length-5).split('.').pop())=='X3D')||((value.substr(value.length-5).split('.').pop())=='x3d')) {
                parent.importX3d();
                if(window['x3dom']!=undefined) {
                  window['x3dom'].reload();
                  console.log('loaded x3d');
                }
              }
            }
            else if(typeof(value)==='object'){
              //link
              if(value[3]=='hyperlinkReady'){
                var arr_link=[];
                tmp_Row.values=value[2];
                arr_link.push(value[0]);
                arr_link.push(value[1]);
                tmp_Row.links=arr_link;
                tmp_Row.type=1;
              }
              //misto e/o di stringhe semplici
              else {
                var arr_mixV=[];
                var arr_mixL=[];
                tmp_Row.type=2;
                for(var j=0;j<value.length;j++){
                  if(typeof(value[j])==='string'){
                    arr_mixV.push(value[j]);
                    arr_mixL.push('string');
                  }
                  else {
                    //?
                    var arr_link=[];
                    arr_mixV.push(value[j][2]);
                    arr_link.push(value[j][0]);
                    arr_link.push(value[j][1]);
                    arr_mixL.push(arr_link);
                  }
                tmp_Row.values=arr_mixV;
                tmp_Row.links=arr_mixL;
                }
              }
            }
            //valore semplice:stringa
            else if(typeof(value)==='string'){
              tmp_Row.type=0;
              tmp_Row.values[0]=value;
              tmp_Row.links=['string'];
            }
            else if(typeof(value)==='number'){
              tmp_Row.type=4;
              tmp_Row.values[0]=''+value;
              tmp_Row.links=['number'];
            }
            tmp_RowsArray.push(tmp_Row);
          }
          /*
          for (var k=0;k<tmp_RowsArray.length;k++){
            console.log(tmp_RowsArray[k]);
          }
          */
        }
        parent.localRetRows=tmp_RowsArray;
        //Fine fase reperimento dettagli
//--------------------------------------------------------------------------------------------------
        //Ottenuti i dettagli da qui lancio la query per i figli
        //N.B. Non è garantita la sequenzialità mi sa prendendo i parametri dal ritorno o  forse si dato che comunque siamo dentro alla prima subscribe---------------------------------------------------------------------------------------------
//        parent.route.params.subscribe(
//          (params: any) => {
        var ap_c=[];
        ap_c.push(parent.globalParams[0]);
//        ap_c.push(parent.globalParams[1]);
        for(var j=0;j<parent.localRetRows.length;j++) {
          if(parent.localRetRows[j].key=='Errore') {
            return;
          }
        }
        for(var j=0;j<parent.localRetRows.length;j++) {
          if(parent.localRetRows[j].key=='_id') {
            var value=parent.localRetRows[j].values;
            ap_c.push(value);
          }
        }
        ap_c.push('queryDbForChildren');
        parent.retriveChildrenData(parent,ap_c);
//          }
//        );
//--------------------------------------------------------------------------------------------------
        //Da qui invece lancio la query per il genitore
//GROSSO PROBLEMA CON CHIAMATE IN SUCCESSIONE IN SU E I GIU - Soluzione: Flatmap con la prima subscribe?
//SOLUZIONE: estrarre i parametri in ingresso via URL una volta sola all'inizio e salvarli nell'env all'arrivo sulla pagina e minimizzare le subscribe (parent.route.params.subscribe serve a leggere i parametri in url)
//        parent.route.params.subscribe(
//          (params: any) => {
        var ap_p=[];
        ap_p.push(parent.globalParams[0]);
        for(var j=0;j<parent.localRetRows.length;j++) {
          if(parent.localRetRows[j].key=='Discende_Da') {
            var value=parent.localRetRows[j].values;
            ap_p.push(value);
          }
        }
        ap_p.push('queryDbForParentInfo');
        if(ap_p[1]=='root') {
          parent.parentsCollections=[];
          parent.parentsList=[];
          return;
        }
        parent.retriveParentData(parent,ap_p);
//          }
//        );
      }
    );
  }

  /*  
  Al momento del mio arrivo su una pagina di dettaglio io oltre ad estrarre i dettagli veri e propri, ho il mio id che uso per cercare lungo il db tutti i miei discendenti, e mi immagazzino:
  -collezione
  -nome
  -id
  id lo uso per impostare nuova navigazione.
  */

  retriveChildrenData(parent: any,ap: any) {
    this.detailviewerService.getAllChildrenDataFromAllCollUsingOID(ap).subscribe(
      function(response) {
        var tmp_json=((<any>response)._body);
        if(tmp_json==null) { return; }
        var vettore_collezioni=[];
        var vettore_di_vettori_di_oggetti=[];
        var processed_json=JSON.parse(tmp_json);
        for(var i=0;i<processed_json.length;i++) {
          if(typeof (processed_json[i]['Collection'])!=='undefined') { vettore_collezioni.push(processed_json[i]['Collection']) }
          else if(processed_json[i].length!==0) { vettore_di_vettori_di_oggetti.push(processed_json[i]); }
        }
        parent.childrenCollections=vettore_collezioni;
        parent.childrenList=vettore_di_vettori_di_oggetti;
      }
    );
  }

  retriveParentData(parent: any,ap: any) {
    this.detailviewerService.getParentDataUsingOID(ap).subscribe(
      function(response) {
        var tmp_json_p;
        tmp_json_p=((<any>response)._body);
        if(tmp_json_p==null) { return; }
        var vettore_collezioni=[];
        var vettore_di_vettori_di_oggetti=[];
        var processed_json_p;
        processed_json_p=JSON.parse(tmp_json_p);
        for(var i=0;i<processed_json_p.length;i++) {
          if(typeof (processed_json_p[i]['Collection'])!=='undefined') { vettore_collezioni.push(processed_json_p[i]['Collection']) }
          else if(processed_json_p[i].length!==0) { vettore_di_vettori_di_oggetti.push(processed_json_p[i]); }
        }
        parent.parentsCollections=vettore_collezioni;
        parent.parentsList=vettore_di_vettori_di_oggetti;
      }
    );
  }

  openDetailsPage(coll: String,id: String) {
    var ap=[];
    ap.push(coll);
    ap.push(id);
    //console.log(ap);
    this.router.navigate(['/detailviewerIntranet',ap]);
  }

  openModalDocument() {
    this.openModal('documentViewer');
  }

  openModal(id: string) {
    this.modaldvService.open(id);
  }

  closeModal(id: string) {
    this.modaldvService.close(id);
  }

}
