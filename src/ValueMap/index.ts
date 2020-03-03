import "colors";

import { Value } from "../Value";

export class ValueMap {
  map: Map<string | number, Value> = new Map();
  constructor() {}
  addValue(data: string | number, path: string) {
    const existingValue = this.map.get(data);
    if (existingValue) {
      existingValue.addPath(path);
    } else {
      this.map.set(data, new Value(data, path));
    }
  }
  addValues(values: string[] | number[], path: string) {
    values.forEach((value: string | number) => {
      this.addValue(value, path);
    });
  }
  print() {
    const valueArray = Array.from(this.map.values());
    const sortedByTotal = valueArray.sort((a, b) => {
      return a.getTotal() - b.getTotal();
    });
    sortedByTotal.forEach(v => {
      if (v.getTotal() < 2) return;
      console.log(
        `${typeof v.getData()}: `.cyan.bold + `${v.getData()}`.bgCyan
      );
      const paths = v.getPaths();
      for (let [path, amount] of Object.entries(paths)) {
        console.log(`    ${path} ` + `${amount}`.yellow.bold);
      }
      console.log(`    TOTAL: ${v.getTotal()}`.red.bold);
    });
  }
}
