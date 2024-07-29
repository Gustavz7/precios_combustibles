import { Component } from '@angular/core';
import { PricesComponent } from "../dashboards/prices/prices.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PricesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
