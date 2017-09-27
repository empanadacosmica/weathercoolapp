# Weather Cool App - [Live Demo](https://weathercoolapp.herokuapp.com/)
Weather Cool App is angular and nodejs responsive application done in typescript. By default, the app will try to gather the client geolocation using HTML5 API, with a Google Sensor fallback.  
Additionally, the users can search any city from [Openweathermap API](https://openweathermap.org/api) and it will display a related image from the result gather by the Google Search Image API.

## Tools and technologies used:
* Typescript
* Nodejs
* Angular 4
* Openweathermap API
* Google search image API
* Google geolocation
* HTML5 geolocation

## Prerequisites
1. Install [Node.js](https://nodejs.org) version 8.5
2. Install Angular CLI: `npm i -g @angular/cli`
3. From project root folder install all the dependencies: `npm i`

## Installation
Run `npm install`

## Run
### Development mode
Run `npm run dev`

## Running frontend unit tests
Run `ng test`


## Browser support
This application have been successfully tested in macOSX, linux (archlinux) and windows. Also android and iOS deviced have been tested as well, having an special case for iOS 10 + , make sure to allow geolocation to safari, read more in [this article](https://stackoverflow.com/questions/10422322/location-services-in-mobile-safari-dont-allow-is-saved-forever-even-with-re) 

##### Already tested browser
* Chrome
* Firefox
* Safari
* Internet Explorer 9 , 10 , 11
* Edge

## Deploying in Heroku
Just push this repo to Heroku remote, it will automatically install the dependencies (see the preinstall npm scripts) and launch the app. :)

##### Knowing issues
Sometimes, the Openweathermap API will use throw incorrect the name city. For more information, please read this [article](https://openweathermap.org/faq).

##### Final thoughts
I used the [Openweathermap-js](https://github.com/edpiburkhart/openweathermap-js) lib, but it has a bug so I forked it and fixed it. See [here](https://github.com/empanadacosmica/openweathermap-js)


Enjoy!

