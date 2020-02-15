// Not using get/set for perf and naming reasons https://jsperf.com/data-vs-accessor-vs-getter-setter/2

export interface PathList {
  [key: string]: number;
}

export class Value {
  private total = 1;
  private pathList: PathList;
  constructor(private data: string | number, path: string) {
    this.pathList = { [path]: 1 };
  }
  getData(): string | number {
    return this.data;
  }
  getTotal(): number {
    return this.total;
  }
  getPathList(): PathList {
    return this.pathList;
  }
  addPath(path: string): void {
    if (this.pathList[path]) {
      this.pathList[path] += 1;
    } else {
      this.pathList[path] = 1;
    }
    this.total += 1;
  }
}