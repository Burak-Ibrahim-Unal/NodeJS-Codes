const https = require("https");
const axios = require("axios");
const myApiKey = "Type your api key here"; // Type your api key here

function findCapitalWeather(country) {
  axios
    .get("https://restcountries.com/v3.1/name/"+country)
    .then((result) => {
      const Country = result.data[0];
      //console.log(Country);
      //console.log(Country.borders[4]);
      //console.log(Country.currencies.TRY.name);
      const latitudeOfCountry = Country.latlng[0];
      const longtitudeOfCountry = Country.latlng[1];
      //console.log(`latitude: ${latitudeOfCountry} , longtitude: ${longtitudeOfCountry}`);
      const capitalOfCountry = Country.capital[0];
      //console.log(capitalOfCountry);

      //axios.get("https://api.openweathermap.org/data/2.5/weather?q=ankara&appid=35a653c7958df3c22ed1e33ba24f58cd").then(res => {
      axios
        .get(
          "https://api.openweathermap.org/data/2.5/weather?q=" +
            capitalOfCountry +
            "&appid="+myApiKey+"&units=metric"
        )
        .then((res) => {
          //console.log(res.data);
          console.log(
            `Today, ${capitalOfCountry} is ${res.data.main.temp} Celcius and the Weather is ${res.data.weather[0].description}`
          );
        });
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports = findCapitalWeather;