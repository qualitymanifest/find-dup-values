class Value {
    constructor(value, type, path) {
        this.value = value;
        this.type = type;
        this.paths = { [path]: 1 };
        this.total = 1;
    }
    getValue() {
        return this.value;
    }
    getPaths() {
        return this.paths;
    }
    addPath(path) {
        if (this.paths[path]) {
            this.paths[path] += 1;
        }
        else {
            this.paths[path] = 1;
        }
        this.total += 1;
    }
    getTotal() {
        return this.total;
    }
}

module.exports = Value;