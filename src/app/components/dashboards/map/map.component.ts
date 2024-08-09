import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule, MapAdvancedMarker, MapInfoWindow, MapMarker, MapMarkerClusterer } from "@angular/google-maps";
import { CombustibleService } from '../../../services/combustible.service';
import { BehaviorSubject, filter, map, Observable } from 'rxjs';
import { Estacion, Ubicacion } from '../../../model/estaciones';
import { MarkerEstacion } from '../../../model/marker_estaciones';

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

  user_position: MarkerEstacion = { lat: this.latitude, lng: this.longitude, content: undefined };
  marker_position = { lat: 0, lng: 0 };

  markers_copec: any[] = [];
  markers_shell: any[] = [];
  markers_petrobras: any[] = [];

  markers_otras_estaciones: any[] = [];

  test_marker: any = { lat: -38.9862884, lng: -72.63725, content: '' };
  img_tag: any = document.createElement("img");

  options: google.maps.MapOptions = {
    mapId: "DEMO_MAP_ID",
    center: this.user_position,
    zoom: 14,
    mapTypeControl: true,
    streetViewControl: false,
    fullscreenControl: true
  };


  markers: MapMarkerClusterer[] = [{
    position: new google.maps.LatLng(35, 139),
    options: {
      imagePath: {
        url: 'path/to/your/icon.png', // URL to the custom icon image
        scaledSize: new google.maps.Size(40, 40) // Size of the icon
      }
    }
  }
  ];

  ubicacion_estacion_cercana: number[] = [];

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

  onMarkerClick(marker: MapAdvancedMarker, position: any) {
    this.infoWindow.openAdvancedMarkerElement(marker.advancedMarker, position.lat);
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
              this.markers_shell.push({ position: { lat, lng } });
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
    console.log(this.markers_shell)
  }

  ngOnInit(): void {
    let beachFlag = "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";
    this.img_tag.src = beachFlag;


    //configuracion imagen personalida para estaciones
    // const beachFlag = "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";
    // let imgTag = document.createElement("img");
    // imgTag.src = beachFlag;
    // this.user_position.content = imgTag;

    /*obtenemos la posiion actual meidante las coordenadas que solicita el navegador
    y definimos la estacion mas cercana
    */
    this.getCurrentPosition();

    //nos guardamos los detalles de la ubicacion actual y de la estacion cercana
    this.detalles_ubicacion_actual$.subscribe((data: Estacion) => {
      this.detalles_ubicacion = data.ubicacion;
      this.marker_position.lat = Number(data.ubicacion.latitud);
      this.marker_position.lng = Number(data.ubicacion.longitud);
    })

    //mapeamos todas las coordenadas en arrays para mostrarlos en marcadores del mapa
    this.mapLocations();


  }
}