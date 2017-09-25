export default class WeatherCtrl {

  test = (req, res) => {
    res.status(200).json({ test: 'true' });
  }

}
