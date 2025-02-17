export interface InstrumentResponse {
  data: Instrument[],
  paging: {page: number, pages: number, items: number}
}

export interface Instrument {
  id: string,
  symbol: string
}
