import lighten from './helpers/lighten.js'

let loaded = false
const video = document.querySelector('#video')

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
    const displaySize = { width: video.width, height: video.height }
    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks()
        const resizedDetections = faceapi.resizeResults(detections, displaySize)

        if (resizedDetections[0] === undefined) {
            return
        }

        let face_x = getFaceX(resizedDetections[0].alignedRect.box.x, resizedDetections[0].alignedRect.box.width)
        let face_y = getFaceY(resizedDetections[0].alignedRect.box.y, resizedDetections[0].alignedRect.box.height)

        console.log(face_x, face_y)

        let holos = document.querySelectorAll('.holo')
        holos.forEach(function(holo) {
            let rect = holo.getBoundingClientRect()
            
            let holo_x = rect.left + (holo.offsetWidth / 2)
            let holo_y = rect.top + (holo.offsetHeight / 2)

            let light_x_scaled = getLightScaledX(face_x, holo.offsetWidth)
            let light_y_scaled = getLightScaledY(face_y, holo.offsetHeight)

            let light_x_amplified = getLightAmplifiedX(light_x_scaled, holo_x, .2)
            let light_y_amplified = getLightAmplifiedY(light_y_scaled, holo_y, .2)

            if (holo.dataset.background_color === undefined) {
                let background_color = window.getComputedStyle(holo).backgroundColor
                let background_color_lightened = lighten(.20, background_color, false, true)

                holo.dataset.background_color = background_color
                holo.dataset.background_color_lightened = background_color_lightened
            }

            holo.style.background = `radial-gradient(farthest-corner at ${light_x_amplified}px ${light_y_amplified}px, ${holo.dataset.background_color_lightened} 0%, ${holo.dataset.background_color} 100%)`

            let shadow_x_scaled = getShadowScaledX(face_x, holo.offsetWidth, .07)
            let shadow_y_scaled = getShadowScaledY(face_y, holo.offsetHeight, .07)

            let shadow_x_amplified = getShadowAmplifiedX(shadow_x_scaled, holo_x, .002)
            let shadow_y_amplified = getShadowAmplifiedY(shadow_y_scaled, holo_y, .002)

            holo.style.boxShadow = `${shadow_x_amplified}px ${shadow_y_amplified}px 13px black`
        })
    }, 100)

    if (! loaded) {
        loadModels()
    }
})

let light_x = 300
let light_y = 415

function getFaceX(x, width) {
    return window.innerWidth - (x + (width / 2))
}

function getFaceY(y, height) {
    return y + (height / 4)
}

function getLightScaledX(face_x, holo_width) {
    return face_x * (holo_width / window.innerWidth)
}

function getLightScaledY(face_y, holo_height) {
    return face_y * (holo_height / window.innerHeight)
}

function getLightAmplifiedX(radial_x_scaled, holo_x, amp) {
    return radial_x_scaled + (amp * (light_x - holo_x))
}

function getLightAmplifiedY(radial_y_scaled, holo_y, amp) {
    return radial_y_scaled + (amp * (light_y - holo_y))
}

function getShadowScaledX(face_x, holo_width, amp) {
    return amp * (face_x * (holo_width / window.innerWidth) - (holo_width / 2))
}

function getShadowScaledY(face_y, holo_height, amp) {
    return amp * (face_y * (holo_height / window.innerHeight) - (holo_height / 2))
}

function getShadowAmplifiedX(shadow_x_scaled, holo_x, amp) {
    return shadow_x_scaled - (amp * (light_x - holo_x))
}

function getShadowAmplifiedY(shadow_y_scaled, holo_y, amp) {
    return shadow_y_scaled - (amp * (light_y - holo_y))
}
