import Holo from '../holo/holo.js'
import Light from '../light/light.js'
import Settings from '../settings/settings.js'

class HoloGlobal {
    constructor() {
        this.loadModels()
        
        this.video = this.initializeVideo()        
        this.settings = new Settings()
        this.displaySize = { width: window.innerWidth, height: window.innerHeight }

        this.start()
    }

    initializeVideo() {
        const video = this.createVideoElement()
        document.body.prepend(video)
        this.startVideo()

        return video
    }

    createVideoElement() {
        const video = document.createElement('video');
        video.muted = true        
        video.playsinline = true        
        video.autoplay = true
        video.height = window.innerHeight
        video.width = window.innerWidth
        video.style.position = 'fixed'
        video.style.visibility = 'hidden'
        video.style.width = '100%'
        
        return video
    }
    
    startVideo() {
        navigator.mediaDevices.getUserMedia({ video: {} }).then((stream) => {this.video.srcObject = stream}, (err) => console.error(err))
    }

    async loadModels() {
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

    start() {
        console.log('here', this.video)
        this.video.addEventListener('play', () => {
            console.log('yup')
            setInterval(async () => {
                console.log('sup')
                const detections = await faceapi.detectAllFaces(this.video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks()
                const resizedDetections = faceapi.resizeResults(detections, this.displaySize)

                console.log(resizedDetections)

                // face outside of screen height and width
                if (resizedDetections[0] === undefined) {
                    return
                }

                const light = new Light(this.settings.light_x, this.settings.light_y)

                const elements = document.querySelectorAll('.holo')
                elements.forEach((element) => {
                    const holo = new Holo(element, resizedDetections, light, this.settings)
                    element.style.backgroundImage = holo.getGradient()
                    element.style.boxShadow = holo.getShadow()
                })
            }, 100)
        })
        this.video.muted = true
        this.video.play()
    }
}
export const global = new HoloGlobal()
