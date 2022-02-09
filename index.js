document.addEventListener('DOMContentLoaded', (ev) => {
  const clearButton = document.getElementById('text-toolbar-clear')
  const lockButton = document.getElementById('text-toolbar-lock')
  const reverseButton = document.getElementById('text-toolbar-reverse')
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