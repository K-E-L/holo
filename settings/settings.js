export default class Settings {
    constructor(gradient_to_light=.2, shadow_to_face=.08, shadow_to_light=.08, light_x=600, light_y=300) {
        this.gradient_to_light = gradient_to_light
        this.shadow_to_face = shadow_to_face
        this.shadow_to_light = shadow_to_light
        this.light_x = light_x
        this.light_y = light_y
    }

    resetToDefaults() {
        this.gradient_to_light = .2
        this.shadow_to_face = .08
        this.shadow_to_light = .08
        this.light_x = 600
        this.light_y = 300
    }
}
