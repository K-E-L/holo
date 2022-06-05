export default class Shadow {
    constructor(element, face, light, holo, settings) {
        this.element = element
        
        this.face = face

        this.light = light
        this.holo = holo

        this.settings = settings

        this._dimensions = {x: 0, y: 0}
    }

    relativeToFace(amp) {
        this._dimensions.x += amp * (this.face.dimensions.x * (this.element.offsetWidth / window.innerWidth) - (this.element.offsetWidth / 2))
        
        this._dimensions.x += amp * (this.face.dimensions.y * (this.element.offsetHeight / window.innerHeight) - (this.element.offsetHeight / 2))
        
        return this
    }

    relativeToLight(amp) {
        this._dimensions.x += amp * (this.light.dimensions.x - this.holo.x) * this.face.width * -.0002
        this._dimensions.y += amp * (this.light.dimensions.y - this.holo.y) * this.face.height * -.0002
        return this
    }
    
    get dimensions() {
        return this.relativeToFace(this.settings.shadow_to_face).relativeToLight(this.settings.shadow_to_light)._dimensions
    }
}
