const validBases = [2, 8, 10, 16];
const digits = "0123456789ABCDEF";

// Show section by menu click
function showSection(sectionId) {
  document.querySelectorAll(".section").forEach(sec => sec.style.display = "none");
  document.getElementById(sectionId).style.display = "block";
}

// Converter
document.getElementById("convertBtn").addEventListener("click", () => {
  const num = document.getElementById("inputNumber").value.trim().toUpperCase();
  const sourceBase = parseInt(document.getElementById("sourceBase").value);
  const targetBase = parseInt(document.getElementById("targetBase").value);
  const precision = 8;

  try {
    const decimalValue = baseToDecimal(num, sourceBase);
    const converted = decimalToBase(decimalValue, targetBase, precision);
    document.getElementById("result").textContent = `Result: ${converted}`;
  } catch (err) {
    document.getElementById("result").textContent = "Error: " + err.message;
  }
});

// Calculator
document.getElementById("calcBtn").addEventListener("click", () => {
  const base = parseInt(document.getElementById("calcBase").value);
  const num1 = document.getElementById("num1").value.trim().toUpperCase();
  const num2 = document.getElementById("num2").value.trim().toUpperCase();
  const operation = document.getElementById("operation").value;
  const precision = 8;

  try {
    const dec1 = baseToDecimal(num1, base);
    const dec2 = baseToDecimal(num2, base);

    let resultDecimal = operation === "add" ? dec1 + dec2 : dec1 - dec2;
    const resultStr = decimalToBase(resultDecimal, base, precision);

    document.getElementById("calcResult").textContent = `Result: ${resultStr}`;
  } catch (err) {
    document.getElementById("calcResult").textContent = "Error: " + err.message;
  }
});

// Conversion functions
function baseToDecimal(num, base) {
  const parts = num.split(".");
  let intValue = 0;

  for (let i = 0; i < parts[0].length; i++) {
    const val = digits.indexOf(parts[0][i]);
    if (val < 0 || val >= base) throw new Error(`Invalid digit '${parts[0][i]}'`);
    intValue = intValue * base + val;
  }

  let fracValue = 0;
  if (parts.length > 1) {
    let divisor = base;
    for (let i = 0; i < parts[1].length; i++) {
      const val = digits.indexOf(parts[1][i]);
      if (val < 0 || val >= base) throw new Error(`Invalid digit '${parts[1][i]}'`);
      fracValue += val / divisor;
      divisor *= base;
    }
  }
  return intValue + fracValue;
}

function decimalToBase(num, base, precision) {
  const negative = num < 0;
  num = Math.abs(num);

  const intPart = Math.floor(num);
  let fracPart = num - intPart;

  let intStr = "";
  let temp = intPart;
  if (temp === 0) intStr = "0";
  while (temp > 0) {
    intStr = digits[temp % base] + intStr;
    temp = Math.floor(temp / base);
  }

  let fracStr = "";
  if (fracPart > 0 && precision > 0) {
    fracStr = ".";
    let count = 0;
    while (fracPart > 0 && count < precision) {
      fracPart *= base;
      const digit = Math.floor(fracPart);
      fracStr += digits[digit];
      fracPart -= digit;
      count++;
    }
  }

  return (negative ? "-" : "") + intStr + fracStr;
}
