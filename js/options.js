document.addEventListener('DOMContentLoaded', function() {
  const saveButton = document.getElementById('save');
  const preferredLanguage = document.getElementById('preferredLanguage');
  const simplificationLevel = document.getElementById('simplificationLevel');
  const successMessage = document.getElementById('success-message');
  const aiStatusDiv = document.getElementById('ai-status');

  let originalSettings = {};

  // Load saved settings
  chrome.storage.sync.get(['preferredLanguage', 'simplificationLevel'], function(result) {
    originalSettings = {
      preferredLanguage: result.preferredLanguage || '',
      simplificationLevel: result.simplificationLevel || '5th grader'
    };

    if (result.preferredLanguage) {
      preferredLanguage.value = result.preferredLanguage;
    }
    if (result.simplificationLevel) {
      simplificationLevel.value = result.simplificationLevel;
    }

    // Update save button state
    updateSaveButton();
  });

  // Check AI status
  checkAIStatus();

  // Add input event listeners for real-time validation
  preferredLanguage.addEventListener('input', function() {
    validateLanguageInput();
    updateSaveButton();
  });

  simplificationLevel.addEventListener('change', updateSaveButton);

  // Save settings with validation
  saveButton.addEventListener('click', function() {
    if (!validateForm()) {
      return;
    }

    const settings = {
      preferredLanguage: preferredLanguage.value.trim(),
      simplificationLevel: simplificationLevel.value
    };

    saveButton.disabled = true;
    saveButton.textContent = '💾 Saving...';

    chrome.storage.sync.set(settings, function() {
      if (chrome.runtime.lastError) {
        showError('Failed to save settings: ' + chrome.runtime.lastError.message);
        saveButton.disabled = false;
        saveButton.textContent = '💾 Save Settings';
        return;
      }

      originalSettings = { ...settings };
      updateSaveButton();

      saveButton.textContent = '✅ Saved!';
      successMessage.classList.add('show');

      setTimeout(() => {
        saveButton.disabled = false;
        saveButton.textContent = '💾 Save Settings';
        successMessage.classList.remove('show');
      }, 2000);
    });
  });

  function validateForm() {
    const language = preferredLanguage.value.trim();

    if (language && !isValidLanguage(language)) {
      showError('Please enter a valid language name (e.g., English, Spanish, French)');
      preferredLanguage.focus();
      return false;
    }

    return true;
  }

  function validateLanguageInput() {
    const language = preferredLanguage.value.trim();
    const isValid = !language || isValidLanguage(language);

    preferredLanguage.style.borderColor = isValid ? '#e1e5e9' : '#dc3545';
    preferredLanguage.style.boxShadow = isValid ? 'none' : '0 0 0 3px rgba(220, 53, 69, 0.1)';

    const existingError = preferredLanguage.parentNode.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }

    if (!isValid) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.style.cssText = `
        color: #dc3545;
        font-size: 13px;
        margin-top: 6px;
        font-weight: 500;
      `;
      errorDiv.textContent = 'Please enter a valid language name';
      preferredLanguage.parentNode.appendChild(errorDiv);
    }
  }

  function isValidLanguage(language) {
    // Basic validation: allow letters, spaces, hyphens, and apostrophes
    const languageRegex = /^[a-zA-Z\s\-']+$/;
    return languageRegex.test(language) && language.length >= 2 && language.length <= 50;
  }

  function updateSaveButton() {
    const currentSettings = {
      preferredLanguage: preferredLanguage.value.trim(),
      simplificationLevel: simplificationLevel.value
    };

    const hasChanges = JSON.stringify(currentSettings) !== JSON.stringify(originalSettings);
    saveButton.disabled = !hasChanges;
    saveButton.style.opacity = hasChanges ? '1' : '0.6';
  }

  function showError(message) {
    // Remove existing error
    const existingError = document.querySelector('.global-error');
    if (existingError) {
      existingError.remove();
    }

    const errorDiv = document.createElement('div');
    errorDiv.className = 'global-error';
    errorDiv.style.cssText = `
      background: #f8d7da;
      color: #721c24;
      padding: 12px 16px;
      border-radius: 8px;
      margin-bottom: 20px;
      border: 1px solid #f5c6cb;
      font-size: 14px;
      font-weight: 500;
      text-align: center;
    `;
    errorDiv.textContent = message;

    const container = document.querySelector('.content');
    container.insertBefore(errorDiv, container.firstChild);

    setTimeout(() => {
      errorDiv.remove();
    }, 5000);
  }

  async function checkAIStatus() {
    try {
      if (!('ai' in self) || !('languageModel' in self.ai)) {
        updateAIStatus('AI not available - Update Chrome for Gemini Nano support', false);
        return;
      }

      const availability = await self.ai.languageModel.availability();
      switch (availability) {
        case 'available':
          updateAIStatus('AI Ready - All features available', true);
          break;
        case 'downloadable':
          updateAIStatus('AI model available for download', false);
          break;
        case 'downloading':
          updateAIStatus('AI model downloading...', false);
          break;
        case 'unavailable':
        default:
          updateAIStatus('AI unavailable on this device', false);
          break;
      }
    } catch (error) {
      updateAIStatus('Error checking AI status', false);
    }
  }

  function updateAIStatus(message, isReady) {
    if (aiStatusDiv) {
      aiStatusDiv.className = 'ai-status' + (isReady ? ' ready' : '');
      const h4 = aiStatusDiv.querySelector('h4');
      const p = aiStatusDiv.querySelector('p');
      if (h4) h4.textContent = isReady ? '✅ AI Status: Ready' : '⚠️ AI Status: Limited';
      if (p) p.textContent = message;
    }
  }
});