const validBases = [2, 8, 10, 16];

const sourceBaseSelect = document.getElementById("sourceBase");
const targetBaseSelect = document.getElementById("targetBase");
const resultDiv = document.getElementById("result");

document.getElementById("convertBtn").addEventListener("click", () => {
  const num = document.getElementById("inputNumber").value.trim().toUpperCase();
  const sourceBase = parseInt(sourceBaseSelect.value);
  const targetBase = parseInt(targetBaseSelect.value);
  const precisionInput = 8;
  const precision = precisionInput === "" ? 8 : Math.min(Math.max(parseInt(precisionInput), 0), 20);
  try {
    if (!validBases.includes(sourceBase) || !validBases.includes(targetBase)) {
      throw new Error("Base must be one of 2, 8, 10, or 16");
    }
    const decimalValue = baseToDecimal(num, sourceBase);
    const converted = decimalToBase(decimalValue, targetBase, precision);
    resultDiv.textContent = `Result: ${converted}`;
  } catch (err) {
    resultDiv.textContent = "Error: " + err.message;
  }
});

function baseToDecimal(num, base) {
  if(!validBases.includes(base)) throw new Error("Base must be one of 2, 8, 10, or 16");

  const digits = "0123456789ABCDEF";
  const parts = num.split(".");

  // Integer part conversion
  let intPartValue = 0;
  const intPart = parts[0];
  for(let i=0; i<intPart.length; i++) {
    const digitValue = digits.indexOf(intPart[i]);
    if(digitValue < 0 || digitValue >= base) throw new Error(`Invalid digit '${intPart[i]}' for base ${base}`);
    intPartValue = intPartValue * base + digitValue;
  }

  // Fractional part conversion
  let fracPartValue = 0;
  if(parts.length > 1) {
    const fracPart = parts[1];
    let divisor = base;
    for(let i=0; i<fracPart.length; i++) {
      const digitValue = digits.indexOf(fracPart[i]);
      if(digitValue < 0 || digitValue >= base) throw new Error(`Invalid digit '${fracPart[i]}' for base ${base}`);
      fracPartValue += digitValue / divisor;
      divisor *= base;
    }
  }

  return intPartValue + fracPartValue;
}

function decimalToBase(num, base, precision) {
  if(!validBases.includes(base)) throw new Error("Base must be one of 2, 8, 10, or 16");

  const digits = "0123456789ABCDEF";

  const intPart = Math.floor(num);
  let fracPart = num - intPart;

  // Convert integer part
  let intString = "";
  if(intPart === 0) {
    intString = "0";
  } else {
    let n = intPart;
    while(n > 0) {
      intString = digits[n % base] + intString;
      n = Math.floor(n / base);
    }
  }

  // Convert fractional part
  let fracString = "";
  if(fracPart > 0 && precision > 0) {
    fracString = ".";
    let count = 0;
    while(fracPart > 0 && count < precision) {
      fracPart *= base;
      const digit = Math.floor(fracPart);
      fracString += digits[digit];
      fracPart -= digit;
      count++;
    }
  }

  return intString + fracString;
}
