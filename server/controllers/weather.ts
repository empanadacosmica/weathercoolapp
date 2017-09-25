import * as weather from 'openweathermap-js';


import * as GoogleImages from 'google-images';


export default class WeatherCtrl {
  /**
   * Init defaults
   */
  images: any;

  constructor() {

    let google = '014732945328213571568:nxikwjlukmk';
    let credential = 'AIzaSyAMhBc7GauRAgmGTYYXIVWqk4D-2hc-zIg';

    this.images = new GoogleImages(google, credential);

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
    let response: any;

    // search weather
    weather.current({method: 'city', location: city }, (err, data) => {
      if (!err) {

        response = {
          weather: data
        };

        if(data.body) {
          let body = JSON.parse(data.body);
            if(body.cod === '404') {
            return res.status(404).json({message: 'something goes wrong', error: data});
          }
        }

        // search images from the place to set it as background
        this.images.search(data.name + ' ' + data.sys.country, {size: 'large', safe: 'high', type: 'photo'}).then(image => {
          response.image = image.splice(0, 3);
          res.status(200).json(response);
        }, () => {
          res.status(200).json(response);
        });

      } else {
        res.status(404).json(err);
      }
    });


  }

  /**
   * Check Weather by coord
   * @param req
   * @param res
   * @returns {Promise<*>|JSON}
   */
  byCoord = (req, res) => {

    if(!req.query.latitude && !req.query.longitude) {
      return res.status(400).json({error: 'there is no coord valid to search'});
    }

    let latitude = decodeURIComponent(req.query.latitude);
    let longitude = decodeURIComponent(req.query.longitude);


    let response: any;


    // search weather
    weather.current({method: 'coord', coord: {lat: latitude, lon: longitude}}, (err, data) => {
      if (!err) {

        response = {
          weather: data
        };

        // search images from the place to set it as background
        this.images.search(data.name + ' ' + data.sys.country, {size: 'large', safe: 'high', type: 'photo'}).then(image => {
          response.image = image.splice(0, 3);
          res.status(200).json(response);
        }, err => {
          res.status(200).json(response);
        });

      } else {
        res.status(404).json(err);
      }
    });

  }

}
