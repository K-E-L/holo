import lighten from '../helpers/lighten.js'

export default class Holo {
    constructor(element, resizedDetections) {
        this.element = element
        this.resizedDetections = resizedDetections
        
        this.rect = this.element.getBoundingClientRect()
        this.light_x = 300
        this.light_y = 415

        this.holo_x = this.rect.left + (this.element.offsetWidth / 2)
        this.holo_y = this.rect.top + (this.element.offsetHeight / 2)

        this.face_x = this.getFaceX()
        this.face_y = this.getFaceY()
    }

    getFaceX() {
        const x = this.resizedDetections[0].alignedRect.box.x
        const width = this.resizedDetections[0].alignedRect.box.width
        return window.innerWidth - (x + (width / 2))
    }

    getFaceY() {
        const y = this.resizedDetections[0].alignedRect.box.y
        const height = this.resizedDetections[0].alignedRect.box.height
        return y + (height / 4)
    }

    getLightScaledX() {
        return this.face_x * (this.element.offsetWidth / window.innerWidth)
    }

    getLightScaledY() {
        return this.face_y * (this.element.offsetHeight / window.innerHeight)
    }

    getLightAmplifiedX(amp) {
        return this.getLightScaledX() + (amp * (this.light_x - this.holo_x))
    }

    getLightAmplifiedY(amp) {
        return this.getLightScaledY() + (amp * (this.light_y - this.holo_y))
    }

    getShadowScaledX() {
        return this.face_x * (this.element.offsetWidth / window.innerWidth) - (this.element.offsetWidth / 2)
    }

    getShadowScaledY() {
        return this.face_y * (this.element.offsetHeight / window.innerHeight) - (this.element.offsetHeight / 2)
    }

    getShadowAmplifiedX(amp) {
        return amp * this.getShadowScaledX() - ((amp / 10) * (this.light_x - this.holo_x))
    }

    getShadowAmplifiedY(amp) {
        return amp * this.getShadowScaledY() - ((amp / 10) * (this.light_y - this.holo_y))
    }

    getGradiant() {
        const light_x_amplified = this.getLightAmplifiedX(.2)
        const light_y_amplified = this.getLightAmplifiedY(.2)

        const background_color = window.getComputedStyle(this.element).backgroundColor
        const background_color_lightened = lighten(.2, background_color)

        return `radial-gradient(farthest-corner at ${light_x_amplified}px ${light_y_amplified}px, ${background_color_lightened} 0%, ${background_color} 100%)`
    }

    getShadow() {
        const shadow_x_amplified = this.getShadowAmplifiedX(.05)
        const shadow_y_amplified = this.getShadowAmplifiedY(.05)

        return `${shadow_x_amplified}px ${shadow_y_amplified}px 13px black`
    }
}
