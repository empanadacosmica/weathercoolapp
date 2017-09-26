import * as weather from 'openweathermap-js';
import * as GoogleImages from 'google-images';
import * as Async from 'async';
import * as _ from 'lodash';
import * as moment from 'moment';


let mock = false;

export default class WeatherCtrl {
  /**
   * Init defaults
   */
  images: any = [];

  constructor() {

    let google = '014732945328213571568:nxikwjlukmk';
    let credential = 'AIzaSyDVaR26wt2QOZ8fuB1wkVrDyZDSf5KE9N4';

    this.images = new GoogleImages(google, credential);

    let api_key = '7ce20399c4214442464480835e10863a'; // TODO: replace this for a env var
    weather.defaults({
      appid: api_key,
      format: 'JSON',
      units: 'metric',
      cnt: 20
    });
  }


  /**
   * Check Weather by city name
   * @param req
   * @param res
   * @returns {Promise<*>|JSON}
     */
  byName = (req, res) => {

    let img1 = [{"type":"image/jpeg","width":800,"height":450,"size":42256,"url":"https://www.japan-guide.com/thumb/XYZeXYZe3009_375.jpg","thumbnail":{"url":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTauo_aZQVmevBs2yr2PjCugoNGpya5lYE1Qe8tlLYH1yU_C_7GY30330c","width":143,"height":80},"description":"Casa en Alquiler en Córdoba | Goplaceit","parentPage":"https://www.goplaceit.com/ar/propiedad/arriendo/casa/cordoba/2504314-alquiler-de-casa-villa-belgrano"},{"type":"image/jpeg","width":770,"height":437,"size":76601,"url":"https://d232ndqmwsmedi.cloudfront.net/-34512045.jpg","thumbnail":{"url":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQsSCzgeVeD1zlGCt_k4sZLnQrRktUciU29pfhcEN9xFJssgTrN041Asyz","width":142,"height":81},"description":"Venta Terrenos en Villa Belgrano, Córdoba (293)- iCasas.com.ar","parentPage":"https://www.icasas.com.ar/inmueble/390407"},{"type":"image/jpeg","width":557,"height":418,"size":31343,"url":"http://staticcl1.lavozdelinterior.com.ar/files/imagecache/ficha_aviso_628_418_sc/avisos/aviso_casa/aviso-casa--930310.JPG","thumbnail":{"url":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ_ORdU5eXtGTw5iCCuRnsA0amT9kAEFyHsL84Fz2jLNQlp3KhwLVCMhhT","width":133,"height":100},"description":"VILLA BELGRANO - CASA EN VENTA 3 DORMITORIOS","parentPage":"http://www.clasificadoslavoz.com.ar/avisos/casas/486771/casa-venta-3-dorm-b%C2%BA-villa-belgrano.html"}];
    let img2 = [{"type":"image/jpeg","width":800,"height":450,"size":42256,"url":"http://goplaceit.s3.amazonaws.com/propiedades/argentina/jbsrur/28659491726194562098198097423411693910743064814241641971704882039786547189201-960x720.jpg","thumbnail":{"url":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTauo_aZQVmevBs2yr2PjCugoNGpya5lYE1Qe8tlLYH1yU_C_7GY30330c","width":143,"height":80},"description":"Casa en Alquiler en Córdoba | Goplaceit","parentPage":"https://www.goplaceit.com/ar/propiedad/arriendo/casa/cordoba/2504314-alquiler-de-casa-villa-belgrano"},{"type":"image/jpeg","width":770,"height":437,"size":76601,"url":"https://d232ndqmwsmedi.cloudfront.net/-34512045.jpg","thumbnail":{"url":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQsSCzgeVeD1zlGCt_k4sZLnQrRktUciU29pfhcEN9xFJssgTrN041Asyz","width":142,"height":81},"description":"Venta Terrenos en Villa Belgrano, Córdoba (293)- iCasas.com.ar","parentPage":"https://www.icasas.com.ar/inmueble/390407"},{"type":"image/jpeg","width":557,"height":418,"size":31343,"url":"http://staticcl1.lavozdelinterior.com.ar/files/imagecache/ficha_aviso_628_418_sc/avisos/aviso_casa/aviso-casa--930310.JPG","thumbnail":{"url":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ_ORdU5eXtGTw5iCCuRnsA0amT9kAEFyHsL84Fz2jLNQlp3KhwLVCMhhT","width":133,"height":100},"description":"VILLA BELGRANO - CASA EN VENTA 3 DORMITORIOS","parentPage":"http://www.clasificadoslavoz.com.ar/avisos/casas/486771/casa-venta-3-dorm-b%C2%BA-villa-belgrano.html"}];

    if(!req.query.name) {
      return res.status(400).json({error: 'there is no city to search'});
    }

    let city = decodeURIComponent(req.query.name);
    let response: any = {};


    // Async calls
    /**
     * Get forecast for tomorrow and next day
     * @param callback
     */
    function forecast(callback) {
      weather.forecast({method: 'city', location: city }, (err, data) => {
        //if there is an error, throw callback
        if(data.body) {
          let body = JSON.parse(data.body);
          if(body.cod === '404') {
            return callback({error: data});
          }
        }

        let foreCastList = data.list;

        //create day objects to get prom
        let tomorrow = {
            list: [],
            date: 'Tomorrow',
            temp: 0,
            temp_max: 0,
            temp_min: 0,
            description: ''
          },
          pastTomorrow = {
            list: [],
            date: '',
            temp: 0,
            temp_max: 0,
            temp_min: 0,
            description: ''
          };

        let now = moment().format();
        now = now.slice(0, now.indexOf('T'));


        //since the openweather only deliver you the forecast for free only by hour, save the hole data
        _.each(foreCastList, (w) => {

          if(moment(w.dt * 1000).from(now) === 'in a day') {
            tomorrow.temp += w.main.temp;

            if(tomorrow.temp_max < w.main.temp_max) {
              tomorrow.temp_max = w.main.temp_max;
            }
            if(!tomorrow.temp_min) {
              tomorrow.temp_min = w.main.temp_min;
            }
            if(tomorrow.temp_min > w.main.temp_min) {
              tomorrow.temp_min = w.main.temp_min;
            }
            tomorrow.list.push(w);
          }

          if(moment(w.dt * 1000).from(now) === 'in 2 days') {
            pastTomorrow.date = moment(w.dt * 1000).format('dddd');
            pastTomorrow.temp += w.main.temp;
            if(pastTomorrow.temp_max < w.main.temp_max) {
              pastTomorrow.temp_max = w.main.temp_max;
            }
            if(!pastTomorrow.temp_min) {
              pastTomorrow.temp_min = w.main.temp_min;
            }
            if(pastTomorrow.temp_min > w.main.temp_min) {
              pastTomorrow.temp_min = w.main.temp_min;
            }
            pastTomorrow.list.push(w);
          }
        });

        // create the correct format

        let t = {
          description: tomorrow.list[Math.floor(tomorrow.list.length / 2)].weather[0].main,
          date: tomorrow.date,
          temp : tomorrow.temp / tomorrow.list.length,
          temp_max : tomorrow.temp_max,
          temp_min : tomorrow.temp_min,
        };


        let pt = {
          description: pastTomorrow.list[Math.floor(pastTomorrow.list.length / 2)].weather[0].main,
          date: pastTomorrow.date,
          temp : pastTomorrow.temp / pastTomorrow.list.length,
          temp_max : pastTomorrow.temp_max ,
          temp_min : pastTomorrow.temp_min ,
        };

        callback(err, {forecast: [t, pt]});
      });
    }

    /**
     * Get Current weather
     * @param callback
     */
    function current(callback) {
      weather.current({method: 'city', location: city }, (err, data) => {
        if(data.body) {
          let body = JSON.parse(data.body);
          if(body.cod === '404') {
            return callback({error: data});
          }
        }
        callback(err, {weather: data});
      });
    }
    // Async calls

    Async.parallel([forecast, current], (err, data) => {
      if (err) {
        return res.status(404).json({message: 'something goes wrong', error: err});
      } else {

        let weather = _.find(data, 'weather');
        let forecast = _.find(data, 'forecast');

        response = {
          weather: weather ? weather.weather : undefined,
          forecast: forecast ? forecast.forecast : undefined,
        };


        if (mock) {
          // mock images
          response.images = Math.random() > 0.5 ? img1 : img2;
          res.status(200).json(response);
        } else {
          // search images
          this.images.search(response.weather.name + ' ' + response.weather.sys.country, {
            size: 'large',
            safe: 'high',
          }).then(image => {
            response.images = image.splice(0, 3);
            res.status(200).json(response);
          }, () => {
            res.status(200).json(response);
          });
        }
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

    let img1 = [{"type":"image/jpeg","width":800,"height":450,"size":42256,"url":"https://www.japan-guide.com/thumb/XYZeXYZe3009_375.jpg","thumbnail":{"url":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTauo_aZQVmevBs2yr2PjCugoNGpya5lYE1Qe8tlLYH1yU_C_7GY30330c","width":143,"height":80},"description":"Casa en Alquiler en Córdoba | Goplaceit","parentPage":"https://www.goplaceit.com/ar/propiedad/arriendo/casa/cordoba/2504314-alquiler-de-casa-villa-belgrano"},{"type":"image/jpeg","width":770,"height":437,"size":76601,"url":"https://d232ndqmwsmedi.cloudfront.net/-34512045.jpg","thumbnail":{"url":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQsSCzgeVeD1zlGCt_k4sZLnQrRktUciU29pfhcEN9xFJssgTrN041Asyz","width":142,"height":81},"description":"Venta Terrenos en Villa Belgrano, Córdoba (293)- iCasas.com.ar","parentPage":"https://www.icasas.com.ar/inmueble/390407"},{"type":"image/jpeg","width":557,"height":418,"size":31343,"url":"http://staticcl1.lavozdelinterior.com.ar/files/imagecache/ficha_aviso_628_418_sc/avisos/aviso_casa/aviso-casa--930310.JPG","thumbnail":{"url":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ_ORdU5eXtGTw5iCCuRnsA0amT9kAEFyHsL84Fz2jLNQlp3KhwLVCMhhT","width":133,"height":100},"description":"VILLA BELGRANO - CASA EN VENTA 3 DORMITORIOS","parentPage":"http://www.clasificadoslavoz.com.ar/avisos/casas/486771/casa-venta-3-dorm-b%C2%BA-villa-belgrano.html"}];
    let img2 = [{"type":"image/jpeg","width":800,"height":450,"size":42256,"url":"http://goplaceit.s3.amazonaws.com/propiedades/argentina/jbsrur/28659491726194562098198097423411693910743064814241641971704882039786547189201-960x720.jpg","thumbnail":{"url":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTauo_aZQVmevBs2yr2PjCugoNGpya5lYE1Qe8tlLYH1yU_C_7GY30330c","width":143,"height":80},"description":"Casa en Alquiler en Córdoba | Goplaceit","parentPage":"https://www.goplaceit.com/ar/propiedad/arriendo/casa/cordoba/2504314-alquiler-de-casa-villa-belgrano"},{"type":"image/jpeg","width":770,"height":437,"size":76601,"url":"https://d232ndqmwsmedi.cloudfront.net/-34512045.jpg","thumbnail":{"url":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQsSCzgeVeD1zlGCt_k4sZLnQrRktUciU29pfhcEN9xFJssgTrN041Asyz","width":142,"height":81},"description":"Venta Terrenos en Villa Belgrano, Córdoba (293)- iCasas.com.ar","parentPage":"https://www.icasas.com.ar/inmueble/390407"},{"type":"image/jpeg","width":557,"height":418,"size":31343,"url":"http://staticcl1.lavozdelinterior.com.ar/files/imagecache/ficha_aviso_628_418_sc/avisos/aviso_casa/aviso-casa--930310.JPG","thumbnail":{"url":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ_ORdU5eXtGTw5iCCuRnsA0amT9kAEFyHsL84Fz2jLNQlp3KhwLVCMhhT","width":133,"height":100},"description":"VILLA BELGRANO - CASA EN VENTA 3 DORMITORIOS","parentPage":"http://www.clasificadoslavoz.com.ar/avisos/casas/486771/casa-venta-3-dorm-b%C2%BA-villa-belgrano.html"}];


    if(!req.query.latitude && !req.query.longitude) {
      return res.status(400).json({error: 'there is no coord valid to search'});
    }

    let latitude = decodeURIComponent(req.query.latitude);
    let longitude = decodeURIComponent(req.query.longitude);


    let response: any;



    // Async calls
    /**
     * Get forecast for tomorrow and next day
     * @param callback
     */
    function forecast(callback) {
      weather.forecast({method: 'coord', coord: {lat: latitude, lon: longitude}}, (err, data) => {
        //if there is an error, throw callback
        if(data.body) {
          let body = JSON.parse(data.body);
          if(body.cod === '404') {
            return callback({error: data});
          }
        }

        let foreCastList = data.list;

        //create day objects to get prom
        let tomorrow = {
            list: [],
            date: 'Tomorrow',
            temp: 0,
            temp_max: 0,
            temp_min: 0,
            description: ''
          },
          pastTomorrow = {
            list: [],
            date: '',
            temp: 0,
            temp_max: 0,
            temp_min: 0,
            description: ''
          };

        let now = moment().format();
        now = now.slice(0, now.indexOf('T'));


        //since the openweather only deliver you the forecast for free only by hour, save the hole data
        _.each(foreCastList, (w) => {

          if(moment(w.dt * 1000).from(now) === 'in a day') {
            tomorrow.temp += w.main.temp;

            if(tomorrow.temp_max < w.main.temp_max) {
              tomorrow.temp_max = w.main.temp_max;
            }
            if(!tomorrow.temp_min) {
              tomorrow.temp_min = w.main.temp_min;
            }
            if(tomorrow.temp_min > w.main.temp_min) {
              tomorrow.temp_min = w.main.temp_min;
            }
            tomorrow.list.push(w);
          }

          if(moment(w.dt * 1000).from(now) === 'in 2 days') {
            pastTomorrow.date = moment(w.dt * 1000).format('dddd');
            pastTomorrow.temp += w.main.temp;
            if(pastTomorrow.temp_max < w.main.temp_max) {
              pastTomorrow.temp_max = w.main.temp_max;
            }
            if(!pastTomorrow.temp_min) {
              pastTomorrow.temp_min = w.main.temp_min;
            }
            if(pastTomorrow.temp_min > w.main.temp_min) {
              pastTomorrow.temp_min = w.main.temp_min;
            }
            pastTomorrow.list.push(w);
          }
        });

        // create the correct format

        let t = {
          description: tomorrow.list[Math.floor(tomorrow.list.length / 2)].weather[0].main,
          date: tomorrow.date,
          temp : tomorrow.temp / tomorrow.list.length,
          temp_max : tomorrow.temp_max,
          temp_min : tomorrow.temp_min,
        };


        let pt = {
          description: pastTomorrow.list[Math.floor(pastTomorrow.list.length / 2)].weather[0].main,
          date: pastTomorrow.date,
          temp : pastTomorrow.temp / pastTomorrow.list.length,
          temp_max : pastTomorrow.temp_max ,
          temp_min : pastTomorrow.temp_min ,
        };

        callback(err, {forecast: [t, pt]});
      });
    }

    /**
     * Get Current weather
     * @param callback
     */
    function current(callback) {
      weather.current({method: 'coord', coord: {lat: latitude, lon: longitude}}, (err, data) => {
        if(data.body) {
          let body = JSON.parse(data.body);
          if(body.cod === '404') {
            return callback({error: data});
          }
        }
        callback(err, {weather: data});
      });
    }
    // Async calls

    Async.parallel([forecast, current], (err, data) => {
      if (err) {
        return res.status(404).json({message: 'something goes wrong', error: err});
      } else {

        let weather = _.find(data, 'weather');
        let forecast = _.find(data, 'forecast');

        response = {
          weather: weather ? weather.weather : undefined,
          forecast: forecast ? forecast.forecast : undefined,
        };


        if (mock) {
          // mock images
          response.images = Math.random() > 0.5 ? img1 : img2;
          res.status(200).json(response);
        } else {
          // search images
          this.images.search(response.weather.name + ' ' + response.weather.sys.country, {
            size: 'large',
            safe: 'high',
          }).then(image => {
            response.images = image.splice(0, 3);
            res.status(200).json(response);
          }, () => {
            res.status(200).json(response);
          });
        }
      }
    });
  }

}
