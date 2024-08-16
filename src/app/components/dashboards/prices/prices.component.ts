import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CombustibleService } from '../../../services/combustible.service';
import { Combustible, Estacion } from '../../../model/estaciones';
import { CommonModule } from '@angular/common';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';


@Component({
  selector: 'app-prices',
  standalone: true,
  imports: [CommonModule, MatDividerModule, MatListModule],
  templateUrl: './prices.component.html',
  styleUrl: './prices.component.css'
})
export class PricesComponent implements OnInit, OnDestroy {
  //inyectamos las dependencias a usarse en esta clase
  constructor(private combustibleService: CombustibleService) { }

  //localizacion del usuario
  combustiblesInfo: Combustible[] = new Array<Combustible>;
  estacionActual:Estacion = new Estacion();

  ngOnInit(): void {
    this.obtenerDetallesEstacion();
  }

  ngOnDestroy(): void {
  }

  obtenerDetallesEstacion(): void {
    this.combustiblesInfo = new Array<Combustible>;
    this.combustibleService.defineEstacionCercana();

    this.combustibleService.estacionCercana$.subscribe((estacion: Estacion) => {
      this.estacionActual = estacion;
      const precios = estacion.precios
      this.combustiblesInfo = new Array<Combustible>;
      // for in por que se trata de un objeto js
      for (const key in precios) {
        if (precios.hasOwnProperty(key)) {
          this.combustiblesInfo?.push(
            new Combustible(key,
              precios[key].unidad_cobro,
              precios[key].precio,
              precios[key].fecha_actualizacion,
              precios[key].hora_actualizacion,
              precios[key].tipo_atencion)
          )
        }
      }
    })
  }
}
