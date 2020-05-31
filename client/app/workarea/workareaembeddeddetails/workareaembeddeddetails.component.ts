//Natives
import { Component,OnInit,Input } from '@angular/core';
import { Router } from '@angular/router';
//Services
import { WorkareaService } from '../../_services/index';
import { EnvironmentService } from '../../_services/index';
//Components
import { WorkareaComponent } from '../index';

//Pipes
import { UnderscoreToBlankSpacesPipe } from '../../_pipes/index';

//Componenti
@Component({
  selector: 'embeddedDetailsComponent',
  template: `
	<div class="row" style="width=100%">
				<div *ngFor="let storedkey of this.localKeys; index as i;">
					<div class="row" style="border:1px solid #cecece;">
						<div class="col-md-4">
							<h4>{{storedkey | UnderscoreToBlankSpaces}} : </h4> 
						</div>
						<div class="col-md-8">
							<div>{{this.localValues[i] | UnderscoreToBlankSpaces}}</div>
						</div>
					</div>
				</div>
	</div>
`
})
export class EmbeddeddetailsComponent implements OnInit {

  @Input() localKeys: String[];
  @Input() localValues: String[];

  constructor(private workareaService: WorkareaService,private _environmentService: EnvironmentService) { }

  ngOnInit() {
  }
}
