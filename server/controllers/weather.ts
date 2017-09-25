import * as weather from 'openweathermap-js';
import * as GoogleImages from 'google-images';

let mock = true;

export default class WeatherCtrl {
  /**
   * Init defaults
   */
  images: any;

  constructor() {

    let google = '014732945328213571568:nxikwjlukmk';
    let credential = 'AIzaSyA45hNDlmuMHhqJ37WyHEnXqm8TO47aVSY';

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

        if(mock) {
          response.image = [{"type":"image/jpeg","width":800,"height":450,"size":42256,"url":"http://goplaceit.s3.amazonaws.com/propiedades/argentina/jbsrur/28659491726194562098198097423411693910743064814241641971704882039786547189201-960x720.jpg","thumbnail":{"url":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTauo_aZQVmevBs2yr2PjCugoNGpya5lYE1Qe8tlLYH1yU_C_7GY30330c","width":143,"height":80},"description":"Casa en Alquiler en Córdoba | Goplaceit","parentPage":"https://www.goplaceit.com/ar/propiedad/arriendo/casa/cordoba/2504314-alquiler-de-casa-villa-belgrano"},{"type":"image/jpeg","width":770,"height":437,"size":76601,"url":"https://d232ndqmwsmedi.cloudfront.net/-34512045.jpg","thumbnail":{"url":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQsSCzgeVeD1zlGCt_k4sZLnQrRktUciU29pfhcEN9xFJssgTrN041Asyz","width":142,"height":81},"description":"Venta Terrenos en Villa Belgrano, Córdoba (293)- iCasas.com.ar","parentPage":"https://www.icasas.com.ar/inmueble/390407"},{"type":"image/jpeg","width":557,"height":418,"size":31343,"url":"http://staticcl1.lavozdelinterior.com.ar/files/imagecache/ficha_aviso_628_418_sc/avisos/aviso_casa/aviso-casa--930310.JPG","thumbnail":{"url":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ_ORdU5eXtGTw5iCCuRnsA0amT9kAEFyHsL84Fz2jLNQlp3KhwLVCMhhT","width":133,"height":100},"description":"VILLA BELGRANO - CASA EN VENTA 3 DORMITORIOS","parentPage":"http://www.clasificadoslavoz.com.ar/avisos/casas/486771/casa-venta-3-dorm-b%C2%BA-villa-belgrano.html"}];
          res.status(200).json(response);
        }  else {

          this.images.search(data.name + ' ' + data.sys.country, {size: 'large', safe: 'high', type: 'photo'}).then(image => {
            response.image = image.splice(0, 3);
            res.status(200).json(response);
          }, () => {
            res.status(200).json(response);
          });

        }

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

        if(data.body) {


          let body = JSON.parse(data.body);
          if(body && body.cod === '404') {
            return res.status(404).json({message: 'something goes wrong', error: data});
          }
        }


        if(mock) {
          response.image = [{"type":"image/jpeg","width":800,"height":450,"size":42256,"url":"http://goplaceit.s3.amazonaws.com/propiedades/argentina/jbsrur/28659491726194562098198097423411693910743064814241641971704882039786547189201-960x720.jpg","thumbnail":{"url":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTauo_aZQVmevBs2yr2PjCugoNGpya5lYE1Qe8tlLYH1yU_C_7GY30330c","width":143,"height":80},"description":"Casa en Alquiler en Córdoba | Goplaceit","parentPage":"https://www.goplaceit.com/ar/propiedad/arriendo/casa/cordoba/2504314-alquiler-de-casa-villa-belgrano"},{"type":"image/jpeg","width":770,"height":437,"size":76601,"url":"https://d232ndqmwsmedi.cloudfront.net/-34512045.jpg","thumbnail":{"url":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQsSCzgeVeD1zlGCt_k4sZLnQrRktUciU29pfhcEN9xFJssgTrN041Asyz","width":142,"height":81},"description":"Venta Terrenos en Villa Belgrano, Córdoba (293)- iCasas.com.ar","parentPage":"https://www.icasas.com.ar/inmueble/390407"},{"type":"image/jpeg","width":557,"height":418,"size":31343,"url":"http://staticcl1.lavozdelinterior.com.ar/files/imagecache/ficha_aviso_628_418_sc/avisos/aviso_casa/aviso-casa--930310.JPG","thumbnail":{"url":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJ_ORdU5eXtGTw5iCCuRnsA0amT9kAEFyHsL84Fz2jLNQlp3KhwLVCMhhT","width":133,"height":100},"description":"VILLA BELGRANO - CASA EN VENTA 3 DORMITORIOS","parentPage":"http://www.clasificadoslavoz.com.ar/avisos/casas/486771/casa-venta-3-dorm-b%C2%BA-villa-belgrano.html"}];
          res.status(200).json(response);
        }  else {
          // search images from the place to set it as background
          this.images.search(data.name + ' ' + data.sys.country, {
            size: 'large',
            safe: 'high',
            type: 'photo'
          }).then(image => {
            response.image = image.splice(0, 3);
            res.status(200).json(response);
          }, err => {
            res.status(200).json(response);
          });
        }

      } else {
        res.status(404).json(err);
      }
    });

  }

}
