import { Pipe, PipeTransform } from '@angular/core';
import { capitalizeFirstLetter } from 'src/app/components/helpers';

@Pipe({
  name: 'capitalizeFirstLetter',
})
export class CapitalizeFirstLetterPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    return capitalizeFirstLetter(value);
  }
}
