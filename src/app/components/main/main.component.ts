import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {FormControl, FormGroupDirective, FormsModule, NgForm} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {ErrorStateMatcher} from "@angular/material/core";
import {MatButton} from "@angular/material/button";
import {AuthService} from "../../services/auth.service";
import {FintaService} from "../../services/finta.service";
import {SelectorComponent} from "../selector/selector.component";
import {SelectedOptions} from "../../model/selector.model";
import {NgIf} from "@angular/common";
import {HistoricalChartComponent} from "../charts/historical-chart/historical-chart.component";
import {RealtimeChartComponent} from "../charts/realtime-chart/realtime-chart.component";


export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'fin-main',
  standalone: true,
  imports: [
    MatSelectModule,
    FormsModule,
    MatInputModule,
    MatButton,
    SelectorComponent,
    NgIf,
    HistoricalChartComponent,
    RealtimeChartComponent
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {

  private authService = inject(AuthService);
  private fintaService = inject(FintaService);


  ngOnInit(): void {
    this.authService.getToken();
  }

  symbol = computed(() => this.selectedOptions()?.symbol || '-');
  price = signal('-');
  time = signal('-');

  selectedOptions = signal<SelectedOptions | undefined>(undefined);
  showHistoricalPrices = signal(true);
  toggleButtonTitle = computed(() => this.showHistoricalPrices() ? 'Show Realtime Prices' : 'Show Historical Prices')
  chartTitle = computed(() => this.showHistoricalPrices() ? 'Historical Prices' : 'Realtime Prices')

  handleSelectedOptions(options: SelectedOptions) {
    this.selectedOptions.set(options);
  }

  setCurrentPrice(value: { price: string, time: string }) {
    this.price.set(value.price);
    this.time.set(value.time);
  }


  onClickShowButton() {
    this.showHistoricalPrices.update((value) => !value);
  }
}
