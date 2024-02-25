import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';
import { MyserviceService } from 'src/app/services/myservice.service';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})

export class BarChartComponent  implements OnInit {

  public chart!: Chart;

  // Creamos las variables que recibiremos por parámetros
  @Input() backgroundColorCat: string[] = [];
  @Input() borderColorCat: string[] = [];

  // Creamos las vartiable ApiData para guardar el nombre y valor de las categorias
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
        console.log("apiData", this.apiData);
        this.actualizarChart();
      }
    });
  }


  inicializarChart() {

    const datasetsByCompany: {
      label: string;
      data: number[];
      backgroundColor: string[];
      borderColor: string[];
      borderWidth: number
    } [] = [];

    // Si el char no está creado
    if (!this.chart) {
      // Creamos un canvas
      const canvas = this.renderer.createElement('canvas');
      // Le añadimos una id al canvas
      this.renderer.setAttribute(canvas, 'id', 'bar-chart');
      // Le añadimos el canvas al div con id "contenedor-barchart"
      const container = this.el.nativeElement.querySelector('#contenedor-barchart');
      // Le añadimos el canvas al container
      this.renderer.appendChild(container, canvas);

      // Creamos el Chart
      this.chart = new Chart(canvas, {
        type: 'bar' as ChartType, // tipo de la gráfica
        data: {
          labels: [],
          datasets: datasetsByCompany,
        },
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


  actualizarChart() {

    const datasetsByCompany: {
      [key: string]: {
        label: string;
        data: number[];
        backgroundColor: string[];
        borderColor: string[];
        borderWidth: number
      }
    } = {};

    // Hacemos un forEach para leer los datos que viene de la Api
    this.apiData.forEach((row: { categoria: string; totalResults: number }, index: number) => {
      const categoria = row.categoria;
      const totalResults = row.totalResults;

      // Si todavía no se han pintado los datos de la categoría
      if (!datasetsByCompany[categoria]) {
        datasetsByCompany[categoria] = {
          label: 'Valores de ' + categoria,
          data: [],
          backgroundColor: [this.backgroundColorCat[index]],
          borderColor: [this.borderColorCat[index]],
          borderWidth: 1
        };
        console.log(datasetsByCompany);
      }

      // Una vez establecidos los datos de la categoría lo que hacemos es darle los valores correspondientes
      datasetsByCompany[categoria].data[index] = totalResults;
      datasetsByCompany[categoria].backgroundColor[index] = this.backgroundColorCat[index];
      datasetsByCompany[categoria].borderColor[index] = this.borderColorCat[index];
    });

    // Para modificar los valores de la labels lo hacemos través de un map
    this.chart.data.labels = this.apiData.map((row: { categoria: string; totalResults: number }) => row.categoria);
    // Para modificar el datasets, es muy importante hacer uso de Object.values.
    this.chart.data.datasets = Object.values(datasetsByCompany);
    // Actualizamos el chart con los nuevos valores cada vez que recibimos un valor.
    this.chart.update();
  }
}
