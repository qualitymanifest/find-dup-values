const { red, green, cyan, yellow } = require("colors/safe");

const Value = require("../Value");

class ValueList {
    constructor() {
        this.list = [];
    }
    getValue(value) {
        for (let v of this.list) {
            if (v.getValue() === value) {
                return v;
            }
        }
        return null;
    }
    addValue(value, type, path) {
        const v = this.getValue(value);
        if (v) {
            v.addPath(path);
        }
        else {
            this.list.push(new Value(value, type, path));
        }
    }
    addValues({ strings, numbers }, path) {
        strings.forEach(value => {
            this.addValue(value, "string", path);
        });
        numbers.forEach(value => {
            this.addValue(value, "number", path)
        });
    }
    removeSingles(value) {
        this.list = this.list.filter(v => v.getTotal() > 1);
    }
    print() {
        this.list = this.list.sort((a, b) => {
            return (a.total > b.total);
        })
        this.list.forEach(v => {
            const value = v.getValue();
            if (v.type === "number") {
                console.log(green.bold(value))
            }
            else {
                console.log(cyan.bold(value));
            }
            const paths = v.getPaths();
            for (let [path, amount] of Object.entries(paths)) {
                console.log(`    ${path} ` + yellow.bold(amount));
            }
            console.log(red.bold(`                      TOTAL: ${v.getTotal()}`));
        });
    }
}

module.exports = ValueList;