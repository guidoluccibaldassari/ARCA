import { Pipe, PipeTransform } from '@angular/core';
/*
*/
@Pipe({name: 'UnderscoreToBlankSpaces'})
export class UnderscoreToBlankSpacesPipe implements PipeTransform {
  transform(value: any): string {
    var tmpString;
    if(typeof(value)!='undefined'){
      tmpString = value.toString();
      tmpString = tmpString.replace(/_/g, " ");
      tmpString = tmpString.replace(/"/g," ");
      return tmpString;
    }
    else {
      return (" ");
    }
  }
}
