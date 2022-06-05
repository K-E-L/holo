import './holo.min.js'

function initializeTitleColor() {
    const title_color = document.querySelector('#title_color')
    const elements = document.querySelectorAll('.title')
    const description = document.querySelectorAll('.description')[0]
    const description2 = document.querySelectorAll('.description')[2]

    const starting_color = '#F56226'
    
    title_color.value = starting_color
    elements.forEach((element) => {
        element.style.backgroundColor = starting_color
    })
    description.style.backgroundColor = starting_color
    description2.style.backgroundColor = starting_color
    
    title_color.addEventListener('input', function (e) {
        elements.forEach((element) => {
            element.style.backgroundColor = e.target.value
        })
        description.style.backgroundColor = e.target.value
        description2.style.backgroundColor = e.target.value
    })
}

function hookUpSettingToInputElement(setting_name) {
    const element = document.querySelector(`#${setting_name}`)
    element.addEventListener('input', function (e) {
        holo.global.settings[setting_name] = Number(e.target.value)
    });
    element.value = holo.global.settings[setting_name]
}

function hookUpSettingsToInputElements() {
    const setting_names = ['gradient_to_light', 'shadow_to_face', 'shadow_to_light', 'light_x', 'light_y', 'lighten_amp']
    setting_names.forEach(setting_name => hookUpSettingToInputElement(setting_name))

    const reset = document.querySelector('#reset')
    reset.addEventListener('click', function (e) {
        holo.global.settings.reset()
        gradient_to_light.value = holo.global.settings.gradient_to_light
        shadow_to_face.value = holo.global.settings.shadow_to_face
        shadow_to_light.value = holo.global.settings.shadow_to_light
        light_x.value = holo.global.settings.light_x
        light_y.value = holo.global.settings.light_y
        lighten_amp.value = holo.global.settings.lighten_amp
    });
}

initializeTitleColor()
hookUpSettingsToInputElements()

