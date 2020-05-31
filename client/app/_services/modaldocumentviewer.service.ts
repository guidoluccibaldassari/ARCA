import * as und_mdv from 'underscore';

export class ModaldocumentviewerService {
    private modalsdv: any[] = [];

    add(modaldv: any) {
        // add modal to array of active modals
        this.modalsdv.push(modaldv);
    }

    remove(id: string) {
        // remove modal from array of active modals
        let modaldvToRemove = und_mdv.findWhere(this.modalsdv, { id: id });
        this.modalsdv = und_mdv.without(this.modalsdv, modaldvToRemove);
    }

    open(id: string) {
        // open modal specified by id
        let modaldv = und_mdv.findWhere(this.modalsdv, { id: id });
        modaldv.open();
    }

    close(id: string) {
        // close modal specified by id
        let modaldv = und_mdv.find(this.modalsdv, { id: id });
        modaldv.close();
    }
}
