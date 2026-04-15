// Lovable Helper Pro — Content Script
// Detects Lovable chat input and inserts prompt text

(function () {
  // Avoid double injection
  if (window.__lovableHelperInjected) return;
  window.__lovableHelperInjected = true;

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action !== "insertPrompt") return;

    try {
      const text = message.text;
      const textarea = findChatInput();

      if (!textarea) {
        sendResponse({ success: false, error: "Campo de texto do Lovable não encontrado. Verifique se o chat está aberto." });
        return;
      }

      // Focus and insert text
      textarea.focus();

      // Use native input setter to bypass React's synthetic event system
      const nativeInputValueSetter =
        Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value")?.set ||
        Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;

      if (nativeInputValueSetter) {
        nativeInputValueSetter.call(textarea, text);
      } else {
        textarea.value = text;
      }

      // Dispatch events so React picks up the change
      textarea.dispatchEvent(new Event("input", { bubbles: true }));
      textarea.dispatchEvent(new Event("change", { bubbles: true }));

      // Also try dispatching a React-specific input event
      const inputEvent = new InputEvent("input", {
        bubbles: true,
        cancelable: true,
        inputType: "insertText",
        data: text,
      });
      textarea.dispatchEvent(inputEvent);

      // Try to find and click the send button after a short delay
      setTimeout(() => {
        const sendButton = findSendButton();
        if (sendButton) {
          sendButton.click();
          sendResponse({ success: true });
        } else {
          // Text was inserted but couldn't auto-click send
          sendResponse({ success: true, warning: "Texto inserido. Clique enviar manualmente." });
        }
      }, 300);

      // Keep the message channel open for async response
      return true;
    } catch (err) {
      sendResponse({ success: false, error: err.message });
    }
  });

  function findChatInput() {
    // Try multiple selectors that Lovable might use
    const selectors = [
      'textarea[placeholder*="Ask"]',
      'textarea[placeholder*="ask"]',
      'textarea[placeholder*="message"]',
      'textarea[placeholder*="Message"]',
      'textarea[placeholder*="prompt"]',
      'textarea[placeholder*="Prompt"]',
      'textarea[placeholder*="Type"]',
      'textarea[placeholder*="type"]',
      "textarea[data-testid]",
      'div[contenteditable="true"]',
      "textarea",
    ];

    for (const selector of selectors) {
      const elements = document.querySelectorAll(selector);
      for (const el of elements) {
        // Skip hidden or very small elements
        const rect = el.getBoundingClientRect();
        if (rect.width > 50 && rect.height > 20 && isVisible(el)) {
          return el;
        }
      }
    }

    return null;
  }

  function findSendButton() {
    // Look for send/submit buttons near the chat input
    const selectors = [
      'button[type="submit"]',
      'button[aria-label*="Send"]',
      'button[aria-label*="send"]',
      'button[aria-label*="Submit"]',
      'button[data-testid*="send"]',
    ];

    for (const selector of selectors) {
      const btn = document.querySelector(selector);
      if (btn && isVisible(btn)) return btn;
    }

    // Fallback: look for buttons with send-like SVG icons (arrow up)
    const buttons = document.querySelectorAll("button");
    for (const btn of buttons) {
      if (!isVisible(btn)) continue;
      const ariaLabel = (btn.getAttribute("aria-label") || "").toLowerCase();
      const text = (btn.textContent || "").toLowerCase().trim();
      if (
        ariaLabel.includes("send") ||
        ariaLabel.includes("submit") ||
        text === "send" ||
        text === "enviar"
      ) {
        return btn;
      }
    }

    return null;
  }

  function isVisible(el) {
    if (!el) return false;
    const style = window.getComputedStyle(el);
    return (
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      style.opacity !== "0" &&
      el.offsetParent !== null
    );
  }
})();