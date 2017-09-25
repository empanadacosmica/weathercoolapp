import * as weather from 'openweathermap-js';

export default class WeatherCtrl {

  /**
   * Init defaults
   */
  constructor() {
    let api_key = '7ce20399c4214442464480835e10863a'; // TODO: replace this for a env var
    weather.defaults({
      appid: api_key,
      format: 'JSON',
      units: 'metric'
    });
  }


  /**
   * Check Weather by city name
   * @param req
   * @param res
   * @returns {Promise<*>|JSON}
     */
  byName = (req, res) => {

     if(!req.query.name) {
      return res.status(400).json({error: 'there is no city to search'});
    }

    let city = decodeURIComponent(req.query.name);


    weather.current({method: 'city', location: city },function(err, data) {
      if (!err) {
        res.status(200).json(data);
      } else {
        res.status(404).json(err);
      }
    });

  }

}
