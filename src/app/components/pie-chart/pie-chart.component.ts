import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';
import { MyserviceService } from 'src/app/services/myservice.service';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})

export class PieChartComponent  implements OnInit {

  public chart!: Chart;

  // Creamos las variables que recibiremos por parámetros
  @Input() backgroundColorCat: string[] = [];
  @Input() borderColorCat: string[] = [];

  // Creamos las vartiable ApiData para guardar el nombre y valor de las categorias
  @Input() categorias: string[] = [];
  @Input() datosCategorias: number[] = [];
  public apiData: {
    categoria: string;
    totalResults: number
  } [] = [];


  constructor(private el: ElementRef, private renderer: Renderer2, private gestionServicioApi: MyserviceService) {}

  ngOnInit(): void {
    this.inicializarChart();

    // Nos suscribimos al observable de tipo BehaviorSubject y cuando este emita un valor, recibiremos una notificación con el nuevo valor.
    this.gestionServicioApi.datos$.subscribe((datos) => {
      if (datos != undefined) {
        // Creamos una variable donde vemos si existe la categoria
        let buscarCategoria = this.apiData.find(unDato => unDato.categoria === datos.categoria);
        // Si no existe la categoria la añadimos a la apiData
        if (!buscarCategoria) {
            this.apiData.push(datos);
        }
        // Recorremos un forEach para cargar las categorias y datosCategorias
        this.apiData.forEach((row: { categoria: string; totalResults: number }, index: number) => {
          this.categorias[index] = row.categoria;
          this.datosCategorias[index] = row.totalResults;
         });
        // Actualizamos el chart con los nuevos valores cada vez que recibimos un valor.
        this.chart.update();
      }
    });
  }


  inicializarChart() {
    // Datos
    let data = null;

    if (!this.chart) {
      data = {
        labels: this.categorias,
        datasets: [{
          label: 'My Parameters Dataset',
          data: this.datosCategorias,
          backgroundColor: this.backgroundColorCat
        }]
      };
    } else {
      data = {
        labels: [],
        datasets: [{
          label: '',
          data: [],
          backgroundColor:  []
        }]
      };
    }

    // Creamos un canvas
    const canvas = this.renderer.createElement('canvas');
    this.renderer.setAttribute(canvas, 'id', 'pie-chart');

    // Añadimos el canvas al div con id "contenedor-piechart"
    const container = this.el.nativeElement.querySelector('#contenedor-piechart');
    this.renderer.appendChild(container, canvas);

    // Creamos el Chart
    this.chart = new Chart(canvas, {
      type: 'pie' as ChartType, // tipo de la gráfica
      data: data, // datos
      options: { // opciones de la gráfica
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
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
}
