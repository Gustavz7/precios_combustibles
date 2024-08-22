import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CombustibleService {
  constructor() { }

  //oden por defecto de los combustibles en el arreglo entregado
  order: string[] = ['97', '95', '93', 'DI', 'KE'];
}
