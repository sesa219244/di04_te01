import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';
import { MyserviceService } from 'src/app/services/myservice.service';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
})
export class LineChartComponent  implements OnInit {

  public chart!: Chart;

  // Creamos las variables que recibiremos por parámetros
  @Input() tipoDeChartSeleccionado: string = "";
  @Input() categorias: string[] = [];
  @Input() datosCategorias: number[] = [];

  constructor(private el: ElementRef, private renderer: Renderer2, private gestionServicioApi: MyserviceService) {}


  ngOnInit(): void {
    this.inicializarChart();
    this.actualizarChart();
  }


  inicializarChart() {
    // Datos
    let data = null;

    if (this.tipoDeChartSeleccionado === "line-chart" || this.tipoDeChartSeleccionado === "bar-chart") {
      data = {
        labels: this.categorias,
        datasets: [{
          label: 'My Parameters Dataset',
          data: this.datosCategorias,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      };
    } else {
      data = {
        labels: [],
        datasets: [{
          label: '',
          data: [],
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      };
    };


    // Creamos un canvas
    const canvas = this.renderer.createElement('canvas');
    this.renderer.setAttribute(canvas, 'id', 'LineChart');

    // Añadimos el canvas al div con id "contenedor-linechart"
    const container = this.el.nativeElement.querySelector('#contenedor-linechart');
    this.renderer.appendChild(container, canvas);

    // Creamos el Chart
    this.chart = new Chart(canvas, {
      type: 'line' as ChartType, // tipo de la gráfica
      data: data, // datos
      options: { // opciones de la gráfica
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            labels: {
              boxWidth: 0,
              font: {
                size: 16,
                weight: 'bold'
              }
            },
          }
        },
      }
    });
    this.chart.canvas.width = 100;
    this.chart.canvas.height = 100;
  }


  actualizarChart() {
    // Nos suscribimos al observable de tipo BehaviorSubject y cuando este emita un valor, recibiremos una notificación con el nuevo valor.
    this.gestionServicioApi.datos$.subscribe((datos) => {
      if (datos != undefined) {
        // Cuando recibimos un valor actualizamos los arrays de nombre y valor de categorias, para guardar el nombre y su valor en las mismas posiciones del array.
        this.categorias.push(datos.categoria);
        this.datosCategorias.push(datos.totalResults);
        // Actualizamos el chart con los nuevos valores cada vez que recibimos un valor.
        this.chart.update();
      }
    });
  }
}
