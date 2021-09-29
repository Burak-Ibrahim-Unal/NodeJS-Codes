const https = require("https");
const yargs = require("yargs");
const capitalWeather = require("./CapitalWeather");

yargs.command({
  command: "getInfo",
  describe: "Informations of country",
  builder: {
    country: {
      describe: "Please type English name of country",
      demandOption: true,
      type: String,
    },
  },
  handler(argv){
    capitalWeather(argv.country);
  }
});

yargs.parse();

//capitalWeather("spain");
