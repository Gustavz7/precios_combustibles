import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule, MapAdvancedMarker, MapInfoWindow, MapMarker, MapMarkerClusterer } from "@angular/google-maps";
import { CombustibleService } from '../../../services/combustible.service';
import { BehaviorSubject, filter, map, Observable } from 'rxjs';
import { Estacion, Ubicacion } from '../../../model/estaciones';
import { MarkerEstacion } from '../../../model/marker_estaciones';
import { publishFacade } from '@angular/compiler';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [GoogleMapsModule, CommonModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',

  //property for control full size of the google-map component
  encapsulation: ViewEncapsulation.None
})
export class MapComponent implements OnInit {
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;
  constructor(private combustibleService: CombustibleService) { }

  //coordenadas entregadas por el navegador
  latitude: number = -38.9862884;
  longitude: number = -72.63725;
  user_position: any = { lat: this.latitude, lng: this.longitude };
  center_position: google.maps.LatLngLiteral = this.user_position;

  options: google.maps.MapOptions = {
    mapId: "DEMO_MAP_ID",
    //center: this.center_position,
    zoom: 14,
    mapTypeControl: true,
    streetViewControl: false,
    fullscreenControl: false,
    minZoom: 10

  };

  //listas de marcadores
  marker_estacion_cercana: any = { lat: 0, lng: 0 };
  markers_copec: any[] = [];
  markers_shell: any[] = [];
  markers_petrobras: any[] = [];
  markers_otras_estaciones: any[] = [];

  //datos acerca de las estaciones y la mas cercana
  private estacionActualSubject = new BehaviorSubject<Estacion>(new Estacion());
  detalles_ubicacion_actual$: Observable<Estacion> = this.estacionActualSubject.asObservable();
  detalles_ubicacion: Ubicacion = new Ubicacion();
  ubicacion_estacion_cercana: number[] = [];

  ngOnInit(): void {
    this.getCurrentPosition();

    //nos guardamos los detalles de la ubicacion actual y de la estacion cercana
    this.combustibleService.estacionCercana$.subscribe((data: Estacion) => {
      this.detalles_ubicacion = data.ubicacion;
      this.marker_estacion_cercana.lat = Number(data.ubicacion.latitud);
      this.marker_estacion_cercana.lng = Number(data.ubicacion.longitud);
    })

    //mapeamos todas las coordenadas en arrays para mostrarlos en marcadores del mapa
    this.mapLocations();
  }

  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) {
      this.center_position = (event.latLng.toJSON());
    }
  }

  getCurrentPosition(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.longitude = position.coords.longitude;
        this.latitude = position.coords.latitude;
      });
    } else {
      console.log("No support for geolocation")
    }
    //this.findEstacionCercana(this.longitude, this.latitude);
  }



  onMarkerClick(marker: MapAdvancedMarker, position: any) {
    this.combustibleService.getEstacion(position.lat, position.lng).subscribe((estacion) => {
      //this.infoWindow.openAdvancedMarkerElement(marker.advancedMarker, estacion.distribuidor.marca); //deprecated
      this.infoWindow.open(marker, true, estacion.distribuidor.marca + estacion.ubicacion.latitud + estacion.ubicacion.longitud)

      //tambien debe actualizar los valores del componente precios
      this.combustibleService.setEstacionActual(position.lat, position.lng, estacion);
    })
  }

  mapLocations() {
    this.combustibleService.getEstaciones().subscribe((ele: Estacion[]) => {

      ele.forEach((estacion: Estacion) => {
        const lat = Number(estacion.ubicacion.latitud);
        const lng = Number(estacion.ubicacion.longitud);

        // Verificar si latitud y longitud son válidos
        if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
          switch (estacion.distribuidor.marca) {
            case 'COPEC':
              this.markers_copec.push({ lat, lng })
              break;
            case 'SHELL':
              this.markers_shell.push({ lat, lng });
              break;
            case 'PETROBRAS':
              this.markers_petrobras.push({ lat, lng });
              break;
            default:
              this.markers_otras_estaciones.push({ lat, lng });
              break;
          }
        } else {
          //console.error(`coordenaas invalidas para las estacion: ${estacion.distribuidor.marca}`, estacion);
        }
      }
      );
    });
  }
}