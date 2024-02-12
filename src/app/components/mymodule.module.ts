import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { BarraChartComponent } from './barra-chart/barra-chart.component';



@NgModule({
  declarations: [ BarChartComponent, LineChartComponent, PieChartComponent, BarraChartComponent ],
  imports: [ CommonModule ],
  exports: [ BarChartComponent, LineChartComponent, PieChartComponent, BarraChartComponent ]
})

export class MymoduleModule { }
