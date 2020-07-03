import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizado'
})
export class CapitalizadoPipe implements PipeTransform {

  transform(value: string, todas: boolean = true): string {

    if (!value) {
      return;
    }

    let i = '';
    value = value.toLowerCase();

    const nombres = value.split(' ');

    if ( todas ) {
        // tslint:disable-next-line:forin
        for (i in nombres) {
        nombres[i] = nombres[i].charAt(0) .toUpperCase() + nombres[i].slice(1);
        }
    } else {
        nombres[0] = nombres[0].charAt(0).toUpperCase() + nombres[0].slice(1);
    }
    return nombres.join(' ');
  }

}
