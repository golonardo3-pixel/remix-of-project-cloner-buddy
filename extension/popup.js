const HISTORY_KEY = "lovable_helper_history";
const MAX_HISTORY = 20;

const promptInput = document.getElementById("prompt-input");
const copyBtn = document.getElementById("copy-btn");
const statusBar = document.getElementById("status-bar");
const historyList = document.getElementById("history-list");
const clearHistoryBtn = document.getElementById("clear-history");

function showStatus(message, type) {
  statusBar.textContent = message;
  statusBar.className = "status-bar " + type;
  statusBar.classList.remove("hidden");
  setTimeout(() => statusBar.classList.add("hidden"), 3000);
}

function loadHistory(callback) {
  chrome.storage.local.get([HISTORY_KEY], (result) => {
    callback(result[HISTORY_KEY] || []);
  });
}

function saveHistory(history, callback) {
  chrome.storage.local.set({ [HISTORY_KEY]: history }, callback);
}

function addToHistory(text) {
  loadHistory((history) => {
    const entry = { text, time: new Date().toLocaleString("pt-BR") };
    history.unshift(entry);
    if (history.length > MAX_HISTORY) history.length = MAX_HISTORY;
    saveHistory(history, () => renderHistory(history));
  });
}

function renderHistory(history) {
  if (!history || history.length === 0) {
    historyList.innerHTML = '<p class="empty-msg">Nenhum prompt copiado ainda.</p>';
    return;
  }
  historyList.innerHTML = history
    .map(
      (entry, i) => `
    <div class="history-item">
      <div class="history-text">${escapeHtml(entry.text)}</div>
      <div class="history-meta">
        <span class="history-time">${entry.time}</span>
        <div class="history-actions">
          <button data-action="reuse" data-index="${i}">🔄 Usar</button>
          <button data-action="copy" data-index="${i}">📋 Copiar</button>
        </div>
      </div>
    </div>`
    )
    .join("");

  historyList.querySelectorAll("[data-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.dataset.index, 10);
      const item = history[idx];
      if (!item) return;

      if (btn.dataset.action === "reuse") {
        promptInput.value = item.text;
        promptInput.focus();
        showStatus("Prompt carregado — edite ou copie!", "success");
      } else if (btn.dataset.action === "copy") {
        navigator.clipboard.writeText(item.text).then(() => {
          showStatus("✅ Copiado!", "success");
        });
      }
    });
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function copyPrompt() {
  const text = promptInput.value.trim();
  if (!text) {
    showStatus("Digite um prompt antes de copiar.", "error");
    return;
  }
  navigator.clipboard.writeText(text).then(() => {
    showStatus("✅ Prompt copiado! Cole no chat do Lovable.", "success");
    addToHistory(text);
    promptInput.value = "";
  }).catch(() => {
    showStatus("Erro ao copiar. Tente selecionar e copiar manualmente.", "error");
  });
}

copyBtn.addEventListener("click", copyPrompt);

promptInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    copyPrompt();
  }
});

document.querySelectorAll(".template-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const prompt = btn.dataset.prompt;
    promptInput.value = prompt;
    promptInput.focus();
    showStatus("Template carregado — edite ou copie!", "success");
  });
});

clearHistoryBtn.addEventListener("click", () => {
  saveHistory([], () => {
    renderHistory([]);
    showStatus("Histórico limpo.", "success");
  });
});

loadHistory(renderHistory);
