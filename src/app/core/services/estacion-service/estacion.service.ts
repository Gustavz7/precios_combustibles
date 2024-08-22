import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Estacion, Ubicacion } from '../../model/classes/estaciones';
import { CombustibleService } from '../apirequest-service/apirequest.service';

@Injectable({
  providedIn: 'root'
})
export class EstacionService {
  constructor(private combustibleService: CombustibleService) { }

  //estacion actualmente seleccionada
  private estacionSubject: BehaviorSubject<Estacion> = new BehaviorSubject<Estacion>(new Estacion());
  public estacionActual$: Observable<Estacion> = this.estacionSubject.asObservable();

  //estacion cercana
  private estacionCercanaSubject: BehaviorSubject<Estacion> = new BehaviorSubject<Estacion>(new Estacion());
  public estacionCercana$: Observable<Estacion> = this.estacionCercanaSubject.asObservable();
  //coordenadas por defecto si no se informa ninguna otra
  location: Array<number> = [-38.7333306601131, -72.6149350404734];

  getUbicaciones(): Observable<Ubicacion[]> {
    return this.combustibleService.getApiResults().pipe(map((estaciones: Estacion[]) => {
      return estaciones.map((estacion: Estacion) => {
        return estacion.ubicacion
      })
    }))
  }

  getEstaciones(): Observable<Estacion[]> {
    return this.combustibleService.getApiResults().pipe(map((estaciones: Estacion[]) => {
      return estaciones
    }))
  }

  getEstacion(lat: number, lng: number): Observable<Estacion> {
    return this.combustibleService.getApiResults().pipe(
      map((estaciones: Estacion[]) => {
        const result = estaciones.find(estacion =>
          lat === Number(estacion.ubicacion.latitud) && lng === Number(estacion.ubicacion.longitud)
        );
        return result ?? new Estacion();
      })
    );
  }

  setEstacionActual(lat: number, lng: number, estacion?: Estacion): void {
    //por aqui cuando se trata de la estacion mas cercana
    //esto aplicaria en el primer ingreso a la app
    if (estacion == undefined) {
      this.getEstacion(lat, lng).subscribe(estacion_cercana => {
        this.estacionCercanaSubject.next(estacion_cercana)
      });
    } else {
      this.estacionCercanaSubject.next(estacion)
      this.estacionSubject.next(estacion)
    }
  }

  public defineEstacionCercana(longitud_actual?: number, latitud_actual?: number): void {
    this.getUbicaciones().subscribe((ubicaciones: Ubicacion[]) => {
      //encontramos las coordenadas de la estacion mas cercana
      const latLng_estacion_cercana = ubicaciones
        .map(e => { return [Number(e.latitud), Number(e.longitud)] })
        .reduce((coordenadaMasCercana, coordenadaActual) => {
          longitud_actual == null ? longitud_actual = this.location[1] : longitud_actual;
          latitud_actual == null ? latitud_actual = this.location[0] : longitud_actual;

          const lonLatActual = Math.sqrt(
            Math.pow(coordenadaActual[0] - latitud_actual, 2) + Math.pow(coordenadaActual[1] - longitud_actual, 2)
          );
          const lonLatCercana = Math.sqrt(
            Math.pow(coordenadaMasCercana[0] - latitud_actual, 2) + Math.pow(coordenadaMasCercana[1] - longitud_actual, 2)
          );
          return lonLatActual < lonLatCercana ? coordenadaActual : coordenadaMasCercana;
        });

      this.setEstacionActual(latLng_estacion_cercana[0], latLng_estacion_cercana[1])
    })
  }
}
