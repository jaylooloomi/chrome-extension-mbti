# Privacy Policy for Chrome Extension MBTI

**Last Updated:** February 14, 2025

## Overview

Chrome Extension MBTI is a browser extension that analyzes your bookmarks to provide MBTI personality insights. We are committed to protecting your privacy and being transparent about how we handle your data.

## Information We Collect

### Bookmarks Data
- **What:** Bookmark titles, URLs, folder structure, and organization
- **How:** Read directly from your browser's bookmark storage via Chrome Extension API
- **Why:** To analyze your interests and browsing patterns for MBTI personality insights

### User Settings
- **What:** Your API key (encrypted), privacy consent status, excluded folder preferences
- **How:** Stored locally in your browser using chrome.storage.local
- **Why:** To personalize your experience and respect your privacy preferences

### Technical Data
- **What:** Extension version, error logs (local only)
- **How:** Generated during extension operation
- **Why:** To improve extension functionality and debug issues

## How We Use Your Data

### AI Analysis
Your bookmark data is sent to **Google Gemini AI** for personality analysis:
- Data is transmitted directly from your browser to Google's API
- We do not store your bookmarks on any server
- Analysis happens in real-time and results are displayed immediately

### Local Storage Only
- All data remains on your device
- Your API key is encrypted using AES-GCM encryption (256-bit)
- No data is sent to our servers or any third parties except Google Gemini AI

## Third-Party Services

### Google Gemini AI
- **Purpose:** To analyze your bookmarks and generate MBTI personality insights
- **Data Shared:** Bookmark titles, URLs, and folder structure (filtered based on your exclusion settings)
- **Privacy Policy:** [Google AI Terms of Service](https://ai.google.dev/terms)

We do not share your data with any other third parties.

## Your Privacy Rights

### Data Control
- **Exclude Folders:** You can exclude sensitive bookmark folders from analysis
- **Revoke Consent:** Withdraw your privacy consent at any time through settings
- **Delete Data:** Clear all stored data including encrypted API keys through settings
- **Access Data:** All data is stored locally and accessible through browser DevTools

### Data Security Measures
1. **Encryption:** API keys encrypted with AES-GCM before storage
2. **Content Security Policy:** Strict CSP prevents unauthorized script execution
3. **Local Storage:** No server-side storage or data transmission beyond AI analysis
4. **Minimal Permissions:** Extension requests only necessary Chrome permissions (bookmarks, storage)

## Data Retention

- **Bookmarks:** Never stored, read on-demand only
- **API Key:** Stored encrypted until you manually delete it
- **Privacy Consent:** Stored until you revoke or reinstall extension
- **Excluded Folders:** Stored until you change settings or reinstall

## Children's Privacy

This extension is not intended for users under 13 years of age. We do not knowingly collect data from children.

## Changes to This Policy

We may update this privacy policy to reflect changes in:
- Extension functionality
- Legal requirements
- Privacy best practices

When we make significant changes, we will notify you through:
- In-extension notification
- Updated "Last Updated" date in this document

## Compliance

This extension complies with:
- Chrome Web Store Developer Program Policies
- General Data Protection Regulation (GDPR)
- California Consumer Privacy Act (CCPA)

## Your Consent

By using Chrome Extension MBTI, you consent to:
- Collection and processing of your bookmark data as described
- Transmission of filtered bookmark data to Google Gemini AI
- Local storage of encrypted API keys and preferences

You may withdraw consent at any time through the extension settings.

## Contact Us

If you have questions or concerns about this privacy policy or your data:

**Email:** jaylooloomi@gmail.com  
**GitHub:** [jaylooloomi/chrome-extension-mbti](https://github.com/jaylooloomi/chrome-extension-mbti)

We will respond to privacy inquiries within 7 business days.

## Technical Details

### Encryption Specifications
- **Algorithm:** AES-GCM (Advanced Encryption Standard - Galois/Counter Mode)
- **Key Size:** 256 bits
- **IV:** Unique 96-bit initialization vector for each encryption
- **Implementation:** Web Crypto API (window.crypto.subtle)

### Data Transmission
- **Protocol:** HTTPS only
- **Endpoint:** Google Gemini AI API
- **Payload:** JSON containing filtered bookmark metadata
- **Response:** MBTI analysis results (not stored)

### Permissions Justification
- **bookmarks:** Read bookmark data for analysis
- **storage:** Store encrypted API keys and user preferences locally
- No network permissions beyond API calls (content_security_policy enforced)

---

**Developer:** Arthur Wang  
**Repository:** https://github.com/jaylooloomi/chrome-extension-mbti  
**License:** [Check repository for license information]
