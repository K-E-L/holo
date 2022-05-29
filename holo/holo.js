import Gradient from '../gradient/gradient.js'
import Shadow from '../shadow/shadow.js'
import Face from '../face/face.js'

export default class Holo {
    constructor(element, resizedDetections, light, settings) {
        this.element = element
        
        this.rect = this.element.getBoundingClientRect()

        this._dimensions = {
            x: this.rect.left + (this.element.offsetWidth / 2),
            y: this.rect.top + (this.element.offsetHeight / 2)
        }

        this.face = new Face(resizedDetections)

        this.light = light

        this.settings = settings
    }

    get dimensions() {
        return this._dimensions
    }
    
    getGradient() {
        const gradient = new Gradient(this.element, this.face, this.light, this.dimensions, this.settings)

        return `radial-gradient(farthest-corner at ${gradient.dimensions.x}px ${gradient.dimensions.y}px, ${gradient.lightened_background_color} 0%, ${gradient.background_color} 100%)`
    }

    getShadow(to_face, to_light) {
        const shadow = new Shadow(this.element, this.face, this.light, this.dimensions, this.settings)

        return `${shadow.dimensions.x}px ${shadow.dimensions.y}px 13px black`
    }
}
