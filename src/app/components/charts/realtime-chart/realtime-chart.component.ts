import {Component, inject, Input, OnInit, output, signal} from '@angular/core';
import {WebSocketService} from "../../../services/websocket.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {SelectedOptions} from "../../../model/selector.model";
import {LineData} from "../../../model/charts.model";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexMarkers,
  ApexYAxis,
  ApexGrid,
  ApexTitleSubtitle,
  ApexLegend, ChartComponent
} from "ng-apexcharts";
import {format} from "date-fns";


export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  colors: string[];
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-realtime-chart',
  imports: [
    ChartComponent
  ],
  templateUrl: './realtime-chart.component.html',
  styleUrl: './realtime-chart.component.scss'
})
export class RealtimeChartComponent implements OnInit {
  private webSocketService = inject(WebSocketService);

  @Input() set selectedOptions(selectedOptions: SelectedOptions | undefined) {
    const message = {
      "type": "l1-subscription",
      "id": "1",
      "instrumentId": selectedOptions?.instrumentId,
      "provider": selectedOptions?.provider,
      "subscribe": true,
      "kinds": [
        "last"
      ]
    }
    this.webSocketService.sendMessage(message);
    this.chartOptions = this.initialChartOptions();
  }
  public chartOptions: ChartOptions;
  currentPrice = output<{ price: string, time: string }>();


  constructor() {
   this.chartOptions = this.initialChartOptions();
    this.webSocketService.webSocket$.pipe(
      takeUntilDestroyed()).subscribe((value) => {
      console.log(value);
    })
  }

  ngOnInit() {
    this.webSocketService.webSocket$.subscribe((res) => {

      const result = res as { type: string; last: { timestamp: string, price: string } }
      if (result.type === 'l1-update') {
        this.currentPrice.emit({
          price: result.last.price,
          time: format(new Date(result.last.timestamp), 'dd/MM/yyyy HH:mm')
        });
        if(this.chartOptions.series[0].data.length > 20) {
          this.chartOptions.series[0].data.shift();
        }
        // @ts-ignore
        this.chartOptions.series[0].data.push(result.last.price)
       //this.chartOptions.xaxis.categories = [ ...this.chartOptions.xaxis.categories, new Date()];
        this.chartOptions.series = [
          {
            name: this.chartOptions.series[0].name,
            data: this.chartOptions.series[0].data
          }
        ];

      }
    })
  }


  initialChartOptions(): ChartOptions {
    return  {
      series: [
        {
          name: "High - 2013",
          data: []
        }
      ],
      chart: {
        height: 350,
        type: "line",
        dropShadow: {
          enabled: true,
          color: "#000",
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2
        },
        toolbar: {
          show: false
        }
      },
      colors: ["#77B6EA", "#545454"],
      dataLabels: {
        enabled: true
      },
      stroke: {
        curve: "smooth"
      },
      title: {
        text: "Historical Prices",
        align: "left"
      },
      grid: {
        borderColor: "#e7e7e7",
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      markers: {
        size: 1
      },
      xaxis: {
        // type: "datetime",
        title: {
          text: "Time"
        }
      },
      yaxis: {
        title: {
          text: "Price"
        }
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5
      }
    };
  }
  ngOnDestroy(): void {
    this.webSocketService.closeConnection();
  }

}
