export default class Settings {
    constructor() {
        this.reset()
    }

    reset() {
        this.gradient_to_light = .2
        this.shadow_to_face = .08
        this.shadow_to_light = .08
        this.light_x = 420
        this.light_y = 0
        this.lighten_amp = .45
        this.interval_value = 100
    }
}
