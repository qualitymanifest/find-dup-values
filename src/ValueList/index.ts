import "colors";

import { Value } from "../Value";

export class ValueList {
  list: Value[] = [];
  constructor() {}
  getValue(value: string): Value | null {
    for (let v of this.list) {
      if (v.getData() === value) {
        return v;
      }
    }
    return null;
  }
  addValue(data: string, type: string, path: string): void {
    const v = this.getValue(data);
    if (v) {
      v.addPath(path);
    } else {
      this.list.push(new Value(data, type, path));
    }
  }
  addValues(values: string[], type: string, path: string): void {
    values.forEach(value => {
      this.addValue(value, type, path);
    });
  }
  removeSingles(): void {
    this.list = this.list.filter(v => v.getTotal() > 1);
  }
  print(): void {
    this.list = this.list.sort((a, b) => {
      return a.getTotal() - b.getTotal();
    });
    this.list.forEach(v => {
      console.log(`${v.getType()}: ${v.getData()}`.cyan.bold);
      const paths = v.getPathList();
      for (let [path, amount] of Object.entries(paths)) {
        console.log(`    ${path} ` + `${amount}`.yellow.bold);
      }
      console.log(`TOTAL: ${v.getTotal()}`.red.bold);
    });
  }
}
