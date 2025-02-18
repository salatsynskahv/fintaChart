import {Component, ComponentRef, ElementRef, inject, Input, Output, output, signal, ViewChild} from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexYAxis,
  ApexXAxis,
  ApexTitleSubtitle, NgApexchartsModule
} from "ng-apexcharts";
import {FintaService} from "../../../services/finta.service";
import {SelectedOptions} from "../../../model/selector.model";
import {format} from "date-fns";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-historical-chart',
  imports: [
    NgApexchartsModule
  ],
  templateUrl: './historical-chart.component.html',
  styleUrl: './historical-chart.component.scss'
})
export class HistoricalChartComponent {

  @Input() set selectedOptions(selectedOptions: SelectedOptions | undefined) {
    if(selectedOptions) {
      this._selectedOptions.set(selectedOptions);
      this.finService.getCountBack(selectedOptions.instrumentId, selectedOptions.provider)
        .subscribe((res) => {
            const data = res?.map((value: any) => (
              {
                x: new Date(value.t).getTime(),
                y: [value.o, value.h, value.l, value.c]
              }
            ));
            this.chartOptions.series = [{
              name: 'candels',
              data: data
            }];
            if(data?.length > 0) {
             this.currentPrice.emit({
               price: String(data[data.length-1].y[0]),
               time: format(data[data.length-1].x, 'dd/MM/yyyy HH:mm')
             })
            }
          }
        )
    }
  }

  currentPrice = output<{ price: string, time: string }>();
  public chartOptions: ChartOptions;

  private finService = inject(FintaService);
  _selectedOptions = signal<SelectedOptions | undefined>(undefined);

  constructor() {

    this.chartOptions = {
      series: [
        {
          name: this._selectedOptions()?.symbol,
          data: [
          ]
        }
      ],
      chart: {
        type: "candlestick",
        height: 350
      },
      title: {
        text: "CandleStick Chart",
        align: "left"
      },
      xaxis: {
        type: "datetime",
        labels: {
          datetimeUTC: false
        }
      },
      yaxis: {
        tooltip: {
          enabled: true
        }
      }
    };
  }
}
