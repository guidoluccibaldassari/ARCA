//Natives
import { Component,OnInit,Input } from '@angular/core';
import { Router } from '@angular/router';
//Services
import { WorkareaService } from '../../_services/index';
import { EnvironmentService } from '../../_services/index';
//Models
import { SidebarLinksSettingsLocalStorage } from '../../_models/index';
import { SearchIndexedFieldLocalStorage } from '../../_models/index';
import { GlobalQueryArgument } from '../../_models/index';
//import {QueryResultsDetailsStorage} from '../../_models/index';
import { QueryResultsDetailsSerialized } from '../../_models/index';
import { QueryResultsDetailsId } from '../../_models/index';
//Components
import { WorkareaIntranetComponent } from '../index';

//Componenti
@Component({
  selector: 'subformComponent',
  template: `
<form #f="ngForm" (ngSubmit)="onSubSearchSubmit(this);" method="POST">
	<div *ngFor="let formvalue of searchindexedfieldlocalstorage; index as i">
		<p></p>
		<div title={{formvalue[1]}}>{{formvalue[0].replace("_"," ")}} : <input type="text" [(ngModel)]="globalsearchqueryarguments[i+1][1]" name="globalsearchqueryarguments[i+1][0]"></div>
	</div>
	<p></p>
	<p><button type="submit">Search</button></p>
</form>
`
})
export class SubformComponent implements OnInit {

  globalsearchtarget: String;
  globalresultslinesnumber: number;
  globalresultselementslinenumber: number;
  searchindexedfieldlocalstorage: SearchIndexedFieldLocalStorage;
  globalsearchqueryarguments: GlobalQueryArgument[];
  queryresultsdetailsserialized: QueryResultsDetailsSerialized[];
  queryresultsdetailsid: QueryResultsDetailsId[];

  @Input() localCNg: string;

  constructor(private workareaService: WorkareaService,private _router: Router,private _environmentService: EnvironmentService) { }

  ngOnInit() {
    this.loadSearchPageIF(this,this.localCNg);
  }

  loadSearchPageIF(parent: any,target: string) {
    //copio da sopra, del resto ho bisogno intanto di estrarre i campi query ed, almeno fino al db, è tutta roba che posso riutilizzare.
    //console.log(target);
    parent.globalresultslinesnumber=0;
    parent.globalresultselementslinenumber=0;
    parent.queryresultsdetailsserialized=[];
    parent.queryresultsdetailsid=[];
    parent.globalsearchtarget=target;
    var ap=[];
    ap.push('ExtractSearchFields');
    ap.push('Y');//la ricerca di default per soli campi indicizzati
    ap.push(target);
    //in pratica la subscribe si incarica di gestire l'oggetto response (ed eventualmente credo error) dell'oggetto a cui è agganciata la quale è un observable
    //su cui, quando arriva invoca la funzione
    //per portarla fuori occorre passare un oggetto(che è un riferimento) da fuori (i.e. this) a cui agganciarla...
    this.workareaService.getContentM(ap).subscribe(
      function(response) {
        var tmp_StringArray=[];
        var tmp_json=JSON.parse((<any>response)._body);
        //Ho riadattato il servizio perchè estragga anche la default collection
        //pare che una riga di un solo valore e tutte le altre di due, funzioni ugualmente... .
        parent.globalsearchqueryarguments=[];
        parent.globalsearchqueryarguments.push(["GlobalCollection",tmp_json[0]]);
        for(var i=1;i<tmp_json.length;i++) {
          tmp_StringArray.push(tmp_json[i]);
        }
        //console.log("1 :"+tmp_StringArray);
        for(var i=0;i<tmp_StringArray.length;i++) {
          //mi preparo la struttura per il binding della query fin dai risultati, anche se poi verrà bindata vuota...
          //poi l'altro lato del binding lo implemento in template.html
          parent.globalsearchqueryarguments.push([tmp_StringArray[i][0],""]);
        }
        parent.searchindexedfieldlocalstorage=tmp_StringArray;
        //console.log(parent.globalsearchqueryarguments);
      }
    );
  }

  get collezioneSelezionata() {
    return this._environmentService.getCollezioneSelezionata();
  }

  onSubSearchSubmit(parent: any) {
    console.log(parent);
    this._environmentService.setRicercaLocaleInviata(1);
    //passed arguments :P
    var ap=[];
    ap.push("GeoNodeId");
    for(var i=0;i<parent.globalsearchqueryarguments.length;i++) {
      ap.push(parent.globalsearchqueryarguments[i][0]);
      ap.push(parent.globalsearchqueryarguments[i][1]);
    }
    ap.push('Discende_Da');
    ap.push(parent._environmentService.idNodoGeografico);
    this._environmentService.setGlobalSearchQueryArgumentsEnv(ap);
    //console.log("component.ts :"+JSON.stringify(ap));
    this.workareaService.getListOfDocuments(ap).subscribe(
      function(response) {
        var tmp_GlobalArrayOfId=[];
        var tmp_GlobalArrayOfString=[];
        var tmp_json=JSON.parse((<any>response)._body);
        if(tmp_json==null) { return; }
        //num_righe
        //tmp_GlobalArrayOfString.push(tmp_json.length);
        parent.globalresultslinesnumber=tmp_json.length;
        //num_elem_per_riga
        //possibile che nel 2017 con uno strumento come Angular2 debba contare gli elementi di un oggetto in questo modo??????
        var num_elem_per_riga=0;
        for(let key in tmp_json[0]) {
          if(key!='_id') {
            num_elem_per_riga++;
          }
        }
        //tmp_GlobalArrayOfString.push(num_elem_per_riga);
        parent.globalresultselementslinenumber=num_elem_per_riga;
        parent._environmentService.setGlobalResultsElementsLineNumberEnv(parent.globalresultselementslinenumber);
        for(var i=0;i<tmp_json.length;i++) {
          //console.log(i);
          //qui dentro ho un oggetto, non un array, non ha senso trattarlo come tale
          //nemmeno il loop js standard sulle componenti dell'oggetto qui ha senso [grrrrrr!!!]
          //occorre ciclare in typescript...
          //id_di ciascuna riga, coppie chiavi valore
          //per ogni riga prima mi assicuro di estrarre l'id
          for(let key in tmp_json[i]) {
            let value=tmp_json[i][key];
            if(key=='_id') {
              tmp_GlobalArrayOfId.push(value);
            }
          }
          //poi le altre coppie chiave valore
          for(let key in tmp_json[i]) {
            let value=tmp_json[i][key];
            if(key!='_id') {
              tmp_GlobalArrayOfString.push(key);
              if(value==null) { tmp_GlobalArrayOfString.push("Indefinito") }
              else { tmp_GlobalArrayOfString.push(value) }
            }
            //tmp_GlobalArrayObj.push({tmp_ObjId,tmp_ObjArrayK,tmp_ObjArrayV});
          }
          //almeno gli array, anche se di oggetti si comportano come si deve.
          //ma tanto ad Angular2 non piacciono se non sono di stringhe per cui va tutto scomposto... .
          //console.log(tmp_ObjArrayK+" - "+tmp_ObjArrayV);
          //let qs = new QueryResultsDetailsStorage(tmp_ObjId,tmp_ObjArrayK,tmp_ObjArrayV);
          //nuovo corso - le parti precedenti le ho commentate perchè in fondo funzionavano (anche se non per qullo che serviva a me )per cui almeno come versionamento le conservo come promemoria.
          //l'impacchettamento funziona a dovere , in pratica mi sono assicurato che fossero ordinati...
          //ma non ha senso/utilizzo in un contesto di visualizzazione... per cui? devo davvero ricorrere ad una strutturazione dei contenuti che si appoggia
          //esclusivamente alla serializzazione e all'indicizzazione sequenziale? pare di si...
        }
        parent.queryresultsdetailsserialized=[];
        for(i=0;i<tmp_GlobalArrayOfString.length;i++) {
          parent.queryresultsdetailsserialized.push(tmp_GlobalArrayOfString[i]);
        }
        parent._environmentService.setQueryResultsDetailsSerializedEnv(parent.queryresultsdetailsserialized);
        parent.queryresultsdetailsid=tmp_GlobalArrayOfId;
        parent._environmentService.setQueryResultsDetailsIdEnv(parent.queryresultsdetailsid);
        parent._environmentService.setGlobalResultsElementsLineNumberIndexEnv(2);
        //console.log(parent.queryresultsdetailsserialized);
      }
    );
  }

}
