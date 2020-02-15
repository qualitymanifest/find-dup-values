// Not using get/set for perf and naming reasons https://jsperf.com/data-vs-accessor-vs-getter-setter/2

export type PathList = {
  [key: string]: number;
};

export class Value {
  private total = 1;
  private pathList: PathList;
  constructor(private data: string | number, path: string) {
    this.pathList = { [path]: 1 };
  }
  getData() {
    return this.data;
  }
  getTotal() {
    return this.total;
  }
  getPathList() {
    return this.pathList;
  }
  addPath(path: string) {
    if (this.pathList[path]) {
      this.pathList[path] += 1;
    } else {
      this.pathList[path] = 1;
    }
    this.total += 1;
  }
}
