const gar = require("gar");
const { red } = require("colors/safe");

const handleArgs = (args) => {
    if (!args) {
        args = gar(process.argv.slice(2));
    }
    else {
        args = gar(args);
    }
    if (!args.dir) {
        console.log(red("Please provide a directory to start from with the --dir option"));
        return;
    }
    return args;
}

module.exports = handleArgs;