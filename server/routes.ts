import * as express from 'express';
import WeatherCtrl from './controllers/weather';

export default function setRoutes(app) {

  const router = express.Router();

  const weatherCtrl = new WeatherCtrl();

  router.route('/weather').get(weatherCtrl.test);

  // Apply the routes to our application with the prefix /api
  app.use('/api', router);

}
