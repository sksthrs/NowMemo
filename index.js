// Registering Service Worker for making this as PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
    .then((registration) => {
      console.log(`[Main] ServiceWorker registration finished. Scope:${registration.scope}`);
    })
    .catch((reason) => {
      console.log(`[Main] ServiceWorker registratio failed. Reason:${reason}`);
    });
  });
}

document.addEventListener('DOMContentLoaded', (ev) => {
  /** @type {HTMLButtonElement} */
  const clearButton = document.getElementById('text-toolbar-clear')
  /** @type {HTMLButtonElement} */
  const lockButton = document.getElementById('text-toolbar-lock')
  /** @type {HTMLButtonElement} */
  const reverseButton = document.getElementById('text-toolbar-reverse')
  /** @type {HTMLButtonElement} */
  const colorButton = document.getElementById('text-toolbar-color')
  /** @type {HTMLButtonElement} */
  const boldButton = document.getElementById('text-toolbar-bold')
  /** @type {HTMLButtonElement} */
  const expandButton = document.getElementById('text-toolbar-expand')
  /** @type {HTMLButtonElement} */
  const shrinkButton = document.getElementById('text-toolbar-shrink')
  /** @type {HTMLTextAreaElement} */
  const textArea = document.getElementById('text-content')
  const textAreaStyle = window.getComputedStyle(textArea)

  const STORAGE_KEY = "NowMemo"
  const FONT_SIZE_MAX = 240
  const FONT_SIZE_MIN = 16
  const colorModeClasses = ['black-white', 'white-black', 'yellow-blue']
  const fontWeightClasses = ['weight-normal', 'weight-bold']

  /** @type {Config} */
  let appConfig = loadConfig()
  applyConfig(appConfig)

  function getFontSizeAndUnit() {
    const fontSizeInfo = /^([0-9]+)([^0-9].*)?$/.exec(textAreaStyle.fontSize)
    let fontSizeNow = Math.max(FONT_SIZE_MIN, Math.min(FONT_SIZE_MAX, Number(fontSizeInfo[1])))
    if (isNaN(fontSizeNow)) { fontSizeNow = 36 }
    let fontSizeUnit = fontSizeInfo[2]
    if (fontSizeUnit == null) { fontSizeUnit = '' }
    return { size:fontSizeNow, unit:fontSizeUnit }
  }

  // ========== ========== Configuration ========== ==========

  /**
   * @typedef Config
   * @property {string|undefined} latestText
   * @property {string|undefined} colorMode
   * @property {string|undefined} fontWeight
   * @property {number|undefined} fontSize
   */

  /**
   * Save configuration
   * @param {Config} config configuration
   */
  function saveConfig(config) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
    // console.log(`saved config : ${JSON.stringify(config)}`)
  }

  /**
   * Load configuration
   * @returns {Config} configuration
   */
  function loadConfig() {
    try {
      const text = localStorage.getItem(STORAGE_KEY)
      if (text != null) {
        const obj = JSON.parse(text)
        /** @type {Config} */
        const config = {};
        if (obj.latestText != null && typeof obj.latestText === 'string') {
          config.latestText = obj.latestText
        }
        if (obj.colorMode != null && typeof obj.colorMode === 'string') {
          config.colorMode = obj.colorMode
        }
        if (obj.fontWeight != null && typeof obj.fontWeight === 'string') {
          config.fontWeight = obj.fontWeight
        }
        if (obj.fontSize != null && typeof obj.fontSize === 'number') {
          config.fontSize = Math.max(FONT_SIZE_MIN, Math.min(FONT_SIZE_MAX, obj.fontSize))
        }
        console.log(`config loaded : ${JSON.stringify(config)}`)
        return config
      }
    } catch(err) {}
    console.log(`error in config-load : ${err}`)
    return {}
  }

  /**
   * Apply configuration into this application
   * @param {Config} config 
   */
  function applyConfig(config) {
    if (config == null) return

    if (config.latestText != null && typeof config.latestText === 'string') {
      textArea.value = config.latestText
    }
    if (config.colorMode != null && typeof config.colorMode === 'string') {
      if (colorModeClasses.includes(config.colorMode)) {
        clearColorMode()
        textArea.classList.add(config.colorMode)
      }
    }
    if (config.fontWeight != null && typeof config.fontWeight === 'string') {
      if (fontWeightClasses.includes(config.fontWeight)) {
        clearFontWeight()
        textArea.classList.add(config.fontWeight)
      }
    }
    if (config.fontSize != null && typeof config.fontSize === 'number') {
      textArea.style.fontSize = `${config.fontSize}px`
    }
  }

  function clearColorMode() {
    for (const item of colorModeClasses) {
      textArea.classList.remove(item)
    }
  }

  function clearFontWeight() {
    for (const item of fontWeightClasses) {
      textArea.classList.remove(item)
    }
  }

  // ========== ========== (end of configuration) ========== ==========

  clearButton.addEventListener('click', (ev) => {
    textArea.value = ''
    appConfig.latestText = ''
    saveConfig()
    textArea.focus()
  })

  lockButton.addEventListener('click', (ev) => {
    if (textArea.disabled) {
      textArea.disabled = false
      textArea.focus()
      lockButton.textContent = 'lock'
    } else {
      textArea.blur()
      textArea.disabled = true
      lockButton.textContent = 'unlock'
    }
  })

  reverseButton.addEventListener('click', (ev) => {
    if (textArea.classList.contains('rotate-forward')) {
      textArea.classList.remove('rotate-forward')
      textArea.classList.add('rotate-backward')
    } else if (textArea.classList.contains('rotate-backward')) {
      textArea.classList.remove('rotate-backward')
      textArea.classList.add('rotate-forward')
    } else {
      textArea.classList.add('rotate-forward')
    }
  })

  colorButton.addEventListener('click', (ev) => {
    const len = colorModeClasses.length
    for (let i=0 ; i<len ; i++) {
      if (textArea.classList.contains(colorModeClasses[i])) {
        textArea.classList.remove(colorModeClasses[i])
        const newClass = colorModeClasses[(i+1) % len]
        textArea.classList.add(newClass)
        appConfig.colorMode = newClass
        saveConfig(appConfig)
        // console.log(`[${i}] remove ${colorModeClasses[i]} add ${colorModeClasses[(i+1) % len]}`)
        break
      }
    }
  })

  boldButton.addEventListener('click', (ev) => {
    const len = fontWeightClasses.length
    for (let i=0 ; i<len ; i++) {
      if (textArea.classList.contains(fontWeightClasses[i])) {
        textArea.classList.remove(fontWeightClasses[i])
        const newClass = fontWeightClasses[(i+1) % len]
        textArea.classList.add(newClass)
        appConfig.fontWeight = newClass
        saveConfig(appConfig)
        break
      }
    }
  })

  expandButton.addEventListener('click', (ev) => {
    const fontSize = getFontSizeAndUnit()
    const fontSizeCandidate = Math.floor(fontSize.size + 8)
    const fontSizeNext = Math.min(fontSizeCandidate , FONT_SIZE_MAX)
    textArea.style.fontSize = `${fontSizeNext}${fontSize.unit}`
    appConfig.fontSize = fontSizeNext
    saveConfig(appConfig)
  })

  shrinkButton.addEventListener('click', (ev) => {
    const fontSize = getFontSizeAndUnit()
    const fontSizeCandidate = Math.floor(fontSize.size - 8)
    const fontSizeNext = Math.max(fontSizeCandidate , FONT_SIZE_MIN)
    textArea.style.fontSize = `${fontSizeNext}${fontSize.unit}`
    appConfig.fontSize = fontSizeNext
    saveConfig(appConfig)
  })

  textArea.addEventListener('input', (ev) => {
    if (appConfig.latestText !== textArea.value) {
      appConfig.latestText = textArea.value
      saveConfig(appConfig)
    }
  })

  textArea.focus()
})