import { Component,OnInit,Input } from '@angular/core';
import { Router } from '@angular/router';
import { WorkareaComponent } from '../index';
import { WorkareaService } from '../../_services/index'; //la import del servizio

@Component({
  inputs: ['tree_html'],
  selector: 'tree',
  template: `
<ul>
	<ng-template ngFor let-item [ngForOf]="tree_html">
		<nodes [item]="item"></nodes>
	</ng-template>
</ul>
`
})
export class Tree implements OnInit {
  @Input() tree_html: any[];
  ngOnInit() { }
}
