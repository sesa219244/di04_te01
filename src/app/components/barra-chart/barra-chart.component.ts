import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';
import { MyserviceService } from 'src/app/services/myservice.service';

@Component({
  selector: 'app-barra-chart',
  templateUrl: './barra-chart.component.html',
  styleUrls: ['./barra-chart.component.scss'],
})

export class BarraChartComponent  implements OnInit {

  public chart!: Chart;

  // Creamos las variables que recibiremos por parámetros
  @Input() tipoDeChartSeleccionado: string = "";
  @Input() backgroundColorCat: string[] = [];
  @Input() borderColorCat: string[] = [];

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
        // Cuando recibimos un valor actualizamos el array apiData, para guardar la categoria y su totalResults en las mismas posiciones del array.
        this.apiData.push(datos);
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

    if (!this.chart) {
      // Creamos un canvas
      const canvas = this.renderer.createElement('canvas');
      // Le añadimos una id al canvas
      this.renderer.setAttribute(canvas, 'id', 'BarraChart');
      // Le añadimos el canvas al div con id "contenedor-barchart"
      const container = this.el.nativeElement.querySelector('#contenedor-barrachart');
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

    this.apiData.forEach((row: { categoria: string; totalResults: number }, index: number) => {
      const categoria = row.categoria;
      console.log(categoria);
      const totalResults = row.totalResults;
      console.log(totalResults);
      console.log(index);

      if (!datasetsByCompany[categoria]) {
        datasetsByCompany[categoria] = {
          label: 'Valores de ' + categoria,
          data: [totalResults],
          backgroundColor: [this.backgroundColorCat[index]],
          borderColor: [this.borderColorCat[index]],
          borderWidth: 1
        };
        console.log(datasetsByCompany);
      } else {
        datasetsByCompany[categoria].data[index] = totalResults;
        datasetsByCompany[categoria].backgroundColor[index] = this.backgroundColorCat[index];
        datasetsByCompany[categoria].borderColor[index] = this.borderColorCat[index];
        console.log(datasetsByCompany);
      }
    });

    this.chart.data.labels = this.apiData.map((row: { categoria: string; totalResults: number }) => row.categoria);
    this.chart.data.datasets = Object.values(datasetsByCompany);
    // Actualizamos el chart con los nuevos valores cada vez que recibimos un valor.
    this.chart.update();
  }
}
