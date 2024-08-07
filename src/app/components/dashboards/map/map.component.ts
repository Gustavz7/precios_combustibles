import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from "@angular/google-maps";
import { CombustibleService } from '../../../services/combustible.service';
import { BehaviorSubject, filter, map, Observable } from 'rxjs';
import { Estacion, Ubicacion } from '../../../model/estaciones';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [GoogleMapsModule, CommonModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit {
  constructor(private combustibleService: CombustibleService) { }

  //coordenadas entregadas por el navegador
  latitude: number = -38.9862884;
  longitude: number = -72.63725;
  user_position = { lat: this.latitude, lng: this.longitude };
  marker_position = { lat: 0, lng: 0 };
  markers_estaciones= {}

  options: google.maps.MapOptions = {
    mapId: "DEMO_MAP_ID",
    center: this.user_position,
    zoom: 12,
    mapTypeControl: true,
  };


  ubicacion_estacion_cercana: number[] = [];
  ubicaciones_estaciones$!: Observable<Ubicacion[]>;

  private estacionActualSubject = new BehaviorSubject<Estacion>(new Estacion());
  detalles_ubicacion_actual$ = this.estacionActualSubject.asObservable();
  detalles_ubicacion: Ubicacion = new Ubicacion();





  getCurrentPosition(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.longitude = position.coords.longitude;
        this.latitude = position.coords.latitude;
      });
    } else {
      console.log("No support for geolocation")
    }
    this.definirEstacionCercana(this.longitude, this.latitude);
    this
  }

  definirEstacionCercana(longitud_actual: number, latitud_actual: number): void {
    this.combustibleService.getUbicaciones().subscribe((ubicaciones: Ubicacion[]) => {
      //encontramos las coordenadas de la estacion mas cercana
      let estacion_cercana = ubicaciones
        .map(e => { return [Number(e.latitud), Number(e.longitud)] })
        .reduce((coordenadaMasCercana, coordenadaActual) => {
          const lonLatActual = Math.sqrt(
            Math.pow(coordenadaActual[0] - latitud_actual, 2) + Math.pow(coordenadaActual[1] - longitud_actual, 2)
          );
          const lonLatCercana = Math.sqrt(
            Math.pow(coordenadaMasCercana[0] - latitud_actual, 2) + Math.pow(coordenadaMasCercana[1] - longitud_actual, 2)
          );
          return lonLatActual < lonLatCercana ? coordenadaActual : coordenadaMasCercana;
        })
      //filtamos y obtenemos la estacion mediante las coordenadas mas cercanas obtenidas anteriormente
      this.getEstacionCercana(estacion_cercana);
      ;
    })
  }

  /**
 * retorna la estacion mas cercana basada en las coordenadas proporcionadas
 * 
 * @return Observable<Estacion>
 */
  getEstacionCercana(estacion_cercana: number[]) {
    this.combustibleService.getEstaciones().subscribe((estaciones: Estacion[]) => {
      this.estacionActualSubject.next(estaciones.find(e => {
        return Number(e.ubicacion.latitud) == estacion_cercana[0] && Number(e.ubicacion.longitud) == estacion_cercana[1]
      }) || new Estacion());
    })
  }

  ngOnInit(): void {
    this.getCurrentPosition();
    this.detalles_ubicacion_actual$.subscribe((data: Estacion) => {
      this.detalles_ubicacion = data.ubicacion;
      this.marker_position.lat = Number(data.ubicacion.latitud);
      this.marker_position.lng = Number(data.ubicacion.longitud);

      console.log("user: "+JSON.stringify(this.user_position))
      console.log("estacion: "+JSON.stringify(this.marker_position))
    })
  }
}