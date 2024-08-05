import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, reduce, tap, throwError } from 'rxjs';
import { Estacion, EstacionesData, Combustible, CombustibleI, Ubicacion } from '../model/estaciones';

@Injectable({
  providedIn: 'root'
})
export class CombustibleService {
  //inject the dependency
  constructor(private http: HttpClient) { }

  private apiUrl: string = "assets/data.json";

  //con BehavioSubject podemos iniciar con un valor por defecto
  //será entregado este valor desde el principio 
  //private estacionesData: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  //public data$: Observable<any[]> = this.estacionesData.asObservable();

  private ubicaciones: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);


  private estacionesData$!: Observable<any[]>;

  //oden por defecto de los combustibles en el arreglo entregado
  order: string[] = ['97', '95', '93', 'DI', 'KE'];


  getApiResults(): Observable<Estacion[]> {
    return this.http.get<Estacion[]>(this.apiUrl)
  }

  getUbicaciones(): Observable<Ubicacion[]> {
    return this.getApiResults().pipe(map((estaciones: Estacion[]) => {
      return estaciones.map((estacion: Estacion) => {
        return estacion.ubicacion
      })
    }))
  }

  getEstaciones(): Observable<Estacion[]> {
    return this.getApiResults().pipe(map((estaciones: Estacion[]) => {
      return estaciones
    }))
  }



  /**
  * obtiene los precios de combustibles a partir de una ubicacion (latitud y longitud) proporcionada
  * @param string[]  La longitud y latitud.
  * @return Un objeto 'Precio' con los valores encontrados
  */
  // getPrices(latitud: string, longitud: string): Observable < Combustible[] > {
  //     return this.getApiResults().pipe((data:Estacion[])=>{
  //       const estacion = data.find(e =>
  //         e.ubicacion.latitud === latitud && e.ubicacion.longitud === longitud
  //       );

  //       if (!estacion) {
  //         return [];
  //       }

  //       return Object.entries(estacion.precios).map(([key, value]: [string, any]) => {
  //         const element = new Combustible();
  //         element.nombre = key;
  //         element.precio = value.precio;
  //         return element;
  //       }).sort((a, b) => this.order.indexOf(a.nombre) - this.order.indexOf(b.nombre));;
  //     }
  //   );
  // }




  encontrarNumeroMasCercano(array: number[], objetivo: number): number {
    return array.reduce((a, b) => {
      return Math.abs(b - objetivo) < Math.abs(a - objetivo) ? b : a;
    });
  }
}
