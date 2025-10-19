// Popup script for Adaptive Learning Assistant
document.addEventListener('DOMContentLoaded', function() {
  const settingsBtn = document.getElementById('settings-btn');
  const statusDiv = document.getElementById('ai-status');

  if (settingsBtn) {
    settingsBtn.addEventListener('click', function(e) {
      e.preventDefault();
      chrome.runtime.openOptionsPage();
    });
  }

  // Check AI availability status
  checkAIAvailability();

  async function checkAIAvailability() {
    try {
      if (!('ai' in self) || !('languageModel' in self.ai)) {
        updateStatus('AI not available - Update Chrome for Gemini Nano support', false);
        return;
      }

      const availability = await self.ai.languageModel.availability();
      switch (availability) {
        case 'available':
          updateStatus('AI Ready - Select text to use tools', true);
          break;
        case 'downloadable':
          updateStatus('AI model available for download', false);
          break;
        case 'downloading':
          updateStatus('AI model downloading...', false);
          break;
        case 'unavailable':
        default:
          updateStatus('AI unavailable on this device', false);
          break;
      }
    } catch (error) {
      updateStatus('Error checking AI status', false);
    }
  }

  function updateStatus(message, isReady) {
    if (statusDiv) {
      statusDiv.textContent = message;
      statusDiv.className = 'status' + (isReady ? ' ready' : '');
    }
  }
});