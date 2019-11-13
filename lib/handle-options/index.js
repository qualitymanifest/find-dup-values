const gar = require("gar");
const { red } = require("colors/safe");

const handleOptions = (args) => {
    // Only way args are passed in here is if jest is running the program
    const options = args ? gar(args) : gar(process.argv.slice(2));
    if (!options.dir) {
        console.log(red("Please provide a directory to start from with the --dir option"));
        return;
    }
    return options;
}

module.exports = handleOptions;
