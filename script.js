let interestType = "simple";

const simpleBtn = document.getElementById("simpleBtn");
const compoundBtn = document.getElementById("compoundBtn");
const principalInput = document.getElementById("principal");

simpleBtn.onclick = () => toggleType("simple");
compoundBtn.onclick = () => toggleType("compound");

function toggleType(type) {
  interestType = type;
  simpleBtn.classList.remove("active");
  compoundBtn.classList.remove("active");
  type === "simple"
    ? simpleBtn.classList.add("active")
    : compoundBtn.classList.add("active");
}

// Indian number formatting
function formatINR(num) {
  return new Intl.NumberFormat("en-IN").format(Math.round(num));
}

// Live formatting for principal input
principalInput.addEventListener("input", () => {
  let value = principalInput.value.replace(/,/g, "");
  if (!isNaN(value) && value !== "") {
    principalInput.value = formatINR(value);
  }
});

function calculate() {
  const principal = Number(principalInput.value.replace(/,/g, ""));
  const rate = Number(document.getElementById("rate").value);
  const start = new Date(document.getElementById("startDate").value);
  const end = new Date(document.getElementById("endDate").value);

  if (!principal || !rate || !start || !end || end <= start) return;

  const months = (end - start) / (1000 * 60 * 60 * 24 * 30);

  let total, interest;

  if (interestType === "simple") {
    interest = principal * (rate / 100) * months;
    total = principal + interest;
  } else {
    total = principal * Math.pow(1 + rate / 100, months);
    interest = total - principal;
  }

  document.getElementById("duration").innerText =
    months.toFixed(1) + " months";

  document.getElementById("interest").innerText =
    formatINR(interest);

  document.getElementById("total").innerText =
    formatINR(total);

  document.getElementById("resultBox").classList.remove("hidden");
}

function copyResult() {
  const btn = document.getElementById("copyBtn");

  const text = `
Interest Type: ${interestType.toUpperCase()}
Principal: ₹${principalInput.value}
Interest: ₹${document.getElementById("interest").innerText}
Total: ₹${document.getElementById("total").innerText}
Duration: ${document.getElementById("duration").innerText}
`;

  navigator.clipboard.writeText(text);

  btn.classList.add("copied");
  btn.innerText = "✓ Copied";

  setTimeout(() => {
    btn.classList.remove("copied");
    btn.innerText = "📋 Copy";
  }, 1500);
}
