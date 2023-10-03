# Welcome to the Holo project! 

Introducing Holo, a next-gen facial recognition method of styling front-end elements! Using the [face-api](https://github.com/justadudewhohacks/face-api.js/) library, I obtain coordinates of the user's face, a virtual light source, and the element's center to calculate its radial-gradient and shadow. These two attributes were chosen for their malleability as sharp movements / animations based off of facial recognition looks inaccurate and jerky at this point in time. Hopefully in the future these will improve as facial recognition becomes more precise and devices more powerful, being able to run multiple Holo elements without draining battery and limiting performance. I hope you enjoy the Holo project and help push the limits of modern day computing!

## Install via NPM:
```
npm install holo-project
```
## Clone the Repository:
```
git clone https://github.com/K-E-L/holo.git
```
## How to run the example site:
1. Create a directory called "demo" and enter it
```
mkdir demo ; cd demo
```
2. Install the Holo project via NPM
```
npm install holo-project
```
3. Install "live-server" for a simple server
```
npm install live-server -g
```
4. Enter the example site and start the server
```
cd node_modules/holo-project/example_site
```
5. Start the server
```
live-server
```

## How to use Holo in your own project:
1. Install the Holo project via NPM
```
npm install holo-project
```
2. Copy the holo.min.js file into your project directory
```
cp dist/holo.min.js ../../path_to_your_site
```
3. Copy the face-api.min.js file into your project directory from the [face-api-site](https://github.com/justadudewhohacks/face-api.js/blob/master/dist/face-api.min.js)
4. Create a "models" directory in your project directory from the site [face-api-models-site](https://github.com/justadudewhohacks/face-api.js-models)
```
git clone https://github.com/justadudewhohacks/face-api.js-models.git models
```
5. Create a script file in your project directory
```
touch script.js
```
6. Reference the script file and the face-api file in your index.html
```
<script defer src="face-api.min.js"></script>
<script defer type="module" src="script.js"></script>
```
7. Reference the holo file at the top of your script file
```
import './holo.min.js'
```
8. Add the "holo" class name to the elements that you want to have the Holo effect on

## How to update the Settings:
After the "import './holo.min.js' " line in your script.js file, modify the attributes in "holo.global.settings". Such as...
```
holo.global.settings.lighten_amp = .7
```
| Setting | Default | Description |
| --- | --- | --- |
| gradient_to_light | .2 | Radial gradient amplification relative to the Light source |
| shadow_to_face | .08 | Shadow amplification relative to your Face |
| shadow_to_light | .08 | Shadow amplification relative to the Light source |
| light_x | 420 | Light source x coordinate |
| light_y | 0 | Light source y coordinate |
| lighten_amp | .45 | Radial gradient brightness compared to its default color |
| interval_value | 50 | The delay of [setInterval()](https://developer.mozilla.org/en-US/docs/Web/API/setInterval). A lower number means a faster refresh rate and will cause a smoother experience if the device is able to handle the increase in calculations. |
