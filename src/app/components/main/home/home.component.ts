import { Component } from '@angular/core';
import { PricesComponent } from "../prices/prices.component";
import { MapComponent } from "../map/map.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PricesComponent, MapComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
