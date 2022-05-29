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
    const settings = new Settings()

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

    function hookUpSettingsToInputElements() {
        const gradient_to_light = document.querySelector('#gradient_to_light')
        const shadow_to_face = document.querySelector('#shadow_to_face')
        const shadow_to_light = document.querySelector('#shadow_to_light')
        const light_x = document.querySelector('#light_x')
        const light_y = document.querySelector('#light_y')
        const reset = document.querySelector('#reset')
        
        gradient_to_light.addEventListener('input', function (e) {
            settings.gradient_to_light = Number(e.target.value)
        });
        shadow_to_face.addEventListener('input', function (e) {
            settings.shadow_to_face = Number(e.target.value)
        });
        shadow_to_light.addEventListener('input', function (e) {
            settings.shadow_to_light = Number(e.target.value)
        });
        light_x.addEventListener('input', function (e) {
            settings.light_x = Number(e.target.value)
        });
        light_y.addEventListener('input', function (e) {
            settings.light_y = Number(e.target.value)
        });
        reset.addEventListener('click', function (e) {
            settings.resetToDefaults()
            gradient_to_light.value = settings.gradient_to_light
            shadow_to_face.value = settings.shadow_to_face
            shadow_to_light.value = settings.shadow_to_light
            light_x.value = settings.light_x
            light_y.value = settings.light_y
        });
    }
    hookUpSettingsToInputElements();

    async function loadModels() {
        await faceapi.nets.tinyFaceDetector.load('/models/tiny_face_detector')
        await faceapi.nets.faceLandmark68Net.load('/models/face_landmark_68')

        const load = document.getElementById('loading')
        load.innerHTML = 'loaded successfully!'

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
