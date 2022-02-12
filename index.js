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
  const clearButton = document.getElementById('text-toolbar-clear')
  const lockButton = document.getElementById('text-toolbar-lock')
  const reverseButton = document.getElementById('text-toolbar-reverse')
  const colorButton = document.getElementById('text-toolbar-color')
  const expandButton = document.getElementById('text-toolbar-expand')
  const shrinkButton = document.getElementById('text-toolbar-shrink')
  const textArea = document.getElementById('text-content')
  const textAreaStyle = window.getComputedStyle(textArea)

  function getFontSizeAndUnit() {
    const fontSizeInfo = /^([0-9]+)([^0-9].*)?$/.exec(textAreaStyle.fontSize)
    let fontSizeNow = Number(fontSizeInfo[1])
    if (isNaN(fontSizeNow)) { fontSizeNow = 36 }
    let fontSizeUnit = fontSizeInfo[2]
    if (fontSizeUnit == null) { fontSizeUnit = '' }
    return { size:fontSizeNow, unit:fontSizeUnit }
  }

  clearButton.addEventListener('click', (ev) => {
    textArea.value = ''
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
    const classes = ['black-white', 'white-black', 'yellow-blue']
    const len = classes.length
    for (let i=0 ; i<len ; i++) {
      if (textArea.classList.contains(classes[i])) {
        textArea.classList.remove(classes[i])
        textArea.classList.add(classes[(i+1) % len])
        console.log(`[${i}] remove ${classes[i]} add ${classes[(i+1) % len]}`)
        break
      }
    }
  })

  expandButton.addEventListener('click', (ev) => {
    const fontSize = getFontSizeAndUnit()
    const fontSizeCandidate = Math.floor(fontSize.size + 8)
    const fontSizeNext = Math.min(fontSizeCandidate , 240)
    textArea.style.fontSize = `${fontSizeNext}${fontSize.unit}`
  })

  shrinkButton.addEventListener('click', (ev) => {
    const fontSize = getFontSizeAndUnit()
    const fontSizeCandidate = Math.floor(fontSize.size - 8)
    const fontSizeNext = Math.max(fontSizeCandidate , 16)
    textArea.style.fontSize = `${fontSizeNext}${fontSize.unit}`
  })

  textArea.focus()
})