import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {
  GoogleMap,
  GoogleMapsModule,
  MapAdvancedMarker,
  MapInfoWindow
} from '@angular/google-maps';
import { BehaviorSubject, Observable } from 'rxjs';
import { Estacion, Ubicacion } from '../../../core/model/classes/estaciones';
import { EstacionService } from '../../../core/services/estacion-service/estacion.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [GoogleMapsModule, CommonModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',

  //property for control full size of the google-map component
  encapsulation: ViewEncapsulation.None,
})
export class MapComponent implements OnInit {
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;
  @ViewChild(GoogleMap) map!: GoogleMap;
  constructor(private estacionService: EstacionService) { }

  //coordenadas entregadas por el navegador
  //user_position: any = { lat: this.latitude, lng: this.longitude }; -
  center_position: google.maps.LatLngLiteral = {
    lat: 0,
    lng: 0,
  };

  enableGeolocalization: boolean = false;
  mapReady: boolean = false;

  options: google.maps.MapOptions = {
    mapId: 'DEMO_MAP_ID',
    center: null,
    zoom: 14,
    mapTypeControl: true,
    streetViewControl: false,
    fullscreenControl: false,
    minZoom: 10,
  };

  //listas de marcadores
  marker_estacion_cercana: google.maps.LatLngLiteral = {
    lat: 0,
    lng: 0,
  };
  markers_copec: any[] = [];
  markers_shell: any[] = [];
  markers_petrobras: any[] = [];
  markers_otras_estaciones: any[] = [];

  //datos acerca de las estaciones y la mas cercana
  private estacionActualSubject = new BehaviorSubject<Estacion>(new Estacion());
  detalles_ubicacion_actual$: Observable<Estacion> =
    this.estacionActualSubject.asObservable();
  detalles_ubicacion: Ubicacion = new Ubicacion();
  ubicacion_estacion_cercana: number[] = [];

  imageEstacionCercana: HTMLImageElement = document.createElement('img');

  ngOnInit(): void {
    this.imageEstacionCercana.src =
      'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';

    //nos suscribimos a la estaciona actual para poder mover el centro del mapa
    this.estacionService.estacionCercana$.subscribe((next) => {
      const lat = Number(next.ubicacion.latitud);
      const lng = Number(next.ubicacion.longitud);
      if (lat != 0 && lng != 0) {
        this.center_position.lat = lat;
        this.center_position.lng = lng;
        this.options.center = this.center_position;
        this.mapReady = true;
      }
    });

    //nos guardamos los detalles de la ubicacion actual y de la estacion cercana
    this.estacionService.estacionCercana$.subscribe((data: Estacion) => {
      this.detalles_ubicacion = data.ubicacion;
      this.marker_estacion_cercana.lat = Number(data.ubicacion.latitud);
      this.marker_estacion_cercana.lng = Number(data.ubicacion.longitud);
    });

    //mapeamos todas las coordenadas en arrays para mostrarlos en marcadores del mapa
    this.mapLocations();
  }

  moveMap(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) {
      this.center_position = event.latLng.toJSON();
    }
  }

  onMarkerClick(marker: MapAdvancedMarker, position: any) {
    this.estacionService
      .getEstacion(position.lat, position.lng)
      .subscribe((estacion) => {
        this.infoWindow.open(
          marker,
          true,
          estacion.ubicacion.direccion + ',' + estacion.ubicacion.nombre_comuna
        );

        //tambien debe actualizar los valores del componente precios
        this.estacionService.setEstacionActual(
          position.lat,
          position.lng,
          estacion
        );
      });
  }

  mapLocations() {
    this.estacionService.getEstaciones().subscribe((ele: Estacion[]) => {
      ele.forEach((estacion: Estacion) => {
        const lat = Number(estacion.ubicacion.latitud);
        const lng = Number(estacion.ubicacion.longitud);

        // Verificar si latitud y longitud son válidos
        if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
          switch (estacion.distribuidor.marca) {
            case 'COPEC':
              this.markers_copec.push({ lat, lng });
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
      });
    });
  }
}
