import { Component, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import * as $ from 'jquery';

import { ModaldocumentviewerService } from '../_services/index';

@Component({
    moduleId: module.id.toString(),
    selector: 'modaldocumentviewer',
    template: '<ng-content></ng-content>'
})

export class ModaldocumentviewerComponent implements OnInit, OnDestroy {
    @Input() id: string;
    private element: JQuery;

    constructor
    (
      private modaldvService: ModaldocumentviewerService
     ,private el: ElementRef
    )
    {
      this.element = $(el.nativeElement);
    }

    ngOnInit(): void {
      let modaldocumentviewer = this;
      // ensure id attribute exists
      if (!this.id) {
        console.error('modaldocumentviewer must have an id');
        return;
      }
      // move element to bottom of page (just before </body>) so it can be displayed above everything else
      this.element.appendTo('body');
      // close modal on background click
      this.element.on('click', function (e: any) {
          var target = $(e.target);
          if (!target.closest('.modaldocumentviewer-body').length) {
            modaldocumentviewer.close();
          }
        }
      );
      // add self (this modal instance) to the modal service so it's accessible from controllers
      this.modaldvService.add(this);
    }

    // remove self from modal service when directive is destroyed
    ngOnDestroy(): void {
      this.modaldvService.remove(this.id);
      this.element.remove();
    }

    // open modal
    open(): void {
		//console.log(this.element.find('div.modal').css('display'));
		  this.element.find('div.modaldocumentviewer').css('display','inline');
      this.element.show();
      $('body').addClass('modaldocumentviewer-open');
    }

    // close modal
    close(): void {
      this.element.find('div.modaldocumentviewer').css('display','none');
      this.element.hide();
      $('body').removeClass('modaldocumentviewer-open');
    }
}
