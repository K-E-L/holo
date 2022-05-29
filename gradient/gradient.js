import lighten from '../helpers/lighten.js'

export default class Gradient {
    constructor(element, face, light, holo, settings) {
        this.element = element
        
        this.face = face

        this.light = light
        this.holo = holo
        this.settings = settings

        this._dimensions = {x: 0, y: 0}

        this.background_color = window.getComputedStyle(this.element).backgroundColor

        this.lightened_background_color = lighten(this.getLighten(.7), this.background_color)
    }

    getLighten(amp) {
        return amp
    }

    relativeToFace() {
        this._dimensions.x += this.face.dimensions.x * (this.element.offsetWidth / window.innerWidth)
        this._dimensions.y += this.face.dimensions.y * (this.element.offsetHeight / window.innerHeight)
        return this
    }

    relativeToLight(amp) {
        this._dimensions.x += amp * (this.light.dimensions.x - this.holo.x) * this.face.width * .005
        this._dimensions.y += amp * (this.light.dimensions.y - this.holo.y) * this.face.height * .005
        return this
    }

    get dimensions() {
        return this.relativeToFace().relativeToLight(this.settings.gradient_to_light)._dimensions
    }
}
