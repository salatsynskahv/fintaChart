import {Component, computed, inject, linkedSignal, OnInit, output, resource, signal} from '@angular/core';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatOption, MatSelectModule} from "@angular/material/select";
import {FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf} from "@angular/common";
import {FintaService} from "../../services/finta.service";
import {MatChipSelectionChange, MatChipsModule} from "@angular/material/chips";
import {SelectedOptions} from "../../model/selector.model";

@Component({
  selector: 'fin-selector',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatOption,
    ReactiveFormsModule,
    NgForOf,
    MatChipsModule
  ],
  templateUrl: './selector.component.html',
  styleUrl: './selector.component.scss'
})
export class SelectorComponent implements OnInit {

  providers = signal<string[]>([]);
  selectOptionEmitter = output<SelectedOptions>();
  private fintaService = inject(FintaService);

  selectedProvider = signal('simulation');
  filteredOptions = computed(() => this.providerResource.value()?.data);
  selectedInstrumentId = linkedSignal(() => {
    const value = this.providerResource.value()?.data[0];
    if (value) {
      this.onSelectionChange(value);
      return this.providerResource.value()?.data[0];
    } else {
      return undefined;
    }
  })


  filterList(value: MatChipSelectionChange) {
   // this.selectedProvider.set(value.source.value);
  }

  onSelectionChange(value: any) {
    this.selectedInstrumentId.set(value.id);
    this.selectOptionEmitter.emit({
      instrumentId: value.id,
      provider: this.selectedProvider(),
      symbol: value.symbol
    })
  }


  providerResource = resource({
    request: () => (this.selectedProvider()),
    loader: ({request}) => this.fintaService.getInstrumentsList(request),
  });

  ngOnInit(): void {
    this.fintaService.getProvidersList().subscribe((result: unknown) => {
      this.providers.set((result as { data: [] }).data);
    });
  }

}
