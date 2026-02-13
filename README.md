# MBTI Test Chrome Extension

A Chrome extension that analyzes your browsing bookmarks to provide MBTI personality insights using Google's Gemini AI.

Original design available at: https://www.figma.com/design/nhlzSfASAJIc81wEKq6lLc/MBTI-Test-Google-Extension

## Features

### Core Functionality
- 📊 **Bookmark Analysis**: Analyzes your Chrome bookmarks to determine your MBTI personality type
- 🤖 **AI-Powered**: Uses Google Gemini AI for intelligent personality insights
- 🎨 **Modern UI**: Clean, intuitive interface built with React and TypeScript

### Privacy & Security Features
- 🔒 **Encrypted API Key Storage**: Your Gemini API key is encrypted using AES-GCM 256-bit encryption
- ✅ **Privacy Consent**: First-time setup with clear privacy consent mechanism
- 🛡️ **Content Security Policy**: Strict CSP prevents XSS attacks and limits connections to Google AI API only
- 🗂️ **Bookmark Filtering**: Choose which bookmark folders to exclude from analysis (e.g., work folders, private collections)
- 📄 **Transparent Privacy Policy**: Clear documentation of data collection and usage

## Installation

### From Chrome Web Store
*(Coming soon)*

### For Development

1. Clone the repository:
```bash
git clone https://github.com/jaylooloomi/chrome-extension-mbti.git
cd chrome-extension-mbti
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `dist` folder from the project directory

## Setup

### Getting a Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Get API Key" or "Create API Key"
4. Copy the generated API key

### Configuring the Extension

1. Click the extension icon in Chrome
2. On first launch, you'll see a privacy consent dialog:
   - Review what data is collected
   - Accept or decline the privacy terms
3. Enter your Gemini API key in the settings
   - Your API key is encrypted and stored locally
   - It never leaves your browser except to call Google's API
4. (Optional) Configure bookmark filtering:
   - Go to Settings → Privacy
   - Select folders you want to exclude from analysis

## Privacy

Your privacy is our priority. This extension:

- ✅ Stores all data locally on your device
- ✅ Encrypts sensitive information (API keys)
- ✅ Only sends bookmark metadata to Google Gemini for analysis
- ✅ Allows you to exclude sensitive bookmark folders
- ✅ Requires explicit consent before collecting any data
- ❌ Does NOT store your data on external servers
- ❌ Does NOT share your information with third parties (except Google AI for analysis)

Read our full [Privacy Policy](PRIVACY.md) for details.

## Technology Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **AI**: Google Gemini API
- **Security**: Web Crypto API (AES-GCM encryption)
- **Storage**: Chrome Storage API

## Project Structure

```
chrome-extension-mbti/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── PrivacyConsent.tsx      # Privacy consent modal
│   │   │   └── BookmarkFilterSettings.tsx  # Bookmark filtering UI
│   │   ├── utils/
│   │   │   ├── secureStorage.ts        # Encrypted storage utilities
│   │   │   ├── bookmarkFilter.ts       # Bookmark filtering logic
│   │   │   └── privacy.ts              # Privacy consent management
│   │   └── App.tsx
│   ├── manifest.json                    # Extension manifest with CSP
│   └── ...
├── PRIVACY.md                           # Privacy policy
└── README.md
```

## Development

### Building for Production

```bash
npm run build
```

The production-ready extension will be in the `dist` folder.

### Running Tests

```bash
npm test
```

## Security

### Encryption
- API keys are encrypted using AES-GCM with 256-bit keys
- Each encryption uses a unique initialization vector (IV)
- Encryption keys are derived from browser-specific data

### Content Security Policy
The extension enforces strict CSP rules:
- Scripts: Only self-hosted scripts allowed
- Connections: Limited to `https://generativelanguage.googleapis.com` (Gemini API)
- No inline scripts or eval()
- No external resources

### Data Handling
- All processing happens locally in your browser
- Bookmark data is only sent to Google Gemini API for analysis
- No telemetry or analytics tracking
- No data persistence on external servers

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions, issues, or feedback:
- Open an issue on [GitHub](https://github.com/jaylooloomi/chrome-extension-mbti/issues)
- Email: jaylooloomi@gmail.com

## Acknowledgments

- Design: Original Figma design by project creator
- AI: Powered by Google Gemini API
- Icons and UI: React and Tailwind CSS community

---

**Note**: This extension requires a Google Gemini API key to function. The API key is stored encrypted locally and used only to communicate with Google's AI services.
