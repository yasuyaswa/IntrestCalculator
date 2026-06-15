let interestType = "simple";

const simpleBtn   = document.getElementById("simpleBtn");
const compoundBtn = document.getElementById("compoundBtn");
const pillTrack   = document.getElementById("pillTrack");
const principalInput = document.getElementById("principal");

simpleBtn.onclick   = () => toggleType("simple");
compoundBtn.onclick = () => toggleType("compound");

function toggleType(type) {
  interestType = type;
  simpleBtn.classList.toggle("active",   type === "simple");
  compoundBtn.classList.toggle("active", type === "compound");
  pillTrack.classList.toggle("right",    type === "compound");
}

/* ---- Indian number format ---- */
function formatINR(num) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(num);
}

/* ---- Principal: allow formatted number input ---- */
principalInput.addEventListener("input", () => {
  let raw = principalInput.value.replace(/[^0-9.]/g, "");
  const parts = raw.split(".");
  if (parts.length > 2) raw = parts[0] + "." + parts.slice(1).join("");
  if (raw !== "") principalInput.value = formatINR(Number(raw));
  else principalInput.value = "";
});

/* ---- Month diff (calendar-accurate) ---- */
function calculateMonths(start, end) {
  let m = (end.getFullYear() - start.getFullYear()) * 12
        + (end.getMonth() - start.getMonth());
  if (end.getDate() < start.getDate()) m--;
  return m;
}

/* ---- Format duration nicely ---- */
function formatDuration(months) {
  const y = Math.floor(months / 12);
  const m = months % 12;
  const parts = [];
  if (y) parts.push(y + " yr" + (y > 1 ? "s" : ""));
  if (m) parts.push(m + " mo");
  return parts.length ? parts.join(" ") : months + " months";
}

/* ---- Main calculate ---- */
function calculate() {
  const principal = Number(principalInput.value.replace(/,/g, ""));
  const rate      = Number(document.getElementById("rate").value);
  const startVal  = document.getElementById("startDate").value;
  const endVal    = document.getElementById("endDate").value;

  if (!principal || !rate || !startVal || !endVal) {
    flashError("Please fill in all fields.");
    return;
  }

  const start = new Date(startVal);
  const end   = new Date(endVal);

  if (end <= start) {
    flashError("End date must be after start date.");
    return;
  }

  const months = calculateMonths(start, end);

  if (months <= 0) {
    flashError("Duration must be at least 1 month.");
    return;
  }

  let interest, total;

  if (interestType === "simple") {
    interest = principal * (rate / 100) * months;
    total    = principal + interest;
  } else {
    total    = principal * Math.pow(1 + rate / 100, months);
    interest = total - principal;
  }

  document.getElementById("duration").innerText = formatDuration(months);
  document.getElementById("interest").innerText = formatINR(interest);
  document.getElementById("total").innerText    = formatINR(total);

  const box = document.getElementById("resultBox");
  box.classList.remove("hidden");
  /* Re-trigger entry animation */
  box.style.animation = "none";
  void box.offsetHeight;
  box.style.animation = "";
}

/* ---- Shake + red flash on error ---- */
function flashError(msg) {
  const btn = document.getElementById("calcBtn");
  btn.classList.add("shake");
  const origText = btn.querySelector(".calc-btn-text").innerText;
  btn.querySelector(".calc-btn-text").innerText = msg || "Check inputs!";
  setTimeout(() => {
    btn.classList.remove("shake");
    btn.querySelector(".calc-btn-text").innerText = origText;
  }, 1200);
}

/* ---- Copy ---- */
function copyResult() {
  const btn      = document.getElementById("copyBtn");
  const iconEl   = document.getElementById("copyIcon");
  const textEl   = document.getElementById("copyText");

  const text = [
    "Interest Calculator Results",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "Type:      " + interestType.charAt(0).toUpperCase() + interestType.slice(1) + " Interest",
    "Principal: ₹" + principalInput.value,
    "Duration:  " + document.getElementById("duration").innerText,
    "Interest:  ₹" + document.getElementById("interest").innerText,
    "Total:     ₹" + document.getElementById("total").innerText,
  ].join("\n");

  navigator.clipboard.writeText(text).then(() => {
    btn.classList.add("copied");
    iconEl.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    textEl.innerText = "Copied!";
    setTimeout(() => {
      btn.classList.remove("copied");
      iconEl.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" stroke-width="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="2"/></svg>';
      textEl.innerText = "Copy Results";
    }, 2200);
  }).catch(() => {
    textEl.innerText = "Copy failed";
    setTimeout(() => { textEl.innerText = "Copy Results"; }, 1500);
  });
}
