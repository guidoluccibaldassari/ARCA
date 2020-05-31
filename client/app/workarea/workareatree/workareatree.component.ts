//JQ
//declare var $:JQueryStatic;
import * as $ from 'jquery';
//declare var $:any;
//declare var jQuery:any;

//Bootstrap
import 'bootstrap';

//Other CustomLibs without typings
declare var init_page: any;

//Nativi
import { Component,OnInit,Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

//Modelli
import { WorkareaComponent } from '../index';

//Servizi
import { WorkareaService } from '../../_services/index'; //la import del servizio

//nel template invoco un subtemplate di nome tree, con il div <tree>
// che conterrà tree_html, che binderò a tree_html con le []
//non so chi dei due sia la sorgente e chi la destinazione
@Component({
  inputs: ['tree_html'],
  selector: 'workareatreeComponent',
  template: `<tree [tree_html]="tree_html"></tree>`
})

export class WorkareatreeComponent implements OnInit {

  tree_details_array: any[];
  tree_html_info_array: any[];
  tree_hierarchy_array: any[];
  tree_data: any[];
  @Input() tree_html: any[]=this.tree_data;

  constructor(private workareaService: WorkareaService,private _router: Router) {
  }

  ngOnInit() {
    this.tree_data=[]; //se non lo inizializzo non vado da nessuna parte.
    this.getSideBarLinksNG(this);
  }

  //  ngAfterViewInit(){
  //	$(document).ready(function(){
  //	  //alert('Ready!');
  //	  //console.log('Ready!');
  //	  if (typeof($.fn.popover) != 'undefined') {/*alert('Bootstrap ready!'); */init_page();}
  //	});
  //  }

  recursiveHierarchyBuilder(array_in: any[],array_out: any[],array_html_inf: any[],array_hier_inf: any[],id: any) {
    for(var k=0;k<array_in.length;k++) {
      if(array_in[k].Discende_Da==id) {
        //se efettuando una ricerca sull'array globale, scopro che l'id in ingresso è progenitore di qualcuno allora gli metto il figlio, ordinatamente a fianco 
        //attraverso una push.
        array_out.push(array_in[k]);
        //a questo punto mi tocca pure di ricercare la posizione del padre nell'array finale, per settare nella medesima posizione nell'array accessorio l'informazione
        //del fatto che il padre è padre, per cui:
        for(var l=0;l<array_out.length;l++) {
          if(array_out[l]._id==id) { array_html_inf[l]=1; }
        }
        //a questo punto il calcolo della profondita
        for(var l=0;l<array_out.length;l++) {
          //qui dentro posso ricostruire una profondità dell'albero calcolando quella del figlo a partire da quella del padre
          if(array_out[l]._id==id) {
            array_hier_inf[array_out.length-1]=array_hier_inf[l]+1;
          }
        }
        this.recursiveHierarchyBuilder(array_in,array_out,array_html_inf,array_hier_inf,array_in[k]._id);
      }
    }
  };

  treeBuilder(TDA: any[],TIA: any[],THA: any[],IO: any[]) {
    var arrayOfText=[];
    var localOut=[];
    var localTDA=[];
    var localTIA=[];
    var localTHA=[];
    localTDA=TDA;
    localTIA=TIA;
    localTHA=THA;
    var bufferTxt='';
    for(var i=0;i<localTDA.length;i++) {
      //console.log(localTDA[i]);
      //console.log(localTIA[i]);
      //console.log(localTHA[i]);
      //se oggetto liv 0 e no figli
      if((localTIA[i]==0)&&(localTHA[i]==0)&&(bufferTxt==='')) {
        //posso aprirlo, riempirlo, chiuderlo
        bufferTxt='{label:"'+localTDA[i].Nome_Nodo+'",details:'+JSON.stringify(localTDA[i])+'}';
        //stabilisco che al termine del ciclo questo oggetto verrà scritto e il buffer svuotato
        arrayOfText.push(bufferTxt);
        bufferTxt='';
        //caso a se stante
        continue;
      }
      //se livello è minore del precedente allora per forza almeno un sub si è chiuso
      if(i>0) {
        if(localTHA[i]<localTHA[i-1]) {
          var loop=localTHA[i-1]-localTHA[i];
          //se è più di uno devo chiuderli tutti
          //devo anche discriminare liv 0 vs altri perchè gli intermedi hanno le ]
          //mentre i 0 hanno le } solamente
          //per cui
          /*
          if (localTHA[i]==0){loop=loop-1;}
          for (var j=0; j<loop; j++){
            bufferTxt=bufferTxt+"}]";
          }
          if (localTHA[i]==0){bufferTxt=bufferTxt+"}"}*/
          //Si ma la chiusura del livello corrente non credo venga conteggiata, commentiamo sopra e proviamo così
          for(var j=0;j<loop;j++) {
            bufferTxt=bufferTxt+']}';
          }
        }
      }
      //Il push avviene quando la gerarchia locale è 0, il buffer è pieno e non siamo alla prima iterazione
      if((localTHA[i]==0)&&(bufferTxt!='')) {
        //chiudo l'ultima parentesi
        //bufferTxt=bufferTxt+"}"
        arrayOfText.push(bufferTxt);
        bufferTxt='';
      }
      //il problema è che dovrei contare solo quelle relative al costrutto locale
      var check=0;
      for(var j=i;j>=0;j--) {
        if(localTHA[j]<localTHA[i]) {//vuol dire che indietro ho trovato un nodo gerarchicamente inferiore
          //ora devo capire se il primo nodo che ho trovato indietro gerarchicamente superiore contiene oltre a quello attuale altri fratelli...
          for(var t=j;t<i;t++) {
            if(localTHA[t]==localTHA[i]) {
              if(check==0) {
                if(bufferTxt[bufferTxt.length-1]!='[') {
                  bufferTxt=bufferTxt+',';
                }
                check=1;
              }
            }
          }
        }
      }
      //se oggetto corrente è padre
      if(localTIA[i]=="1") {
        bufferTxt=bufferTxt+'{"label":"'+localTDA[i].Nome_Nodo+'","details":'+JSON.stringify(localTDA[i])+',"subs":[';
        //bufferTxt=bufferTxt+'{"lable":"'+localTDA[i].Nome_Nodo+'","subs":[';
      }
      else {
        bufferTxt=bufferTxt+'{"label":"'+localTDA[i].Nome_Nodo+'","details":'+JSON.stringify(localTDA[i])+'}';
        //bufferTxt=bufferTxt+'{"lable":"'+localTDA[i].Nome_Nodo+'"}';
      }
      //console.log("END CYCLE - bufferTxt:"+bufferTxt);
    }
    //in questo punto ho un array di testi ben formati; devo trasformarli in elementi di array.
    for(var i=0;i<arrayOfText.length;i++) {
        var obj=JSON.parse(arrayOfText[i]);
      //var obj=JSON.parse(JSON.stringify(arrayOfText[i]));
      //var obj=arrayOfText[i];
      localOut.push(obj);
      IO.push(obj);
    }
    return localOut;
  }

  getSideBarLinksNG(parent: any) {
    this.workareaService.getContentNG('SideBarLinksNG').subscribe(
      function(response) {
        //var tmp_json=JSON.parse((<any>response)._body);
        var tmp_json=(<any>response)._body;
        //console.log(tmp_json);
        var tmp_json=JSON.parse(tmp_json);
//        console.log(tmp_json);
//        for (var i=0; i<tmp_json.length; i++){
//          console.log(tmp_json[i]);
//        }
        var tmp_outArray=[];
        var tmp_htmlInfo=[tmp_json.length];
        var tmp_hierInfo=[tmp_json.length];
        for(var i=0;i<tmp_json.length;i++) {
          tmp_htmlInfo[i]=0;
          tmp_hierInfo[i]=0;
        }
        /*non c'è nulla da fare: per ordinarli in modo oltretutto complesso (non basta un ordinamento di tipo ascendente o discendente ma occorre applicare una logica specifica
         * ) devo per forza scorrerli tutti, uno a uno e metterli di volta in volta in un nuovo vettore
         * algoritmo: prendo tutti i root e li ordino per? un'idea sensata sarebbe nome - ordine alfabetico... come faccio in js? aiuto. lo faccio 
         * */
        //li ordiniamo fin d'ora tutti in ordine alfabetico? ottima idea, così non serve ripetere il processo per ogni sottoinsieme, l'ordinamento sarà preservato. 
        //Forse sarebbe stato più furbo un order by nella query? Infatti! Non impazziamo con algoritmi di sorting, quando abbiamo chi ci prepara i dati senza troppo effort da parte nostra.
        //Perfetto! Ora la query ritorna una insieme di oggetti ordinati per ordine alfabetico.
        //Ora devo ordinarli per "parentela.
        // Ciclo sui risultati
        for(var i=0;i<tmp_json.length;i++) {
          var _id;
          var already_in=0;
          //se nodo radice
          if(tmp_json[i].Discende_Da=="root") {//in questo modo forzo almeno la prima ricerca per root
            //testo non sia già presente in tmp_outArray ciclandoci sopra
            for(var j=0;j<tmp_outArray.length;j++) {
              //se nel ciclo lo trovo setto il jump
              if(tmp_json[i]._id==tmp_outArray[j]._id) { already_in=1; }
            }
            //in questo punto il jump è 0 o 1 a seconda;
            //in questo modo posso interrompere il ciclo giusto cioè quello per i esterno in cui ciclo sui root
            if(already_in==1) { continue; }
            // se sono qui non c'è già dentro per cui effettuo il push
            tmp_outArray.push(tmp_json[i]);
            tmp_hierInfo[tmp_outArray.length]=0;
            //e mi memorizzo l'id del padre
            _id=tmp_json[i]._id;
            //a questo punto ho isolato il nuovo nodo root dai risultati
          }
          //fino a qui e nel punto sotto originale, in pratica ho isolato i nodi root ed i loro figli di primo livello.
          //ma come me la cavo per quelli di secondo (e più) livello?
          //ho bisogno di una chiamata ricorsiva
          //sposto tutto in una chiamata ricorsiva?
          parent.recursiveHierarchyBuilder(tmp_json,tmp_outArray,tmp_htmlInfo,tmp_hierInfo,_id);
        }
        parent.tree_details_array=tmp_outArray;
        parent.tree_html_info_array=tmp_htmlInfo;
        parent.tree_hierarchy_array=tmp_hierInfo;
        //ci siamo, l'ordinamento parrebbe funzionare.
        //gli affianco un array di controllo per stabilire se è un nodo figlio o un nodo padre a livello di html... .
        parent.tree_html=parent.treeBuilder(parent.tree_details_array,parent.tree_html_info_array,parent.tree_hierarchy_array,parent.tree_data);
//        console.log(parent.tree_html);
//        console.log(parent.tree_details_array);
//        console.log(parent.tree_html_info_array);
//        console.log(parent.tree_hierarchy_array);
      });
  }
}
