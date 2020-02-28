'use strict';

(function() {
    const express = require('express');
    const app = express();
    const figlet = require('figlet');
    const axios = require('axios');

    const PORT = process.env.PORT || 7000;

    class Weather_APIs {
        DARK_SKY = '373e5a0ec86d0283e6b028875ee66a2c';
        MAP_BOX = 'pk.eyJ1IjoiYWJoaXNoZWsxMCIsImEiOiJjazc2bG5hOW8wY3dhM2RvMWZtMnUzZGg5In0.DsTkceR9rT-zs2wLmLmUpA';

        async location_trace(placeName) {

            const places = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${placeName}.json?limit=1&access_token=${this.MAP_BOX}`);

            const { coordinates } = { ...places.data.features[0].geometry };
            await this.weather_forecast(coordinates[0], coordinates[1], places.data.features[0].place_name);
        }

        async weather_forecast(longitude, latitude, place) {
            if (!(latitude || longitude)) throw new Error('Please providde latitude and longitude');
            const weather_response = await axios.get(`https://api.darksky.net/forecast/${this.DARK_SKY}/${latitude},${longitude}`);

            console.log(`You are currently in ${place}, today will be a beautiful day with weather ${weather_response.data.hourly.summary} and the temperature is ${this.farenhiteTocelcius(weather_response.data.currently.temperature)} * celcius in that area. Have a nice day !!`.replace(".", ""));
        }

        farenhiteTocelcius(farenhite) {
            return ((farenhite - 32) * 5 / 9).toFixed(2);
        }
    }

    function main(location) {
        let w_a = new Weather_APIs();
        if(!location[2]) {
            console.log('Plaese provide a location');
            process.exit(0);
        }
        w_a.location_trace(location[2])
            .then()
            .catch(error => console.log(error));
    }

    app.listen(PORT, () => {
        figlet('Weather App', (err, data) => {
            if (err) {
                console.dir(err, { colors: true });
                return;
            }
            console.log(data);
        });
        console.log(`Server is listening at PORT : ${PORT}`);
        main(process.argv);
    })
}());