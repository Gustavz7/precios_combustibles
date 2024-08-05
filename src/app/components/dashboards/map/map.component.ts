import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from "@angular/google-maps";
import { CombustibleService } from '../../../services/combustible.service';
import { filter, map, Observable } from 'rxjs';
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
  options: google.maps.MapOptions = {
    mapId: "DEMO_MAP_ID",
    center: { lat: -31, lng: 147 },
    zoom: 4,
    mapTypeControl: true,

  };

  //pitrufquen
  longitude: number = 0;
  latitude: number = 0;

  ubicacion_estacion_cercana: number[] = [];
  ubicaciones_estaciones$!: Observable<Ubicacion[]>;
  estacion_actual$!: Observable<Estacion | undefined>;

  getCurrentPosition(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.longitude = position.coords.longitude;
        this.latitude = position.coords.latitude;


        //this.ubicacion_estacion_cercana = [Number(estacion_cercana.latitud), Number(estacion_cercana.longitud)]
      });
    } else {
      console.log("No support for geolocation")
    }
    this.definirEstacionCercana(this.longitude, this.latitude);
  }

  definirEstacionCercana(longitud_actual: number, latitud_actual: number): void {
    this.combustibleService.getUbicaciones().subscribe((ubicaciones: Ubicacion[]) => {

      //encontramos las coordenadas de la estacion mas cercana
      let latitudes = ubicaciones.map(e => { return Number(e.latitud) });
      let latitud_estacion_cercana = latitudes.reduce((prev_ok_item, current_item) => {
        return Math.abs(current_item - longitud_actual) < Math.abs(prev_ok_item - longitud_actual) ? current_item : prev_ok_item;
      });
      let longitudes = ubicaciones.map(e => { return Number(e.longitud) });
      let longitud_estacion_cercana: number = longitudes.reduce((a, b) => {
        return Math.abs(b - latitud_actual) < Math.abs(a - latitud_actual) ? b : a;
      });

      console.info(longitud_actual, latitud_actual)
      console.log(latitud_estacion_cercana + " - " + longitud_estacion_cercana)
      //filtamos y obtenemos la estacion mediante las coordenadas mas cercanas obtenidas anteriormente
      this.estacion_actual$ = this.combustibleService.getEstaciones().pipe(map((estaciones: Estacion[]) => {
        return estaciones.find(e => {
          Number(e.ubicacion.latitud) == latitud_estacion_cercana && Number(e.ubicacion.longitud) == longitud_estacion_cercana
        });
      }));
    })

  }


  /**
 * retorna la estacion mas cercana basada en las coordenadas proporcionadas
 * 
 * @return Observable<Estacion>
 */
  getEstacionCercana(longitud: number, latitud: number) {
    // const estacion = data.reduce((a, b) => {
    //   //return Math.abs(b - objetivo) < Math.abs(a - objetivo) ? b : a;
    // })

  }

  ngOnInit(): void {
    this.getCurrentPosition();
  }
}