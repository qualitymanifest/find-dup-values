import "colors";

import { Value } from "../Value";

export class ValueList {
  valueMap: Map<string | number, Value> = new Map();
  constructor() {}
  addValue(data: string | number, path: string): void {
    const existingValue = this.valueMap.get(data);
    if (existingValue) {
      existingValue.addPath(path);
    } else {
      this.valueMap.set(data, new Value(data, path));
    }
  }
  addValues(values: string[], path: string): void {
    values.forEach(value => {
      this.addValue(value, path);
    });
  }
  print(): void {
    const valueArray = Array.from(this.valueMap.values());
    const sortedByTotal = valueArray.sort((a, b) => {
      return a.getTotal() - b.getTotal();
    });
    sortedByTotal.forEach(v => {
      if (v.getTotal() < 2) return;
      console.log(`${typeof v.getData()}: ${v.getData()}`.cyan.bold);
      const paths = v.getPathList();
      for (let [path, amount] of Object.entries(paths)) {
        console.log(`    ${path} ` + `${amount}`.yellow.bold);
      }
      console.log(`TOTAL: ${v.getTotal()}`.red.bold);
    });
  }
}
