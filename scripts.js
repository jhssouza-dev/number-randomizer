const btnDraw = document.querySelector("#btn-draw")
const btnDrawAgain = document.querySelector("#btn-draw-again")
const btnBack = document.querySelector("#btn-back")

const inputQuantity = document.querySelector("#input-quantity")
const inputMin = document.querySelector("#input-min")
const inputMax = document.querySelector("#input-max")
const inputNoRepeat = document.querySelector("#input-no-repeat")

const errorMessage = document.querySelector("#error-message")
const statusMessage = document.querySelector("#status-message")

const screenForm = document.querySelector("#screen-form")
const screenResult = document.querySelector("#screen-result")
const resultNumbersArea = document.querySelector("#result-numbers")

let lastConfig = null

// ---------------------- DRAW BUTTON ----------------------
btnDraw.addEventListener("click", () => {
  if (btnDraw.disabled) return
  btnDraw.disabled = true

  const data = collectData()
  const validation = validateDraw(data)

  if (!validation.ok) {
    errorMessage.textContent = validation.message
    btnDraw.disabled = false
    return
  }

  errorMessage.textContent = ""
  statusMessage.textContent = "" // esconde mensagem antiga antes de começar a animação

  const numbers = drawNumbers(data)
  lastConfig = data

  screenForm.classList.add("hidden")
  screenResult.classList.remove("hidden")

  const duration = renderResult(numbers)

  setTimeout(() => {
    statusMessage.textContent = "Draw completed successfully."
  }, duration)

  // durante a animação o usuário não pode clicar em "Draw again"
  disableButtonDuringAnimation(btnDrawAgain, duration)

  // reabilita o Draw original (caso o usuário volte depois)
  setTimeout(() => {
    btnDraw.disabled = false
  }, duration)
})

// ---------------- DRAW AGAIN BUTTON -----------------
btnDrawAgain.addEventListener("click", () => {
  if (btnDrawAgain.disabled) return
  if (!lastConfig) return

  // some com a mensagem assim que clicar
  statusMessage.textContent = ""

  const numbers = drawNumbers(lastConfig)

  const duration = renderResult(numbers)

  setTimeout(() => {
    statusMessage.textContent = "Draw completed successfully."
  }, duration)

  disableButtonDuringAnimation(btnDrawAgain, duration)
})

// ---------------- BACK TO START BUTTON --------------
btnBack.addEventListener("click", () => {
  screenResult.classList.add("hidden")
  screenForm.classList.remove("hidden")

  resultNumbersArea.innerHTML = ""
  errorMessage.textContent = ""
  statusMessage.textContent = ""
  lastConfig = null

  inputQuantity.value = 2
  inputMin.value = 1
  inputMax.value = 100
  inputNoRepeat.checked = false

  btnDraw.disabled = false
  btnDrawAgain.disabled = false

  window.scrollTo({ top: 0, behavior: "smooth" })
})

// ===================== FUNCTIONS ============================

function collectData() {
  return {
    quantity: Number(inputQuantity.value),
    min: Number(inputMin.value),
    max: Number(inputMax.value),
    noRepeat: inputNoRepeat.checked
  }
}

function validateDraw(data) {
  if (
    inputQuantity.value.trim() === "" ||
    inputMin.value.trim() === "" ||
    inputMax.value.trim() === ""
  ) {
    return {
      ok: false,
      message: "Please fill in all fields before drawing."
    }
  }

  if (isNaN(data.quantity) || isNaN(data.min) || isNaN(data.max)) {
    return {
      ok: false,
      message: "Please enter valid numeric values."
    }
  }

  if (data.max <= data.min) {
    return {
      ok: false,
      message: "Maximum value must be greater than minimum value."
    }
  }

  if (data.quantity <= 0) {
    return {
      ok: false,
      message: "The quantity of numbers must be greater than zero."
    }
  }

  if (data.noRepeat) {
    const totalPossible = data.max - data.min + 1
    if (data.quantity > totalPossible) {
      return {
        ok: false,
        message:
          "Quantity cannot be greater than the available range when 'do not repeat' is enabled."
      }
    }
  }

  return {
    ok: true,
    message: ""
  }
}

function drawNumbers(data) {
  const numbers = []

  if (!data.noRepeat) {
    for (let i = 0; i < data.quantity; i++) {
      const n = randomNumber(data.min, data.max)
      numbers.push(n)
    }
    return numbers
  }

  const available = []
  for (let n = data.min; n <= data.max; n++) {
    available.push(n)
  }

  for (let i = 0; i < data.quantity; i++) {
    const index = Math.floor(Math.random() * available.length)
    const pick = available.splice(index, 1)[0]
    numbers.push(pick)
  }

  return numbers
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function renderResult(numbers) {
  resultNumbersArea.innerHTML = ""

  let totalMs = 0
  const baseDelay = 80
  const animationDuration = 300

  numbers.forEach((number, index) => {
    const span = document.createElement("span")
    span.textContent = number
    span.classList.add("drawn-number")

    const delay = index * baseDelay
    span.style.animationDelay = `${delay}ms`

    totalMs = delay + animationDuration
    resultNumbersArea.appendChild(span)
  })

  return totalMs + 100
}

function disableButtonDuringAnimation(button, durationMs) {
  button.disabled = true
  setTimeout(() => {
    button.disabled = false
  }, durationMs)
}
