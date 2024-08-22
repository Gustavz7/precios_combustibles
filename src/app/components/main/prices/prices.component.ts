import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { Combustible, Estacion } from '../../../core/model/classes/estaciones';
import { EstacionService } from '../../../core/services/estacion-service/estacion.service';

@Component({
  selector: 'app-prices',
  standalone: true,
  imports: [CommonModule, MatDividerModule, MatListModule],
  templateUrl: './prices.component.html',
  styleUrl: './prices.component.css',
})
export class PricesComponent implements OnInit, OnDestroy {
  //inyectamos las dependencias a usarse en esta clase
  constructor(private estacionService: EstacionService) {}

  //localizacion del usuario
  combustiblesInfo: Combustible[] = new Array<Combustible>();
  estacionActual: Estacion = new Estacion();

  src_copec: string =
    'https://th.bing.com/th/id/OIP.OlbJwLagnfWNxVjKcpSB-AHaDt?rs=1&pid=ImgDetMain';
  src_shell: string =
    'https://th.bing.com/th/id/OIP.4Mo_UpBJ0b4-uYcPxzKk0QHaEA?rs=1&pid=ImgDetMain';
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
    this.estacionService.defineEstacionCercana();

    this.estacionService.estacionCercana$.subscribe((estacion: Estacion) => {
      this.setDetallesEstacionActual(estacion);
      const precios = estacion.precios;
      this.combustiblesInfo = new Array<Combustible>();
      // for in por que se trata de un objeto js
      for (const key in precios) {
        if (precios.hasOwnProperty(key)) {
          this.combustiblesInfo?.push(
            new Combustible(
              this.setCategoria(key),
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

  private setCategoria(tipoCombustible: string): string {
    let result = 'GASOLINA';

    switch (tipoCombustible) {
      case '93':
      case '95':
      case '97':
        break;

      case 'DI':
      case 'ADI':
        result = 'PETROLEO';
        break;

      case 'KE':
      case 'AKE':
        result = 'KEROSENO';
        break;

      default:
        result = tipoCombustible;
        break;
    }

    return result;
  }
  setDetallesEstacionActual(estacion: Estacion) {
    this.estacionActual = estacion;

    switch (this.estacionActual.distribuidor.marca) {
      case 'COPEC':
        this.estacionActual.distribuidor.imagen = this.src_copec;
        break;
      case 'SHELL':
        this.estacionActual.distribuidor.imagen = this.src_shell;
        break;
      case 'PETROBRAS':
        this.estacionActual.distribuidor.imagen = this.src_petrobras;
        break;
      default:
        this.estacionActual.distribuidor.imagen = this.src_unknown;
        break;
    }
  }
}
