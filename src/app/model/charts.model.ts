export interface BarData {
  t: string;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
}


export interface ChartData {
  name: string;
  series: { name: string; value: number; min: number; max: number }[];
}

export interface LineData {
  name: string;
  series: { name: string; value: string }[];
}
