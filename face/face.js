export default class Face {
    constructor(resizedDetections) {
        this.resizedDetections = resizedDetections
        
        this._dimensions = {
            x: this.setX(),
            y: this.setY()
        }
        this._width = this.setWidth()
        this._height = this.setHeight()
    }

    setX() {
        const x = this.resizedDetections[0].alignedRect.box.x
        const width = this.resizedDetections[0].alignedRect.box.width
        return window.innerWidth - (x + (width / 2))
    }

    setY() {
        const y = this.resizedDetections[0].alignedRect.box.y
        const height = this.resizedDetections[0].alignedRect.box.height
        return y + (height / 4)
    }

    setWidth() {
        return this.resizedDetections[0].alignedRect.box.width
    }

    setHeight() {
        return this.resizedDetections[0].alignedRect.box.height
    }

    get dimensions() {
        return this._dimensions
    }

    get width() {
        return this._width
    }

    get height() {
        return this._height
    }
}

