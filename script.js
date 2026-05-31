// ==============================
// MAIN CONTAINER (ROOT ELEMENT)
// ==============================
const app = document.getElementById("app");

// ==============================
// CREATE CALCULATOR UI CONTAINER
// ==============================
const calculator = document.createElement("section");
calculator.className = "calculator";

// ==============================
// EXPRESSION LINE (FULL EQUATION DISPLAY)
// ==============================
const expressionLine = document.createElement("div");
expressionLine.className = "expression";

// ==============================
// MAIN DISPLAY (CURRENT VALUE)
// ==============================
const display = document.createElement("div");
display.className = "display";
display.textContent = "0";

// ==============================
// STATUS LINE (SHOW ACTIVE OPERATOR)
// ==============================
const statusLine = document.createElement("div");
statusLine.className = "status-line";

// ==============================
// HISTORY SYSTEM (FIXED)
// ==============================
let history = [];

const historyBox = document.createElement("div");
historyBox.className = "history";

function updateHistory() {
  historyBox.innerHTML = "";

  history
    .slice()
    .reverse()
    .forEach((item) => {
      const div = document.createElement("div");
      div.className = "history-item";
      div.textContent = item;

      div.addEventListener("click", () => {
        const result = item.split("=")[1]?.trim();
        if (result) {
          currentValue = result;
          expression = result;
          updateDisplay();
          updateExpression();
        }
      });

      historyBox.appendChild(div);
    });
}

// ==============================
// ADD ELEMENTS TO CALCULATOR
// ==============================
const buttons = document.createElement("div");
buttons.className = "buttons";

// ==============================
// BUTTON CONFIGURATION (DATA-DRIVEN UI)
// ==============================
const buttonLabels = [
  { text: "AC", action: "clear", style: "function" },
  { text: "⌫", action: "delete", style: "function" },
  { text: "%", action: "percent", style: "function" },

  { text: "÷", action: "operator", value: "/", style: "operator" },
  { text: "7", action: "digit", value: "7", style: "number" },
  { text: "8", action: "digit", value: "8", style: "number" },
  { text: "9", action: "digit", value: "9", style: "number" },

  { text: "×", action: "operator", value: "*", style: "operator" },
  { text: "4", action: "digit", value: "4", style: "number" },
  { text: "5", action: "digit", value: "5", style: "number" },
  { text: "6", action: "digit", value: "6", style: "number" },

  { text: "−", action: "operator", value: "-", style: "operator" },
  { text: "1", action: "digit", value: "1", style: "number" },
  { text: "2", action: "digit", value: "2", style: "number" },
  { text: "3", action: "digit", value: "3", style: "number" },

  { text: "+", action: "operator", value: "+", style: "operator" },
  { text: "0", action: "digit", value: "0", style: "number zero" },
  { text: ".", action: "decimal", style: "number" },
  { text: "=", action: "equals", style: "operator" },
];

// ==============================
// STATE VARIABLES
// ==============================
let currentValue = "0";
let previousValue = null;
let operator = null;
let shouldResetScreen = false;
let expression = "";

// ==============================
// DISPLAY FUNCTIONS
// ==============================
function updateDisplay() {
  display.textContent = currentValue;
}

function updateExpression() {
  expressionLine.textContent = expression;
}

function updateStatus() {
  const map = {
    "+": "Addition (+)",
    "-": "Subtraction (−)",
    "*": "Multiplication (×)",
    "/": "Division (÷)",
  };

  statusLine.textContent = operator ? map[operator] : "";
}

// ==============================
// RESET
// ==============================
function resetCalculator() {
  currentValue = "0";
  previousValue = null;
  operator = null;
  shouldResetScreen = false;
  expression = "";

  updateDisplay();
  updateExpression();
  updateStatus();
}

// ==============================
// DIGITS
// ==============================
function appendDigit(digit) {
  if (currentValue === "0" || shouldResetScreen) {
    currentValue = digit;
    shouldResetScreen = false;
  } else {
    currentValue += digit;
  }

  expression += digit;

  updateDisplay();
  updateExpression();
}

// ==============================
// DECIMAL
// ==============================
function appendDecimal() {
  if (shouldResetScreen) {
    currentValue = "0";
    shouldResetScreen = false;
  }

  if (!currentValue.includes(".")) {
    currentValue += ".";
    expression += ".";
  }

  updateDisplay();
  updateExpression();
}

// ==============================
// OPERATOR
// ==============================
function setOperator(nextOperator) {
  if (operator !== null) compute();

  previousValue = currentValue;
  operator = nextOperator;
  shouldResetScreen = true;

  expression += " " + nextOperator + " ";

  updateStatus();
  updateExpression();
}

// ==============================
// COMPUTE (FIXED HISTORY INSIDE)
// ==============================
function compute() {
  if (!operator || shouldResetScreen) return;

  const prev = parseFloat(previousValue);
  const current = parseFloat(currentValue);

  let result;

  switch (operator) {
    case "+":
      result = prev + current;
      break;
    case "-":
      result = prev - current;
      break;
    case "*":
      result = prev * current;
      break;
    case "/":
      result = current === 0 ? "Error" : prev / current;
      break;
  }

  expression += " = " + result;

  // HISTORY FIXED HERE
  history.push(`${expression}`);

  if (history.length > 10) history.shift();

  updateHistory();

  currentValue = result.toString();
  operator = null;
  previousValue = null;
  shouldResetScreen = true;

  updateDisplay();
  updateExpression();
  updateStatus();
}

// ==============================
// DELETE
// ==============================
function deleteLast() {
  currentValue = currentValue.length <= 1 ? "0" : currentValue.slice(0, -1);
  expression = expression.slice(0, -1);

  updateDisplay();
  updateExpression();
}

// ==============================
// PERCENT
// ==============================
function applyPercent() {
  currentValue = (parseFloat(currentValue) / 100).toString();
  updateDisplay();
}

// ==============================
// CREATE BUTTONS
// ==============================
buttonLabels.forEach((item) => {
  const button = document.createElement("button");
  button.className = `button ${item.style}`;
  button.textContent = item.text;

  button.addEventListener("click", () => {
    switch (item.action) {
      case "digit":
        appendDigit(item.value);
        break;
      case "decimal":
        appendDecimal();
        break;
      case "operator":
        setOperator(item.value);
        break;
      case "equals":
        compute();
        break;
      case "clear":
        resetCalculator();
        break;
      case "delete":
        deleteLast();
        break;
      case "percent":
        applyPercent();
        break;
    }
  });

  buttons.appendChild(button);
});

// ==============================
// FINAL RENDER (FIXED)
// ==============================
calculator.appendChild(expressionLine);
calculator.appendChild(display);
calculator.appendChild(statusLine);
calculator.appendChild(historyBox);
calculator.appendChild(buttons);

app.appendChild(calculator);

// ==============================
// INIT
// ==============================
resetCalculator();

// ==============================
// KEYBOARD SUPPORT
// ==============================
document.addEventListener("keydown", (e) => {
  const key = e.key;

  if (!isNaN(key)) {
    appendDigit(key);
    return;
  }

  switch (key) {
    case "+":
      setOperator("+");
      break;
    case "-":
      setOperator("-");
      break;
    case "*":
      setOperator("*");
      break;
    case "/":
      setOperator("/");
      break;
    case "Enter":
    case "=":
      compute();
      break;
    case "Backspace":
      deleteLast();
      break;
    case "Escape":
    case "Delete":
      resetCalculator();
      break;
    case ".":
      appendDecimal();
      break;
    case "%":
      applyPercent();
      break;
  }
});
