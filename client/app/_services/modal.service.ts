//L'import originale: peccato rompa ogni cosa e causi dei reload continui nel caso venga effettuato più volte in servizi diversi
//import * as _ from 'underscore';
import * as und_m from 'underscore';

export class ModalService {
    private modals: any[] = [];

    add(modal: any) {
        // add modal to array of active modals
        this.modals.push(modal);
    }

    remove(id: string) {
        // remove modal from array of active modals
        let modalToRemove = und_m.findWhere(this.modals, { id: id });
        this.modals = und_m.without(this.modals, modalToRemove);
    }

    open(id: string) {
        // open modal specified by id
        let modal = und_m.findWhere(this.modals, { id: id });
        modal.open();
    }

    close(id: string) {
        // close modal specified by id
        let modal = und_m.find(this.modals, { id: id });
        modal.close();
    }
}
