import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Estacion, Ubicacion } from '../../model/classes/estaciones';

@Injectable({
  providedIn: 'root'
})
export class CombustibleService {
  constructor(private http: HttpClient) { }

  private apiUrl: string = "assets/data.json";


  

  //coordenadas por defecto si no se informa ninguna otra
  location: Array<number> = [-38.7333306601131, -72.6149350404734];


  getApiResults(): Observable<Estacion[]> {
    return this.http.get<Estacion[]>(this.apiUrl)
  }



//TODO: metodo que recupere la ubicacion actual basada en coordenadas entregadas por el navegador

}
