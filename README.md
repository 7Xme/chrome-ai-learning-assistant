# 🧠 Adaptive Learning Assistant

A powerful Chrome extension that transforms passive reading into active, personalized learning using AI-powered tools. Leverage Google's Gemini Nano for instant text analysis, translation, quizzes, and more.

> **🏆 Google Chrome Built-in AI Challenge 2025 Entry**
> Innovate with Intelligence: Build the Future of the Web with Gemini Nano and Chrome AI

![Adaptive Learning Assistant](https://img.shields.io/badge/Chrome-Extension-blue?logo=google-chrome)
![Gemini Nano](https://img.shields.io/badge/AI-Gemini%20Nano-green?logo=google)
![Built-in AI Challenge](https://img.shields.io/badge/Google-Chrome%20AI%20Challenge-orange?logo=google)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

- **📝 Summarize**: Get concise summaries of any text selection
## 🎯 Challenge Entry Details

This project was created for the **Google Chrome Built-in AI Challenge 2025** as a Chrome Extension entry.

### **APIs Used**
- ✅ **Prompt API**: For answering questions about selected text
- ✅ **Summarizer API**: For creating concise text summaries
- ✅ **Translator API**: For multilingual text translation
- ✅ **Writer API**: For generating quiz questions
- ✅ **Rewriter API**: For text simplification
- ✅ **Proofreader API**: For checking and correcting answers

### **Problem Solved**
Transforms passive reading into active learning by providing instant AI-powered analysis tools directly in the browser, making education more accessible and engaging without requiring server-side processing or internet connectivity.

### **Target Audience**
- Students and learners across all age groups
- Researchers and academics
- Language learners
- Professionals seeking to simplify complex documents
- Anyone wanting to make reading more interactive and educational

---

- **🌍 Translate**: Translate text to your preferred language
- **❓ Ask Questions**: Get AI-powered answers about selected text
- **📚 Generate Quizzes**: Create interactive quiz questions
- **🔄 Simplify**: Make complex text easier to understand
- **✓ Check Answers**: Proofread and correct your responses

## 🚀 Quick Start

### Installation

1. **Download the Extension**
   ```bash
   git clone https://github.com/yourusername/adaptive-learning-assistant.git
   cd adaptive-learning-assistant
   ```

2. **Enable Developer Mode**
   - Open Chrome and go to `chrome://extensions/`
   - Toggle "Developer mode" in the top right corner

3. **Load the Extension**
   - Click "Load unpacked"
   - Select the project folder
   - The extension will appear in your extensions list

4. **Enable Gemini Nano**
   - Ensure you're using the latest version of Google Chrome
   - Go to `chrome://settings/?search=gemini+nano`
   - Enable "Use Gemini Nano in Chrome"
   - Wait for the model to download if prompted

## 🎯 How to Use

### Basic Usage

1. **Select Text**: Highlight any text on any webpage
2. **Right-Click Menu**: A floating menu will appear with AI tools
3. **Choose Action**: Click any button to perform AI analysis
4. **View Results**: Results appear in a modal window
5. **Close Results**: Click the × button to close the modal

### Advanced Features

#### Translation
- Set your default target language in Settings
- Click "Translate" on selected text
- Enter target language or use your default

#### Simplification
- Choose simplification level in Settings
- Options range from "5th Grader" to "Technical Expert"
- Perfect for breaking down complex concepts

#### Quiz Generation
- Select study material
- Click "Quiz" to generate questions
- Use for self-testing and reinforcement

## ⚙️ Settings

Access settings by clicking the extension icon and then "Settings":

### Translation Settings
- **Default Target Language**: Set your preferred translation language
- Automatically filled when using translation feature

### Simplification Settings
- **Default Level**: Choose how complex text should be simplified
- Options: 5th Grader, Middle School, High School, Business Professional, Technical Expert

### Theme Settings
- **Theme**: Choose light, dark, or auto (system preference)
- Affects the appearance of floating UI and result modals

## 🔧 Technical Details

### Requirements
- **Browser**: Google Chrome (latest stable version)
- **AI Model**: Gemini Nano (built-in Chrome AI)
- **Permissions**: Active tab access, scripting, storage, microphone (for voice input)

### Keyboard Shortcuts
- **Ctrl+Shift+S**: Summarize selected text
- **Ctrl+Shift+T**: Translate selected text
- **Ctrl+Shift+Q**: Ask questions about selected text
- **Ctrl+Shift+V**: Voice input for questions (uses microphone)
- **Ctrl+Shift+Z**: Generate quiz from selected text
- **Ctrl+Shift+R**: Simplify selected text
- **Ctrl+Shift+C**: Check/correct answers

### Architecture
```
adaptive-learning-assistant/
├── manifest.json          # Extension manifest
├── background.js          # Background service worker
├── html/
│   ├── popup.html         # Extension popup interface
│   └── options.html       # Settings page
├── js/
│   ├── popup.js          # Popup functionality
│   ├── content.js        # Content script with AI tools
│   └── options.js        # Settings page logic
├── css/
│   └── content.css       # Styles for floating UI
└── icons/
    └── téléchargement.png # Extension icons
```

### AI Integration
- Uses Chrome's built-in Gemini Nano model
- Requires explicit language specification (`en` for English)
- Handles various availability states (available/downloadable/downloading/unavailable)

## 🛠️ Development

### Prerequisites
- Node.js (for any build tools if added later)
- Google Chrome with Developer Mode enabled

### Building
```bash
# No build process required - pure Chrome extension
# Just load the unpacked extension in Chrome
```

### Testing
1. Load extension in Chrome developer mode
2. Test all AI features on various websites
3. Verify error handling when AI is unavailable
4. Test settings page functionality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋 Support

### Common Issues

**"AI API not available" Error**
- Ensure Chrome is updated to the latest version
- Enable Gemini Nano in Chrome settings
- Check that your device supports the required AI features

**Extension not loading**
## 🏆 Challenge Alignment

This project aligns with the Google Chrome Built-in AI Challenge 2025 criteria:

### **Functionality** ⭐⭐⭐⭐⭐
- **Scalable**: Works across all websites and content types
- **API Usage**: Utilizes 6 different Chrome AI APIs effectively
- **Global Reach**: Supports multiple languages and user types
- **Offline Capability**: Functions without internet connectivity

### **Purpose** ⭐⭐⭐⭐⭐
- **User Journey Improvement**: Transforms passive reading into active learning
- **New Capability**: Brings AI-powered education tools directly to the browser
- **Accessibility**: Makes advanced learning tools available to everyone

### **Content** ⭐⭐⭐⭐⭐
- **Creative Implementation**: Innovative use of floating UI and modal interactions
- **Visual Quality**: Modern, professional design with smooth animations
- **User-Centric**: Intuitive icons and clear visual hierarchy

### **User Experience** ⭐⭐⭐⭐⭐
- **Ease of Use**: One-click text selection and tool access
- **Error Handling**: Comprehensive error states with helpful guidance
- **Settings Management**: Intuitive configuration with real-time validation

### **Technological Execution** ⭐⭐⭐⭐⭐
- **API Showcase**: Demonstrates all core Chrome AI APIs
- **Best Practices**: Proper error handling, loading states, and user feedback
- **Performance**: Client-side processing with no server dependencies

---

**Submission Details for Challenge:**
- **Entry Type**: Chrome Extension
- **APIs Used**: Prompt, Summarizer, Translator, Writer, Rewriter, Proofreader
- **Demo Video**: [Link to be added]
- **Live Demo**: Available through Chrome Web Store or direct extension loading
- **GitHub Repository**: Public with comprehensive documentation

---

- Verify all files are in the correct directory structure
- Check manifest.json for syntax errors
- Ensure Developer Mode is enabled in Chrome extensions

**Settings not saving**
- Check browser console for errors
- Verify Chrome storage permissions
- Try refreshing the settings page

### Getting Help

- **Issues**: [GitHub Issues](https://github.com/yourusername/adaptive-learning-assistant/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/adaptive-learning-assistant/discussions)

## 🔮 Future Enhancements

- [x] Voice-to-text for question asking
- [x] Export functionality for summaries and quizzes
- [ ] Integration with popular learning platforms
- [ ] Custom AI model fine-tuning
- [ ] Multi-language support expansion
- [x] Dark mode theme
- [x] Keyboard shortcuts

## 📊 Version History

### v1.0.0
- Initial release with core AI features
- Modern UI design
- Comprehensive error handling
- Settings page with validation

---

**Made with ❤️ using Chrome's Gemini Nano AI**

Transform your reading experience with the power of AI! 🚀