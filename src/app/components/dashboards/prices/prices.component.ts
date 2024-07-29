import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CombustibleService } from '../../../services/combustible.service';
import { Combustible } from '../../../model/estaciones';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-prices',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prices.component.html',
  styleUrl: './prices.component.css'
})
export class PricesComponent implements OnInit {
  //inyectamos las dependencias a usarse en esta clase
  constructor(private combustibleService: CombustibleService) { }

  //TODO: Conectar con google maps, ubicacion dinamica
  location: Array<string> = [];
  combustiblesInfo?: Combustible[];

  ngOnInit(): void {
    this.actualizarPrecios();
  }

  actualizarPrecios(): void {
    this.combustiblesInfo = new Array<Combustible>;
    if (this.location.length < 1) {
      //definimos una localizacion por defecto
      this.location = ["-20.213349467685262", "-70.14856606721878"];
    };
    this.combustibleService.getPrices(this.location[0], this.location[1]
    ).subscribe((data: Combustible[]) => {
      this.combustiblesInfo = data;
      console.log(this.combustiblesInfo)
    })
  }
}
