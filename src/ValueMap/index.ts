import "colors";

import { Value, ValuePaths } from "../Value";

export interface ValueJSON {
  values: [
    {
      data: string | number;
      total: number;
      paths: ValuePaths;
    }
  ];
  filesProcessed: number;
}

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
  toJSON(min: number): ValueJSON {
    const valueArray = Array.from(this.map.values());
    const sortedValueArray = valueArray.sort((a, b) => {
      return a.getTotal() - b.getTotal();
    });
    const valueJSON: any = { values: [] };
    sortedValueArray.forEach(v => {
      if (v.getTotal() < min) return;
      valueJSON.values.push({
        data: v.getData(),
        total: v.getTotal(),
        paths: v.getPaths()
      });
    });
    return valueJSON;
  }
}
