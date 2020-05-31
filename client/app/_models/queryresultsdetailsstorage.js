"use strict";
//ngFor NON PUO' ciclare su oggetti
/*
export class QueryResultsDetailsStorage {
    storedid: Array <number>;
    storedvalue: Array <any>;
    constructor(si: Array <number>, sv: Array <any>){
        this.storedid=si;
        this.storedvalue=sv;
    }
}*/
/* un model o una classe possono essere usati in
 * svariate situazioni.
 * per essere usati in un ngFor però NON DEVONO contenre array
 * bensì essere usati loro per costruire array, eventualmente...
 *p.s. questo è un esempio con costruttore funzionante

export class QueryResultsDetailsStorage {
    storedid: Array <number>;
    storedkey: Array <string>;
    storedvalue: Array <string>;
    constructor(si: Array <number>, sk: Array <string>, sv: Array <string>){
        this.storedid=si;
        this.storedkey=sk;
        this.storedvalue=sv;
    }
}
*
* L'unico modo in cui funziona un array in una classe per ng for è quando è un unico array
*
* queryresultsdetailsstorage:QueryResultsDetailsStorage[];
*
* export class QueryResultsDetailsStorage {
    storedid: number;
    storedkey: string;
    storedvalue: string;
    }
*
*
* Si è vero, inoltre fino ad ora avevo sempre sbagliato il costrutto...
*
*
* C'è un problema però: io ho per ciascun risultato (id)
* due array come la gestisco?
* intanto creo una classe per il salvataggio dei risultati... .
* per cui faccio "revert" allo spirito precedente, ma con una modifica.
* lo mantengo un array all'esterno, ma per ora mantengo anche gli array all'interno
*/
Object.defineProperty(exports, "__esModule", { value: true });
/*NON USATO!!!!!!*/
var QueryResultsDetailsStorage = /** @class */ (function () {
    function QueryResultsDetailsStorage(si, sk, sv) {
        this.storedid = si;
        this.storedkey = sk;
        this.storedvalue = sv;
    }
    return QueryResultsDetailsStorage;
}());
exports.QueryResultsDetailsStorage = QueryResultsDetailsStorage;
//# sourceMappingURL=queryresultsdetailsstorage.js.map