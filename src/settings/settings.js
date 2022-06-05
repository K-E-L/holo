export default class Settings {
    constructor(
        gradient_to_light = .2,
        shadow_to_face = .08,
        shadow_to_light = .08,
        light_x = 420,
        light_y = 0,
        lighten_amp = .45
    ) {
        this.gradient_to_light = gradient_to_light
        this.shadow_to_face = shadow_to_face
        this.shadow_to_light = shadow_to_light
        this.light_x = light_x
        this.light_y = light_y
        this.lighten_amp = lighten_amp
    }
}
