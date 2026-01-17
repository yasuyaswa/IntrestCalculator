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

// Indian number format
function formatINR(num) {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2
  }).format(num);
}

// Restrict principal input
principalInput.addEventListener("input", () => {
  let raw = principalInput.value.replace(/[^0-9.]/g, "");
  const parts = raw.split(".");
  if (parts.length > 2) raw = parts[0] + "." + parts.slice(1).join("");
  if (raw !== "") principalInput.value = formatINR(Number(raw));
});

// ✅ CORRECT calendar month calculation
function calculateMonths(start, end) {
  let months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());

  if (end.getDate() < start.getDate()) {
    months -= 1;
  }

  return months;
}

function calculate() {
  const principal = Number(principalInput.value.replace(/,/g, ""));
  const rate = Number(document.getElementById("rate").value);
  const start = new Date(document.getElementById("startDate").value);
  const end = new Date(document.getElementById("endDate").value);

  if (!principal || !rate || !start || !end || end <= start) return;

  const months = calculateMonths(start, end);

  let interest, total;

  if (interestType === "simple") {
    interest = principal * (rate / 100) * months;
    total = principal + interest;
  } else {
    total = principal * Math.pow(1 + rate / 100, months);
    interest = total - principal;
  }

  document.getElementById("duration").innerText = months + " months";
  document.getElementById("interest").innerText = formatINR(interest);
  document.getElementById("total").innerText = formatINR(total);

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
  btn.innerText = "✓ Copied";

  setTimeout(() => (btn.innerText = "📋 Copy"), 1500);
}
