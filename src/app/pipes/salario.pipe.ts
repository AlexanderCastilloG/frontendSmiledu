import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'salario'
})
export class SalarioPipe implements PipeTransform {

  transform(value: number): string {

    if (!value) {
      return;
    }

    const salario = value.toFixed(2).toString();
    let data;

    if (value >= 1000) {
      data = 'S/.' + salario.charAt(0) + ',' + salario.slice(1);
    } else {
      data = 'S/.' + salario;
    }
    return data;
  }

}
