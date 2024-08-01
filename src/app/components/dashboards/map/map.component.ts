import { Component, OnInit } from '@angular/core';
import { GoogleMapsModule } from "@angular/google-maps";
import { CombustibleService } from '../../../services/combustible.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [GoogleMapsModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit{
  constructor(private combustibleService:CombustibleService){} 
  options: google.maps.MapOptions = {
    mapId: "DEMO_MAP_ID",
    center: { lat: -31, lng: 147 },
    zoom: 4,
    mapTypeControl: true,

  };
  coordenadas!: Observable<String[]>;

  getLocation(): void{
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position)=>{
          const longitude = position.coords.longitude;
          const latitude = position.coords.latitude;

          this.coordenadas=this.combustibleService.getEstacionCercana(latitude, longitude);
        });
    } else {
       console.log("No support for geolocation")
    }
  } 

  ngOnInit(): void {
    this.getLocation();
}
}