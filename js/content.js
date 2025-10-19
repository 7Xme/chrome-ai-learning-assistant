document.addEventListener('mouseup', function(event) {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText.length > 0) {
    showFloatingUI(event.clientX, event.clientY, selectedText);
  } else {
    hideFloatingUI();
  }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
  // Only trigger shortcuts if no input/textarea is focused
  if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.contentEditable === 'true') {
    return;
  }

  const selectedText = window.getSelection().toString().trim();

  // Ctrl+Shift+S: Summarize
  if (event.ctrlKey && event.shiftKey && event.key === 'S') {
    event.preventDefault();
    if (selectedText.length > 0) {
      handleSummarize(selectedText);
    }
    return;
  }

  // Ctrl+Shift+T: Translate
  if (event.ctrlKey && event.shiftKey && event.key === 'T') {
    event.preventDefault();
    if (selectedText.length > 0) {
      handleTranslate(selectedText);
    }
    return;
  }

  // Ctrl+Shift+Q: Ask Question
  if (event.ctrlKey && event.shiftKey && event.key === 'Q') {
    event.preventDefault();
    if (selectedText.length > 0) {
      handlePrompt(selectedText);
    }
    return;
  }

  // Ctrl+Shift+Z: Quiz
  if (event.ctrlKey && event.shiftKey && event.key === 'Z') {
    event.preventDefault();
    if (selectedText.length > 0) {
      handleQuiz(selectedText);
    }
    return;
  }

  // Ctrl+Shift+R: Simplify
  if (event.ctrlKey && event.shiftKey && event.key === 'R') {
    event.preventDefault();
    if (selectedText.length > 0) {
      handleSimplify(selectedText);
    }
    return;
  }

  // Ctrl+Shift+C: Check Answer
  if (event.ctrlKey && event.shiftKey && event.key === 'C') {
    event.preventDefault();
    if (selectedText.length > 0) {
      handleProofread(selectedText);
    }
    return;
  }

  // Ctrl+Shift+V: Voice Ask
  if (event.ctrlKey && event.shiftKey && event.key === 'V') {
    event.preventDefault();
    if (selectedText.length > 0) {
      handleVoicePrompt(selectedText);
    }
    return;
  }
});

// Apply theme on content script load
chrome.storage.sync.get(['theme'], function(result) {
  applyTheme(result.theme || 'light');
});

function applyTheme(themeValue) {
  let resolvedTheme = themeValue;

  if (themeValue === 'auto') {
    resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  document.documentElement.setAttribute('data-theme', resolvedTheme);
}

function showFloatingUI(x, y, text) {
  let ui = document.getElementById('ala-floating-ui');
  if (!ui) {
    ui = document.createElement('div');
    ui.id = 'ala-floating-ui';
    ui.innerHTML = `
      <button id="summarize-btn">Summarize</button>
      <button id="translate-btn">Translate</button>
      <button id="prompt-btn">Ask About</button>
      <button id="voice-btn">🎤 Voice Ask</button>
      <button id="quiz-btn">Quiz</button>
      <button id="simplify-btn">Simplify</button>
      <button id="proofread-btn">Check Answer</button>
    `;
    document.body.appendChild(ui);

    // Add event listeners only once when creating the UI
    document.getElementById('summarize-btn').addEventListener('click', (e) => {
      e.preventDefault();
      handleSummarize(text);
    });
    document.getElementById('translate-btn').addEventListener('click', (e) => {
      e.preventDefault();
      handleTranslate(text);
    });
    document.getElementById('prompt-btn').addEventListener('click', (e) => {
      e.preventDefault();
      handlePrompt(text);
    });
    document.getElementById('quiz-btn').addEventListener('click', (e) => {
      e.preventDefault();
      handleQuiz(text);
    });
    document.getElementById('simplify-btn').addEventListener('click', (e) => {
      e.preventDefault();
      handleSimplify(text);
    });
    document.getElementById('proofread-btn').addEventListener('click', (e) => {
      e.preventDefault();
      handleProofread(text);
    });
    document.getElementById('voice-btn').addEventListener('click', (e) => {
      e.preventDefault();
      handleVoicePrompt(text);
    });
  }
  ui.style.left = x + 'px';
  ui.style.top = y + 'px';
  ui.style.display = 'block';
}

function hideFloatingUI() {
  const ui = document.getElementById('ala-floating-ui');
  if (ui) {
    ui.style.display = 'none';
  }
}

async function handleSummarize(text) {
  showLoading('Generating summary...');
  try {
    const summary = await callAPI('summarizer', { text });
    displayResult('Summary', summary);
  } finally {
    hideLoading();
  }
}

async function handleTranslate(text) {
  chrome.storage.sync.get(['preferredLanguage', 'translationLanguages'], async function(result) {
    const defaultLang = result.preferredLanguage || 'English';
    const supportedLanguages = result.translationLanguages || ['spanish', 'french', 'german'];

    // Create enhanced language prompt with suggestions
    let languagePrompt = 'Enter target language:';
    if (supportedLanguages.length > 0) {
      languagePrompt += '\n\nSuggested languages: ' + supportedLanguages.map(lang =>
        lang.charAt(0).toUpperCase() + lang.slice(1)
      ).join(', ');
    }
    languagePrompt += '\n\nOr enter any language you prefer.';

    const language = prompt(languagePrompt, defaultLang);
    if (language) {
      showLoading('Translating text...');
      try {
        const translation = await callAPI('translator', { text, target: language });
        displayResult('Translation', translation);
      } finally {
        hideLoading();
      }
    }
  });
}

async function handlePrompt(text) {
  const question = prompt('Ask a question about the text or related image:');
  if (question) {
    showLoading('Thinking...');
    try {
      const answer = await callAPI('prompt', { text, question });
      displayResult('Answer', answer);
    } finally {
      hideLoading();
    }
  }
}

async function handleQuiz(text) {
  showLoading('Creating quiz...');
  try {
    const quiz = await callAPI('writer', { text, type: 'quiz' });
    displayResult('Quiz', quiz);
  } finally {
    hideLoading();
  }
}

async function handleSimplify(text) {
  chrome.storage.sync.get(['simplificationLevel'], async function(result) {
    const defaultLevel = result.simplificationLevel || '5th grader';
    const level = prompt('Simplify for what level? (e.g., 5th grader, business jargon):', defaultLevel);
    if (level) {
      showLoading('Simplifying text...');
      try {
        const simplified = await callAPI('rewriter', { text, level });
        displayResult('Simplified', simplified);
      } finally {
        hideLoading();
      }
    }
  });
}

async function handleProofread(text) {
  showLoading('Checking answer...');
async function handleVoicePrompt(text) {
  // Check if Speech Recognition is supported
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    displayResult('Voice Input Error', 'Speech recognition is not supported in your browser. Please use a modern version of Chrome.');
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.continuous = false;
  recognition.interimResults = false;
  // Get speech language from settings
  chrome.storage.sync.get(['speechLanguage'], function(result) {
    recognition.lang = result.speechLanguage || 'en-US';
  });

  recognition.onstart = function() {
    showLoading('Listening... Speak your question now.');
  };

  recognition.onresult = async function(event) {
    const transcript = event.results[0][0].transcript;
    showLoading('Processing your voice question...');

    try {
      const answer = await callAPI('prompt', { text, question: transcript });
      displayResult(`Voice Question: "${transcript}"`, answer);
    } catch (error) {
      displayResult('Voice Processing Error', `Error processing your voice input: ${error.message}`);
    } finally {
      hideLoading();
    }
  };

  recognition.onerror = function(event) {
    hideLoading();
    displayResult('Voice Recognition Error', `Speech recognition error: ${event.error}. Please try again or use text input.`);
  };

  recognition.onend = function() {
    // Hide loading if still showing
    hideLoading();
  };

  try {
    recognition.start();
  } catch (error) {
    displayResult('Voice Start Error', `Could not start voice recognition: ${error.message}`);
  }
}
  try {
    const corrected = await callAPI('proofreader', { text });
    displayResult('Corrected Answer', corrected);
  } finally {
    hideLoading();
  }
}

function showLoading(message) {
  let overlay = document.getElementById('ala-loading-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'ala-loading-overlay';
    overlay.className = 'ala-loading-overlay';
    overlay.innerHTML = `
      <div class="ala-loading-modal">
        <div class="ala-loading"></div>
        <div class="loading-text">${message}</div>
      </div>
    `;
    document.body.appendChild(overlay);
  } else {
    overlay.querySelector('.loading-text').textContent = message;
  }
  overlay.style.display = 'flex';
}

function hideLoading() {
  const overlay = document.getElementById('ala-loading-overlay');
  if (overlay) {
    overlay.style.display = 'none';
  }
}

async function callAPI(api, params) {
  try {
    // Check if AI API is available
    if (!('ai' in self) || !('languageModel' in self.ai)) {
      return `AI API not available. This feature requires Google Chrome with Gemini Nano support.\n\nStep-by-step instructions:\n1. Ensure you're using the latest version of Google Chrome.\n2. Open Chrome settings and search for "Gemini Nano" or navigate to chrome://settings/?search=gemini+nano.\n3. Enable Gemini Nano if available.\n4. If not available, update Chrome to the latest stable version.\n5. Reload the extension and try again.`;
    }

    const availability = await self.ai.languageModel.availability();
    switch (availability) {
      case 'available':
        // Proceed to create session
        break;
      case 'downloadable':
        return `Gemini Nano model is available for download.\n\nTo enable:\n1. Go to Chrome settings: chrome://settings/?search=gemini+nano\n2. Toggle on "Use Gemini Nano in Chrome"\n3. Wait for the model to download\n4. Reload the page and try again.`;
      case 'downloading':
        return `Gemini Nano model is currently downloading. Please wait for the download to complete (this may take a few minutes) and try again.`;
      case 'unavailable':
      default:
        return `Gemini Nano is not available on your device or Chrome version.\n\nTroubleshooting steps:\n1. Update Google Chrome to the latest version\n2. Ensure your device meets system requirements (sufficient storage, RAM)\n3. Check if Gemini Nano is supported in your region\n4. Visit chrome://version to verify Chrome version\n5. If issues persist, Gemini Nano may not be available yet.`;
    }

    // Create session with initial system prompt and expected output language
    const session = await self.ai.languageModel.create({
      initialPrompts: [
        { role: 'system', content: 'You are a helpful AI assistant for learning and text processing tasks.' }
      ],
      expectedOutputs: [
        {
          type: 'text',
          languages: ['en'] // Specify English as the expected output language
        }
      ]
    });

    let prompt = '';

    switch (api) {
      case 'summarizer':
        prompt = `Please summarize the following text in a concise way:\n\n${params.text}`;
        break;
      case 'translator':
        prompt = `Please translate the following text to ${params.target}:\n\n${params.text}`;
        break;
      case 'prompt':
        prompt = `${params.question}\n\nContext: ${params.text}`;
        break;
      case 'writer':
        prompt = `Generate a quiz question based on this text:\n\n${params.text}`;
        break;
      case 'rewriter':
        const tone = params.level.includes('business') ? 'formal' : 'simple';
        prompt = `Rewrite the following text in a ${tone} tone, suitable for ${params.level}:\n\n${params.text}`;
        break;
      case 'proofreader':
        prompt = `Please proofread and correct the following text:\n\n${params.text}`;
        break;
      default:
        return `Unknown API: ${api}`;
    }

    return await session.prompt(prompt);
  } catch (error) {
    return `Error calling ${api} API: ${error.message}`;
  }
}

function displayResult(title, content) {
  let resultDiv = document.getElementById('ala-result');
  if (!resultDiv) {
    resultDiv = document.createElement('div');
    resultDiv.id = 'ala-result';
    resultDiv.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 380px;
      max-height: 600px;
      background: white;
      border-radius: 12px;
      padding: 24px;
      z-index: 10001;
      overflow-y: auto;
      box-shadow: 0 8px 32px rgba(0,0,0,0.15);
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      border: 1px solid rgba(255,255,255,0.2);
      backdrop-filter: blur(10px);
    `;
    document.body.appendChild(resultDiv);
  }

  // Enhanced content formatting
  let formattedContent = content;

  // Check if this is an error message
  const isError = title.includes('Error') || content.includes('AI API not available') || content.includes('AI model not available');

  if (isError) {
    // Format error messages with better styling
    formattedContent = `
      <div style="background: #fee; border-left: 4px solid #e74c3c; padding: 16px; border-radius: 8px; margin: 8px 0;">
        <div style="display: flex; align-items: center; margin-bottom: 12px;">
          <span style="font-size: 20px; margin-right: 8px;">⚠️</span>
          <strong style="color: #c0392b; font-size: 16px;">AI Feature Unavailable</strong>
        </div>
        <div style="color: #555; line-height: 1.6; font-size: 14px;">${formattedContent.replace(/\n/g, '<br>')}</div>
      </div>
    `;
  } else {
    // Format regular responses with better typography
    formattedContent = formatResponseContent(title, formattedContent);
  }

  resultDiv.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #eee;">
      <h3 style="margin: 0; color: #333; font-size: 20px; font-weight: 600; display: flex; align-items: center;">
        <span style="margin-right: 8px;">${getTitleIcon(title)}</span>
        ${title}
      </h3>
      <div style="display: flex; gap: 8px;">
        ${shouldShowExport(title) ? '<button id="export-result-btn" style="background: #4CAF50; border: none; color: white; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px;" title="Export">📄 Export</button>' : ''}
        ${shouldShowIntegrations(title) ? '<button id="integrate-quizlet-btn" style="background: #FF6B35; border: none; color: white; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px;" title="Send to Quizlet">📚 Quizlet</button>' : ''}
        ${shouldShowIntegrations(title) ? '<button id="integrate-anki-btn" style="background: #2D5AA0; border: none; color: white; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px;" title="Send to Anki">🃏 Anki</button>' : ''}
        ${shouldShowIntegrations(title) ? '<button id="integrate-classroom-btn" style="background: #34A853; border: none; color: white; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px;" title="Send to Google Classroom">🏫 Classroom</button>' : ''}
        <button id="close-result-btn" style="
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
          padding: 5px;
          border-radius: 50%;
          transition: all 0.2s;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        " title="Close">×</button>
      </div>
    </div>
    <div style="color: #555; line-height: 1.7; font-size: 15px;">${formattedContent}</div>
  `;

  // Add close functionality
  const closeBtn = resultDiv.querySelector('#close-result-btn');
  closeBtn.addEventListener('click', () => {
    resultDiv.style.display = 'none';
  });

  // Add export functionality
  const exportBtn = resultDiv.querySelector('#export-result-btn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      exportResult(title, content);
    });
  }

  // Add integration functionality
  const quizletBtn = resultDiv.querySelector('#integrate-quizlet-btn');
  if (quizletBtn) {
    quizletBtn.addEventListener('click', () => {
      integrateWithQuizlet(title, content);
    });
  }

  const ankiBtn = resultDiv.querySelector('#integrate-anki-btn');
  if (ankiBtn) {
    ankiBtn.addEventListener('click', () => {
      integrateWithAnki(title, content);
    });
  }

  const classroomBtn = resultDiv.querySelector('#integrate-classroom-btn');
  if (classroomBtn) {
    classroomBtn.addEventListener('click', () => {
      integrateWithClassroom(title, content);
    });
  }

  closeBtn.addEventListener('mouseenter', () => {
    closeBtn.style.background = '#f0f0f0';
    closeBtn.style.transform = 'scale(1.1)';
  });

  closeBtn.addEventListener('mouseleave', () => {
    closeBtn.style.background = 'none';
    closeBtn.style.transform = 'scale(1)';
  });

  resultDiv.style.display = 'block';
}

function shouldShowExport(title) {
  // Show export button for summaries and quizzes
  return title === 'Summary' || title === 'Quiz' || title.startsWith('Voice Question:');
}

function getTitleIcon(title) {
  const icons = {
    'Summary': '📝',
    'Translation': '🌍',
}

function exportResult(title, content) {
  try {
    // Create export content
    const timestamp = new Date().toLocaleString();
    const exportTitle = `${title} - ${timestamp}`;
    const exportContent = `${exportTitle}\n\n${content}\n\n--- Generated by Adaptive Learning Assistant ---`;

    // Create blob and download
    const blob = new Blob([exportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    // Create temporary download link
    const a = document.createElement('a');
    a.href = url;
    a.download = `${exportTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Clean up
    URL.revokeObjectURL(url);

    // Show success message
    showNotification('Export successful!', 'File downloaded to your downloads folder.');
  } catch (error) {
    showNotification('Export failed', `Error exporting file: ${error.message}`, 'error');
  }
}

function showNotification(message, details, type = 'success') {
  // Remove existing notification
  const existing = document.getElementById('ala-notification');
  if (existing) existing.remove();

  // Create notification element
  const notification = document.createElement('div');
  notification.id = 'ala-notification';
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#4CAF50' : '#f44336'};
    color: white;
    padding: 16px;
    border-radius: 8px;
    z-index: 10002;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    max-width: 300px;
  `;

  notification.innerHTML = `
    <div style="font-weight: 600; margin-bottom: 4px;">${message}</div>
    <div style="font-size: 14px; opacity: 0.9;">${details}</div>
  `;

  document.body.appendChild(notification);

  // Auto-remove after 3 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      notification.style.transition = 'all 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }
  }, 3000);
}
  return icons[title] || '📄';
}

// Learning platform integration functions
function integrateWithQuizlet(title, content) {
  try {
    // Create a formatted version of the content for Quizlet
    let quizletContent = '';

    if (title === 'Quiz') {
      // Parse quiz content and format for Quizlet
      quizletContent = formatForQuizlet(content);
    } else {
      // For summaries, create study cards
      quizletContent = formatSummaryForQuizlet(title, content);
    }

    // Open Quizlet create page in new tab
    const quizletUrl = `https://quizlet.com/create-set?title=${encodeURIComponent(title + ' - AI Generated')}&terms=${encodeURIComponent(quizletContent)}`;
    window.open(quizletUrl, '_blank');

    showNotification('Quizlet Integration', 'Opening Quizlet in new tab...', 'success');
  } catch (error) {
    showNotification('Quizlet Integration Failed', `Error: ${error.message}`, 'error');
  }
}

function integrateWithAnki(title, content) {
  try {
    let ankiContent = '';

    if (title === 'Quiz') {
      ankiContent = formatForAnki(content);
    } else {
      ankiContent = formatSummaryForAnki(title, content);
    }

    // Create download link for Anki-compatible text file
    const blob = new Blob([ankiContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_anki.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showNotification('Anki Export Ready', 'File downloaded. Import into Anki using "Text separated by tabs or semicolons"', 'success');
  } catch (error) {
    showNotification('Anki Export Failed', `Error: ${error.message}`, 'error');
  }
}

function integrateWithClassroom(title, content) {
  try {
    // Format content for Google Classroom assignment
    const classroomContent = formatForClassroom(title, content);

    // Copy to clipboard
    navigator.clipboard.writeText(classroomContent).then(() => {
      // Open Google Classroom in new tab
      window.open('https://classroom.google.com', '_blank');
      showNotification('Google Classroom Ready', 'Content copied to clipboard. Create new assignment in Classroom and paste the content.', 'success');
    }).catch(err => {
      showNotification('Clipboard Error', 'Could not copy to clipboard. Please manually copy the content.', 'error');
      console.log('Classroom content:', classroomContent);
    });
  } catch (error) {
    showNotification('Google Classroom Failed', `Error: ${error.message}`, 'error');
  }
}

function shouldShowExport(title) {
  // Show export button for summaries and quizzes
  return title === 'Summary' || title === 'Quiz' || title.startsWith('Voice Question:');
}

function shouldShowIntegrations(title) {
  // Show integration buttons for quizzes and summaries
  return title === 'Quiz' || title === 'Summary' || title.startsWith('Voice Question:');
}

function exportResult(title, content) {
  try {
    // Create export content
    const timestamp = new Date().toLocaleString();
    const exportTitle = `${title} - ${timestamp}`;
    const exportContent = `${exportTitle}\n\n${content}\n\n--- Generated by Adaptive Learning Assistant ---`;

    // Create blob and download
    const blob = new Blob([exportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    // Create temporary download link
    const a = document.createElement('a');
    a.href = url;
    a.download = `${exportTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Clean up
    URL.revokeObjectURL(url);

    // Show success message
    showNotification('Export successful!', 'File downloaded to your downloads folder.');
  } catch (error) {
    showNotification('Export failed', `Error exporting file: ${error.message}`, 'error');
  }
}

function showNotification(message, details, type = 'success') {
  // Remove existing notification
  const existing = document.getElementById('ala-notification');
  if (existing) existing.remove();

  // Create notification element
  const notification = document.createElement('div');
  notification.id = 'ala-notification';
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#4CAF50' : '#f44336'};
    color: white;
    padding: 16px;
    border-radius: 8px;
    z-index: 10002;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    max-width: 300px;
  `;

  notification.innerHTML = `
    <div style="font-weight: 600; margin-bottom: 4px;">${message}</div>
    <div style="font-size: 14px; opacity: 0.9;">${details}</div>
  `;

  document.body.appendChild(notification);

  // Auto-remove after 3 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      notification.style.transition = 'all 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }
  }, 3000);
}

// Content formatting functions
function formatForQuizlet(content) {
  // Convert quiz questions into Quizlet flashcard format
  const lines = content.split('\n');
  const cards = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.match(/^\d+\./) || line.includes('?')) {
      // This is a question
      const question = line.replace(/^\d+\.\s*/, '');
      // Look for answer in next lines
      let answer = '';
      for (let j = i + 1; j < lines.length && j < i + 3; j++) {
        if (lines[j].trim() && !lines[j].match(/^\d+\./)) {
          answer += lines[j].trim() + ' ';
        } else {
          break;
        }
      }
      if (question && answer.trim()) {
        cards.push(`${question.trim()};${answer.trim()}`);
      }
    }
  }

  return cards.join('\n');
}

function formatSummaryForQuizlet(title, content) {
  // Break summary into key points for flashcards
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const cards = [];

  sentences.forEach((sentence, index) => {
    const key = `Key Point ${index + 1}`;
    const value = sentence.trim();
    if (value) {
      cards.push(`${key};${value}`);
    }
  });

  return cards.join('\n');
}

function formatForAnki(content) {
  // Format for Anki import (tab-separated)
  const lines = content.split('\n');
  const cards = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.match(/^\d+\./) || line.includes('?')) {
      const question = line.replace(/^\d+\.\s*/, '');
      let answer = '';
      for (let j = i + 1; j < lines.length && j < i + 3; j++) {
        if (lines[j].trim() && !lines[j].match(/^\d+\./)) {
          answer += lines[j].trim() + ' ';
        } else {
          break;
        }
      }
      if (question && answer.trim()) {
        cards.push(`${question.trim()}\t${answer.trim()}`);
      }
    }
  }

  return cards.join('\n');
}

function formatSummaryForAnki(title, content) {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const cards = [];

  sentences.forEach((sentence, index) => {
    const front = `Key Point ${index + 1}`;
    const back = sentence.trim();
    if (back) {
      cards.push(`${front}\t${back}`);
    }
  });

  return cards.join('\n');
}

function formatForClassroom(title, content) {
  return `📚 AI-Generated Study Material

${title}

${content}

---
Generated by Adaptive Learning Assistant
Chrome Extension for AI-Powered Learning`;
}

function formatResponseContent(title, content) {
  let formatted = content.replace(/\n/g, '<br>');

  // Special formatting for different response types
  switch (title) {
    case 'Translation':
      formatted = `<div style="background: #f0f8ff; padding: 16px; border-radius: 8px; border-left: 4px solid #667eea;">
        <div style="font-style: italic; color: #666; margin-bottom: 8px; font-size: 13px;">Translated Text:</div>
        <div style="color: #2c3e50; font-weight: 500;">${formatted}</div>
      </div>`;
      break;

    case 'Summary':
      formatted = `<div style="background: #fff8e1; padding: 16px; border-radius: 8px; border-left: 4px solid #ffb300;">
        <div style="font-weight: 600; color: #f57c00; margin-bottom: 12px;">📋 Key Points:</div>
        <div style="line-height: 1.8;">${formatted}</div>
      </div>`;
      break;

    case 'Answer':
      formatted = `<div style="background: #e8f5e8; padding: 16px; border-radius: 8px; border-left: 4px solid #4caf50;">
        <div style="font-weight: 600; color: #2e7d32; margin-bottom: 12px;">💡 AI Response:</div>
        <div style="line-height: 1.8;">${formatted}</div>
      </div>`;
      break;

    case 'Quiz':
      // Format quiz questions with better structure
      formatted = formatted.replace(/(\d+\.\s*[^?]+\?)/g, '<div style="font-weight: 600; color: #1976d2; margin: 12px 0 8px 0;">$1</div>');
      formatted = `<div style="background: #f3e5f5; padding: 16px; border-radius: 8px; border-left: 4px solid #9c27b0;">
        <div style="font-weight: 600; color: #7b1fa2; margin-bottom: 12px;">🧠 Quiz Questions:</div>
        <div style="line-height: 1.8;">${formatted}</div>
      </div>`;
      break;

    case 'Simplified':
      formatted = `<div style="background: #fff3e0; padding: 16px; border-radius: 8px; border-left: 4px solid #ff9800;">
        <div style="font-weight: 600; color: #e65100; margin-bottom: 12px;">🔄 Simplified Version:</div>
        <div style="line-height: 1.8; font-size: 15px;">${formatted}</div>
      </div>`;
      break;

    case 'Corrected Answer':
      formatted = `<div style="background: #e3f2fd; padding: 16px; border-radius: 8px; border-left: 4px solid #2196f3;">
        <div style="font-weight: 600; color: #0d47a1; margin-bottom: 12px;">✓ Corrected Version:</div>
        <div style="line-height: 1.8;">${formatted}</div>
      </div>`;
      break;

    default:
      formatted = `<div style="line-height: 1.8;">${formatted}</div>`;
  }

  return formatted;
}