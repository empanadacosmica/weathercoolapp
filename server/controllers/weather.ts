import * as weather from 'openweathermap-js';


export default class WeatherCtrl {



  byName = (req, res) => {

    let city = req.query.name;


    weather.defaults({
      appid: '7ce20399c4214442464480835e10863a',
      method: 'name',
      location: city,
      format: 'JSON',
      accuracy: 'accurate',
      units: 'metric'
    });

    weather.current(function(err, data) {
      if (!err)
        res.status(200).json(data);
      else
        console.error(err.message);
    });

  }

}
