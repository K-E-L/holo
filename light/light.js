export default class Light {
    constructor(_x=600, _y=300) {
        this._dimensions = {x: _x, y: _y}
    }
    get dimensions() {
        return this._dimensions
    }
}
