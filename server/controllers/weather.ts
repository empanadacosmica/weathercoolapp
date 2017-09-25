import * as weather from 'openweathermap-js';
let api_key = '7ce20399c4214442464480835e10863a'; // TODO: replace this for a env var

export default class WeatherCtrl {

  byName = (req, res) => {

     if(!req.query.name) {
      return res.status(400).json({error: 'there is no city to search'});
    }

    let city = decodeURIComponent(req.query.name);

    weather.defaults({
      appid: api_key,
      method: 'name',
      location: city,
      format: 'JSON',
      accuracy: 'accurate',
      units: 'metric'
    });

    weather.current(function(err, data) {
      if (!err) {
        res.status(200).json(data);
      } else {
        res.status(404).json(err);
      }
    });

  }

}
