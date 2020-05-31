import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate{
  constructor(private router: Router){}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
//    console.log(route);
//    console.log(state);
//    console.log(state.url);
    var lscuStr=null;
    if(localStorage.getItem('currentUser'))lscuStr=localStorage.getItem('currentUser');
    //se vengo da un click su database
    if(state.url==='/database'){
      if(lscuStr){
        //autenticato: devo andare nell'intranet
        this.router.navigate(['/workareaIntranet']);
        // logged in so return true
        return true;
      }
      //non autenticato -> workarea standard
      else this.router.navigate(['/workarea']);
      return false;
    }

    else if(state.url.startsWith('/redirectdvIntranet')){//richiesta diretta per la pagina intermedia di ridirezione: avverrà ad ogni click su dettaglio
      if(lscuStr){
        //autenticato: devo andare nell'intranet
        //logged in so return true
        return true;
      }
      //non autenticato -> detailviewer standard o login? (Probabilmente) ho tentato accesso diretto per cui login
      else this.router.navigate(['/login']);
      return false;
    }

    else if(state.url==='/workareaIntranet'){//richiesta diretta per l'intranet
      if(lscuStr){
        //autenticato: devo andare nell'intranet
        //logged in so return true
        return true;
      }
      //non autenticato -> workarea standard o login? Ho tentato accesso diretto per cui login
      else this.router.navigate(['/login']);
      return false;
    }

    else if(state.url.startsWith('/detailviewerIntranet')){//richiesta diretta per l'intranet
      if(lscuStr){
        //autenticato: devo andare nell'intranet
        //logged in so return true
        return true;
      }
      //non autenticato -> detailviewer standard o login? (Probabilmente) ho tentato accesso diretto per cui login
      else this.router.navigate(['/login']);
      return false;
    }

    else {
      //Qualsiasi altro percorso -> home
      this.router.navigate(['/'], { queryParams: { returnUrl: state.url }});
      return false;
    }
  }
}