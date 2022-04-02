import Holo from './holo/holo.js'

let loaded = false
const video = document.querySelector('#video')
const displaySize = {
    width: window.innerWidth,
    height: window.innerHeight
}

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

async function loadModels() {
    await faceapi.nets.tinyFaceDetector.load('/models/tiny_face_detector')
    await faceapi.nets.faceLandmark68Net.load('/models/face_landmark_68')

    const load = document.getElementById('loading')
    load.innerHTML = 'loaded successfully!'

    loaded = true
}

video.addEventListener('play', () => {
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks()
        const resizedDetections = faceapi.resizeResults(detections, displaySize)

        // face outside of screen height and width
        if (resizedDetections[0] === undefined) {
            return
        }

        const elements = document.querySelectorAll('.holo')
        elements.forEach(function(element) {
            const holo = new Holo(element, resizedDetections)
            
            element.style.backgroundImage = holo.getGradiant()
            element.style.boxShadow = holo.getShadow()
        })
    }, 100)

    if (! loaded) {
        loadModels()
    }
})
