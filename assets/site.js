// Language switch (small screens) and the try-it demo. No dependencies.

(function () {
  var root = document.documentElement;

  // ---- Language switch: only affects narrow screens via CSS ----
  var langButtons = document.querySelectorAll("[data-set-lang]");
  function setLang(lang) {
    root.dataset.lang = lang;
    langButtons.forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.setLang === lang));
    });
    try { localStorage.setItem("kridi-lang", lang); } catch (e) {}
  }
  langButtons.forEach(function (b) {
    b.addEventListener("click", function () { setLang(b.dataset.setLang); });
  });
  if (root.dataset.lang) setLang(root.dataset.lang);

  // ---- Demo ----
  var ledger = document.querySelector(".demo-ledger");
  if (!ledger) return;

  var amount = 500;
  var balance = 0;
  var lines = 0;
  var notes = {
    credit: ["pain, lait", "sucre, café", "huile 5 L", "couches", "semoule", "eau, jus"],
    payment: ["versement", "acompte", "payé"]
  };
  var balanceEl = document.querySelector("[data-balance]");
  var labelEl = document.querySelector("[data-balance-label]");
  var remind = document.querySelector(".demo-remind");
  var bubble = document.querySelector(".demo-bubble");
  var msg = document.querySelector("[data-msg]");

  function money(n) {
    return Math.abs(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " DA";
  }

  function render() {
    balanceEl.textContent = money(balance);
    balanceEl.className = balance > 0 ? "pos" : balance < 0 ? "neg" : "";
    labelEl.textContent = balance > 0 ? "Vous doit · عليه لك" : balance < 0 ? "Vous lui devez · عليك له" : "Soldé · خالص";
    remind.disabled = balance <= 0;
    if (balance <= 0) bubble.hidden = true;
  }

  document.querySelectorAll("[data-amount]").forEach(function (chip) {
    chip.addEventListener("click", function () {
      amount = Number(chip.dataset.amount);
      document.querySelectorAll("[data-amount]").forEach(function (c) {
        c.setAttribute("aria-pressed", String(c === chip));
      });
    });
  });

  document.querySelectorAll(".demo-buttons [data-type]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var credit = btn.dataset.type === "credit";
      balance += credit ? amount : -amount;
      var list = credit ? notes.credit : notes.payment;
      var li = document.createElement("li");
      var n = document.createElement("span");
      var a = document.createElement("span");
      n.className = "n";
      a.className = "a";
      n.textContent = "Karim — " + list[lines % list.length];
      a.textContent = (credit ? "+ " : "− ") + money(amount);
      a.style.color = credit ? "var(--red)" : "var(--green)";
      li.append(n, a);
      ledger.appendChild(li);
      lines++;
      // Keep the page tidy: the notebook shows the last seven lines.
      while (ledger.children.length > 7) ledger.removeChild(ledger.firstElementChild);
      render();
    });
  });

  remind.addEventListener("click", function () {
    msg.textContent = "Bonjour Karim, c'est l'épicerie Amine. Petit rappel : votre solde chez nous est de " + money(balance) + ". Merci !";
    bubble.hidden = false;
  });

  render();
})();
