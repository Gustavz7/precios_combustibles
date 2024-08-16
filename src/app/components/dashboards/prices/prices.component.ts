import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CombustibleService } from '../../../services/combustible.service';
import { Combustible, Estacion } from '../../../model/estaciones';
import { CommonModule } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-prices',
  standalone: true,
  imports: [CommonModule, MatDividerModule, MatListModule],
  templateUrl: './prices.component.html',
  styleUrl: './prices.component.css',
})
export class PricesComponent implements OnInit, OnDestroy {
  //inyectamos las dependencias a usarse en esta clase
  constructor(private combustibleService: CombustibleService) {}

  //localizacion del usuario
  combustiblesInfo: Combustible[] = new Array<Combustible>();
  estacionActual: Estacion = new Estacion();

  src_copec: string =
    'https://www.google.com/url?sa=i&url=https%3A%2F%2Fww2.copec.cl%2Fpersonas%2Festaciones-de-servicio&psig=AOvVaw1cnogF93XsDmOa-7D4YGCb&ust=1723865301697000&source=images&cd=vfe&opi=89978449&ved=2ahUKEwiWw-3oyPiHAxW8BLkGHcjaA20QjRx6BAgAEBY';
  src_shell: string ='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSMoM7KFejzkgQUZErB8u7WgBKZo2peO_mwNw&s'
  src_petrobras: string =
    'https://www.petrobrasdistribucion.cl/wp-content/uploads/2023/01/DJI_0319-HDR-scaled-1600x800.jpg';
  src_unknown: string =
    'https://upload.wikimedia.org/wikipedia/commons/7/75/No_image_available.png';

  ngOnInit(): void {
    this.obtenerDetallesEstacion();
  }

  ngOnDestroy(): void {}

  obtenerDetallesEstacion(): void {
    this.combustiblesInfo = new Array<Combustible>();
    this.combustibleService.defineEstacionCercana();

    this.combustibleService.estacionCercana$.subscribe((estacion: Estacion) => {
      this.setDetallesEstacionActual(estacion);
      const precios = estacion.precios;
      this.combustiblesInfo = new Array<Combustible>();
      // for in por que se trata de un objeto js
      for (const key in precios) {
        if (precios.hasOwnProperty(key)) {
          this.combustiblesInfo?.push(
            new Combustible(
              key,
              precios[key].unidad_cobro,
              precios[key].precio,
              precios[key].fecha_actualizacion,
              precios[key].hora_actualizacion,
              precios[key].tipo_atencion
            )
          );
        }
      }
    });
  }
  setDetallesEstacionActual(estacion: Estacion) {
    this.estacionActual = estacion;

    switch (this.estacionActual.distribuidor.imagen) {
      case 'COPEC':
        this.estacionActual.distribuidor.imagen = this.src_copec;
        break;
      case 'SHELL':
        this.estacionActual.distribuidor.imagen = this.src_shell;
        break;
      case 'PRETROBRAS':
        this.estacionActual.distribuidor.imagen = this.src_petrobras;
        break;
      default:
        this.estacionActual.distribuidor.imagen = this.src_unknown;
        break;
    }
  }
}
