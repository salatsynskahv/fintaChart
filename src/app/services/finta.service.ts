import {inject, Injectable} from "@angular/core";

import {HttpService} from "./http.service";
import {firstValueFrom, map, Observable} from "rxjs";
import {InstrumentResponse} from "../model/response.model";
import {BarData} from "../model/charts.model";

@Injectable({
  providedIn: 'root',
})
export class FintaService {

  httpService = inject(HttpService);

  getProvidersList(): Observable<unknown> {
    return this.httpService.get( 'api/instruments/v1/providers');
  }

  getInstrumentsList(provider: string): Promise<InstrumentResponse> {
    return firstValueFrom(this.httpService.get(`api/instruments/v1/instruments?provider=${provider}`));
  }

  getCountBack(instrumentId: string, provider: string): Observable<any> {
    return this.httpService.get<{ data: BarData[] }>(`api/bars/v1/bars/count-back?instrumentId=${instrumentId}&provider=${provider}&interval=1&periodicity=minute&barsCount=10`).pipe(map((response) => response?.data ));
}

}
