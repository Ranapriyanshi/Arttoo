const form = document.getElementById("tattoo-form");
const resultSection = document.getElementById("result-section");
const imageWrap = document.getElementById("image-wrap");
const resultImage = document.getElementById("result-image");
const resultPrompt = document.getElementById("result-prompt");
const submitBtn = document.getElementById("submit-btn");
const stateLoading = document.getElementById("state-loading");
const stateError = document.getElementById("state-error");
const errorMessage = document.getElementById("error-message");
const dismissError = document.getElementById("dismiss-error");
const generateAgain = document.getElementById("generate-again");
const personalityChips = document.getElementById("personality-chips");
const lifestyleChips = document.getElementById("lifestyle-chips");
const customPersonalityInput = document.getElementById("custom-personality-input");
const customLifestyleInput = document.getElementById("custom-lifestyle-input");
const addPersonalityBtn = document.getElementById("add-personality-btn");
const addLifestyleBtn = document.getElementById("add-lifestyle-btn");

let customInputId = 0;

function addCustomChip(name, value, chipsContainer) {
  const trimmed = value.trim();
  if (!trimmed) return;
  const id = "custom-" + name + "-" + ++customInputId;
  const hidden = document.createElement("input");
  hidden.type = "hidden";
  hidden.name = name;
  hidden.value = trimmed;
  hidden.id = id;
  hidden.setAttribute("data-custom", "true");
  form.appendChild(hidden);

  const chip = document.createElement("span");
  chip.className = "chip chip-custom";
  chip.dataset.inputId = id;
  chip.appendChild(document.createTextNode(trimmed));
  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "chip-remove";
  removeBtn.setAttribute("aria-label", "Remove");
  removeBtn.textContent = "×";
  chip.appendChild(removeBtn);
  removeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    chip.remove();
    document.getElementById(id).remove();
  });
  chipsContainer.appendChild(chip);
}

function getFormPayload() {
  const fd = new FormData(form);
  const personality = fd.getAll("personality");
  const lifestyle = fd.getAll("lifestyle");
  return {
    personality: personality.length ? personality : ["balanced"],
    lifestyle: lifestyle.length ? lifestyle : ["versatile"],
    style: fd.get("style") || "minimalist",
    placement: fd.get("placement") || "arm",
    colors: fd.get("colors") || "black and grey",
    extra: (fd.get("extra") || "").trim(),
  };
}

function setLoading(loading) {
  submitBtn.disabled = loading;
  stateLoading.setAttribute("aria-hidden", !loading);
}

function setError(msg) {
  errorMessage.textContent = msg || "Something went wrong.";
  stateError.setAttribute("aria-hidden", "false");
}

function hideError() {
  stateError.setAttribute("aria-hidden", "true");
}

function showResult(imageUrl, promptText) {
  resultImage.src = imageUrl;
  resultImage.onerror = () => {
    resultImage.alt = "Image failed to load. Try again.";
  };
  resultPrompt.textContent = promptText || "";
  resultSection.setAttribute("aria-hidden", "false");
  resultSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

async function generate() {
  const payload = getFormPayload();
  setLoading(true);
  hideError();

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(data.error || `Error ${res.status}`);
      return;
    }
    showResult(data.imageUrl, data.prompt);
  } catch (e) {
    setError(e.message || "Network error. Is the server running?");
  } finally {
    setLoading(false);
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  generate();
});

generateAgain.addEventListener("click", () => {
  resultSection.setAttribute("aria-hidden", "true");
  resultImage.removeAttribute("src");
  resultPrompt.textContent = "";
});

dismissError.addEventListener("click", hideError);

addPersonalityBtn.addEventListener("click", () => {
  addCustomChip("personality", customPersonalityInput.value, personalityChips);
  customPersonalityInput.value = "";
  customPersonalityInput.focus();
});

addLifestyleBtn.addEventListener("click", () => {
  addCustomChip("lifestyle", customLifestyleInput.value, lifestyleChips);
  customLifestyleInput.value = "";
  customLifestyleInput.focus();
});

customPersonalityInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addPersonalityBtn.click();
  }
});

customLifestyleInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addLifestyleBtn.click();
  }
});
