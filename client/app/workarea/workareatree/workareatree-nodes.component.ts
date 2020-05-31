import { Component,OnInit,Input } from '@angular/core';
import { Router } from '@angular/router';
import { WorkareaComponent } from '../index';
import { WorkareaService } from '../../_services/index';
import { EnvironmentService } from '../../_services/index';
import { DetailviewerService } from '../../_services/index'; //la import del servizio

//Pipes
import { UnderscoreToBlankSpacesPipe } from '../../_pipes/index';

//Componenti
@Component({
  inputs: ['item'],
  selector: 'nodes',
  template: `
<li>
	<a href="javascript:void(0);" (click)="openNGLink(this)">{{item.label | UnderscoreToBlankSpaces}}</a>
  	<ul *ngIf="item.subs" class="Sottomenu">
  	    <ng-template ngFor let-subitem [ngForOf]="item.subs">
  			<nodes [item]="subitem"></nodes>
  		</ng-template>
  	</ul>
</li>
`
})
export class Nodes implements OnInit {

  //variabili di immagazzinamento per i dettagli locali, verranno passate al template generale che contiene indicazione di subcomponent
  //il quale le popolerà dinamicamente attraverso data binding come quello realizzato in questo stesso componente
  //no, dovendo per ora gestirle nel component principale(ABOMINIO!!!) le imposto come ambiente. In questo modo faccio GET dall'altra parte e le passo al template che
  //può in questo modo passarle al subcomponent
  /*
  localRetKeys:String[];
  localRetValues:String[];
  cameraReadyRetKeys:String[];
  cameraReadyRetValues:String[];
  * */

  //variabile di INGRESSO per il data binding DA ALTRI ELEMENTI DI ALTRI COMPONENT!!!
  @Input() item: any;
  seq: number;

  constructor(private workareaService: WorkareaService,private detailviewerService: DetailviewerService,private _router: Router,private _environmentService: EnvironmentService) { }

  ngOnInit() {
    //ennesimo tentativo di forzare un reload
    //this.seq=this._environmentService.sequence;
  }

  openNGLink(parent: any) {
    parent._environmentService.setRicercaInviata(0);
    parent._environmentService.setRicercaLocaleInviata(0);
    parent._environmentService.setFormNodiGeografici(0);
    parent._environmentService.setCollezioniNGReady(0);
    parent._environmentService.setRicercaGlobalePerCollezioni(0);
    parent._environmentService.setRicercaPerNodiGeografici(1);
    parent._environmentService.setVistaIniziale(0);
    parent._environmentService.setRicercaInviata(0);
    parent._environmentService.setNomeNodoGeografico(parent.item.label);
    parent._environmentService.setIdNodoGeografico(parent.item.details._id);
    parent._environmentService.setLinksFormNodiGeografici(1);
    //Se ho cliccato qui mi interessano i dettagli del nodo geografico, per cui la collezione sarà sempre e solo geographicNodes
    //Il nodo però è sempre di tipo geografico, per cui posso fare la query direttamente verso il servizio dei dettagli con lo scopo di estrarre informazioni!
    //estraggo i dettagli del nodo geografico:
    var ap=[];
    ap.push('geographicNodes');
    //console.log(this.item.details);
    ap.push(parent.item.details._id);
    parent.detailviewerService.getDetailsFromOID(ap).subscribe(
      function(response: any) {
        var tmp_json=((<any>response)._body);
        if(tmp_json==null) { return; }
        var processed_json=JSON.parse(tmp_json);
        for(var i=0;i<processed_json.length;i++) {
          var tmp_ObjArrayK=[];
          var tmp_ObjArrayV=[];
          var tmp_ObjArrayK_cr=[];
          var tmp_ObjArrayV_cr=[];
          for(let key in processed_json[i]) {
            let value=processed_json[i][key];
            tmp_ObjArrayK.push(JSON.stringify(key));
            tmp_ObjArrayV.push(JSON.stringify(value));
            if(key=="_id") { continue; }
            if(key=="Accesso") { continue; }
            if(key=="Logical_Delete") { continue; }
            /*if (value == null) {
              tmp_ObjArrayK_cr.push(JSON.stringify(key));
              tmp_ObjArrayV_cr.push("Nessuna informazione da visualizzare.");
              continue;
            }*/
            if((value==null)||(value==='')) { continue; }
            tmp_ObjArrayK_cr.push(JSON.stringify(key));
            tmp_ObjArrayV_cr.push(JSON.stringify(value));
          }
        }
        parent._environmentService.setCameraReadyRetKeysDetNG(tmp_ObjArrayK_cr);
        parent._environmentService.setCameraReadyRetValuesDetNG(tmp_ObjArrayV_cr);
      }
    );
    //a questo punto la query verso i settings:
    //devo recuperare le collezioni per cui il nodo geografico è abilitato e su cui voglio offrire la ricerca
    var ap=[];
    ap.push('ExtractNGCollections');
    //console.log(this.item.details);
    ap.push('Nome_Tipologia_Nodo');
    ap.push(this.item.details.Nome_Tipologia_Nodo);//la ricerca lato server sarà quella "di default" per soli campi indicizzati
    parent.workareaService.getContentM(ap).subscribe(
      function(response: any) {
        var tmp_StringArray=[];
        var tmp_json=JSON.parse((<any>response)._body);
        //console.log(JSON.stringify(tmp_json));
        parent._environmentService.setCollezioniNG(tmp_json);
        parent._environmentService.setCollezioniNGReady(1);
      }
    );
    //Riflessione
    /*Quando farò la ricerca, dovrò passarmi l'id del nodo appena cliccato per verificare la discendenza
     *Voglio davvero ricorrere a quell'abominio del passaggio di valore per ambiente(vedi sopra)?*/
  }
}
