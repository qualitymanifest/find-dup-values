// Not using get/set for perf and naming reasons https://jsperf.com/data-vs-accessor-vs-getter-setter/2

export type ValuePaths = {
  [key: string]: number;
};

export class Value {
  private total = 1;
  private paths: ValuePaths;
  constructor(private data: string | number, path: string) {
    this.paths = { [path]: 1 };
  }
  getData() {
    return this.data;
  }
  getTotal() {
    return this.total;
  }
  getPaths() {
    return this.paths;
  }
  addPath(path: string) {
    if (this.paths[path]) {
      this.paths[path] += 1;
    } else {
      this.paths[path] = 1;
    }
    this.total += 1;
  }
}
