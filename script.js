// ==============================
// MAIN CONTAINER (ROOT ELEMENT)
// ==============================
const app = document.getElementById("app");
// Gets the main div from HTML where calculator will be inserted

// ==============================
// CREATE CALCULATOR UI CONTAINER
// ==============================
const calculator = document.createElement("section");
// Creates main calculator wrapper element

calculator.className = "calculator";
// Adds CSS class for styling

// ==============================
// EXPRESSION LINE (FULL EQUATION DISPLAY)
// ==============================
const expressionLine = document.createElement("div");
// Creates element to show full math expression (e.g., 4 + 3 + 8)

expressionLine.className = "expression";
// Assigns class for styling (not heavily styled in your CSS yet)

// ==============================
// MAIN DISPLAY (CURRENT VALUE)
// ==============================
const display = document.createElement("div");
// Creates main output screen

display.className = "display";
// Applies iPhone-like display styling

display.textContent = "0";
// Default starting value

// ==============================
// STATUS LINE (SHOW ACTIVE OPERATOR)
// ==============================
const statusLine = document.createElement("div");
// Creates small info line under display

statusLine.className = "status-line";
// Adds CSS styling class

// ==============================
// ADD ELEMENTS TO CALCULATOR
// ==============================
calculator.appendChild(expressionLine);
// Adds expression line to calculator

calculator.appendChild(display);
// Adds main display

calculator.appendChild(statusLine);
// Adds operator status line

// ==============================
// BUTTON CONTAINER
// ==============================
const buttons = document.createElement("div");
// Creates container for all calculator buttons

buttons.className = "buttons";
// Grid layout styling applied

// ==============================
// BUTTON CONFIGURATION (DATA-DRIVEN UI)
// ==============================
const buttonLabels = [
  { text: "AC", action: "clear", style: "function" },
  // Clears all data

  { text: "⌫", action: "delete", style: "function" },
  // Deletes last character

  // { text: "+/-", action: "negate", style: "function" },
  // Toggles sign (disabled for now)

  { text: "%", action: "percent", style: "function" },
  // Converts value into percentage

  { text: "÷", action: "operator", value: "/", style: "operator" },
  // Division operator

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
  // Zero spans two columns

  { text: ".", action: "decimal", style: "number" },
  // Decimal point

  { text: "=", action: "equals", style: "operator" },
  // Calculates result
];

// ==============================
// CALCULATOR STATE VARIABLES
// ==============================
let currentValue = "0";
// What user is currently typing

let previousValue = null;
// Stores first operand before operator

let operator = null;
// Stores current operator (+ - * /)

let shouldResetScreen = false;
// Determines if next input should overwrite screen

let expression = "";
// Stores full equation string for display

// ==============================
// UPDATE DISPLAY FUNCTIONS
// ==============================
function updateDisplay() {
  display.textContent = currentValue;
  // Updates main calculator screen
}

function updateExpression() {
  expressionLine.textContent = expression;
  // Shows full equation (e.g., 4 + 5 + 2)
}

function updateStatus() {
  const map = {
    "+": "Addition (+)",
    "-": "Subtraction (−)",
    "*": "Multiplication (×)",
    "/": "Division (÷)",
  };

  statusLine.textContent = operator ? map[operator] : "";
  // Shows readable operator name
}

// ==============================
// RESET CALCULATOR
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
  // Resets everything to initial state
}

// ==============================
// DIGIT INPUT HANDLER
// ==============================
function appendDigit(digit) {
  if (currentValue === "0" || shouldResetScreen) {
    currentValue = digit;
    shouldResetScreen = false;
  } else {
    currentValue += digit;
  }

  expression += digit;
  // Adds digit to expression string

  updateDisplay();
  updateExpression();
}

// ==============================
// DECIMAL HANDLING
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
// OPERATOR HANDLER
// ==============================
function setOperator(nextOperator) {
  if (operator !== null) compute();
  // If already an operation exists, compute first

  previousValue = currentValue;
  operator = nextOperator;
  shouldResetScreen = true;

  expression += " " + nextOperator + " ";
  // Adds operator into expression string

  updateStatus();
  updateExpression();
}

// ==============================
// CALCULATION ENGINE
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

  currentValue = result.toString();

  operator = null;
  previousValue = null;
  shouldResetScreen = true;

  updateDisplay();
  updateExpression();
  updateStatus();
}

// ==============================
// DELETE LAST CHARACTER
// ==============================
function deleteLast() {
  currentValue = currentValue.length <= 1 ? "0" : currentValue.slice(0, -1);

  expression = expression.slice(0, -1);

  updateDisplay();
  updateExpression();
}

// ==============================
// TOGGLE SIGN (±)
// ==============================
function toggleSign() {
  if (currentValue === "0") return;

  currentValue = currentValue.startsWith("-")
    ? currentValue.slice(1)
    : "-" + currentValue;

  updateDisplay();
}

// ==============================
// PERCENT FUNCTION
// ==============================
function applyPercent() {
  currentValue = (parseFloat(currentValue) / 100).toString();
  updateDisplay();
}

// ==============================
// CREATE BUTTONS DYNAMICALLY
// ==============================
buttonLabels.forEach((item) => {
  const button = document.createElement("button");
  // Create button element

  button.className = `button ${item.style}`;
  button.textContent = item.text;

  button.addEventListener("click", () => {
    // Handle button actions

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
      // case "negate": toggleSign(); break;
      case "percent":
        applyPercent();
        break;
    }
  });

  buttons.appendChild(button);
  // Add button to grid
});

// ==============================
// FINAL RENDER
// ==============================
calculator.appendChild(buttons);
// Attach buttons to calculator

app.appendChild(calculator);
// Attach calculator to page

// ==============================
// INITIALIZE APP
// ==============================
resetCalculator();
// Start with clean state
