import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'excerpt',
  pure: false
})
export class ExcerptFilter implements PipeTransform {
  transform(text: String, length:any, lang:String ): any {
    if(lang==='jpn') length = 20
    if (!text || !length) {
      return text;
    }
    if (text.length > length) {
    //   var regex = new RegExp("^(.{" + length + "}[^\s]*).*");
    //   return text.replace(regex, "$1 ...")
      return text.substr(0, length) + '...';
    }
      return text;
  }
}