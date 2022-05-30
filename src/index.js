import {parse, stringify, toJSON, fromJSON} from 'flatted';
import Holo from '../holo/holo.js'
import Light from '../light/light.js'
import Settings from '../settings/settings.js'
import axios from 'axios'
import * as tiny from '../jsons/tiny.json'

export default function run() {
    let loaded = false
    const video = document.querySelector('#video')
    const displaySize = { width: window.innerWidth, height: window.innerHeight }
    let settings = new Settings()

    video.height = window.innerHeight
    video.width = window.innerWidth

    function startVideo() {
        navigator.getUserMedia(
            { video: {} },
            stream => video.srcObject = stream,
            err => console.error(err)
        )
    }
    startVideo()

    function initializeTitleColor() {
        const title_color = document.querySelector('#title_color')
        const elements = document.querySelectorAll('.title')
        const description = document.querySelectorAll('.description')[0]
        const description2 = document.querySelectorAll('.description')[2]

        const starting_color = '#F56226'
        
        title_color.value = starting_color
        elements.forEach((element) => {
            element.style.backgroundColor = starting_color
        })
        description.style.backgroundColor = starting_color
        description2.style.backgroundColor = starting_color
        
        title_color.addEventListener('input', function (e) {
            elements.forEach((element) => {
                element.style.backgroundColor = e.target.value
            })
            description.style.backgroundColor = e.target.value
            description2.style.backgroundColor = e.target.value
        })
    }
    initializeTitleColor()

    function hookUpSettingToInputElement(setting_name) {
        const element = document.querySelector(`#${setting_name}`)
        element.addEventListener('input', function (e) {
            settings[setting_name] = Number(e.target.value)
        });
        element.value = settings[setting_name]
    }

    function hookUpSettingsToInputElements() {
        const setting_names = ['gradient_to_light', 'shadow_to_face', 'shadow_to_light', 'light_x', 'light_y', 'lighten_amp']
        setting_names.forEach(setting_name => hookUpSettingToInputElement(setting_name))

        const reset = document.querySelector('#reset')        
        reset.addEventListener('click', function (e) {
            settings = new Settings()
            gradient_to_light.value = settings.gradient_to_light
            shadow_to_face.value = settings.shadow_to_face
            shadow_to_light.value = settings.shadow_to_light
            light_x.value = settings.light_x
            light_y.value = settings.light_y
            lighten_amp.value = settings.lighten_amp
        });
    }
    hookUpSettingsToInputElements();

    async function loadModels() {
        try {
            await faceapi.nets.tinyFaceDetector.load('/models/tiny_face_detector')
            await faceapi.nets.faceLandmark68Net.load('/models/face_landmark_68')
            console.log('models loaded successfully!')
        }
        catch(e) {
            console.error('models failed to load')
        }
        return true
    }

    video.addEventListener('play', () => {
        setInterval(async () => {
            if (! loaded) {
                loaded = loadModels()
            }
            else {
                const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks()
                const resizedDetections = faceapi.resizeResults(detections, displaySize)

                // face outside of screen height and width
                if (resizedDetections[0] === undefined) {
                    return
                }

                const light = new Light(settings.light_x, settings.light_y)
                
                const elements = document.querySelectorAll('.holo')
                elements.forEach(function(element) {
                    const holo = new Holo(element, resizedDetections, light, settings)

                    element.style.backgroundImage = holo.getGradient()
                    element.style.boxShadow = holo.getShadow()
                })
            }
        }, 100)
    })
}
run()
