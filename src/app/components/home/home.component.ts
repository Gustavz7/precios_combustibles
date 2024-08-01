import { Component } from '@angular/core';
import { PricesComponent } from "../dashboards/prices/prices.component";
import { MapComponent } from "../dashboards/map/map.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PricesComponent, MapComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
