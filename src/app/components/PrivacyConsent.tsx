import React from 'react';

interface PrivacyConsentProps {
  onAccept: () => void;
  onDecline: () => void;
}

const PrivacyConsent: React.FC<PrivacyConsentProps> = ({ onAccept, onDecline }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6">
        <h2 className="text-2xl font-bold mb-4">Privacy Consent</h2>

        <div className="space-y-4 mb-6 text-gray-700">
          <p>
            Welcome to Chrome Extension MBTI! Before you start using this extension, 
            please review and accept our data collection practices.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
            <h3 className="font-semibold mb-2">What data we collect:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Bookmark metadata (titles, URLs, folder structure)</li>
              <li>API usage statistics</li>
              <li>Extension settings and preferences</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
            <h3 className="font-semibold mb-2">How we use your data:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Your bookmarks are analyzed by Google Gemini AI to provide MBTI personality insights</li>
              <li>Data is sent to Google's servers for processing</li>
              <li>We do not store your data on our servers</li>
              <li>All data remains local to your browser except when sent to Google AI API</li>
            </ul>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-4">
            <h3 className="font-semibold mb-2">Your privacy rights:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>You can revoke consent at any time in settings</li>
              <li>You can exclude sensitive bookmark folders from analysis</li>
              <li>Your API key is encrypted and stored locally</li>
            </ul>
          </div>

          <p className="text-sm">
            By clicking "Accept", you agree to our{' '}
            <a 
              href="#" 
              className="text-blue-600 hover:underline"
              onClick={(e) => {
                e.preventDefault();
                chrome.tabs.create({ url: 'https://github.com/jaylooloomi/chrome-extension-mbti/blob/main/PRIVACY.md' });
              }}
            >
              Privacy Policy
            </a>
            {' '}and consent to data collection as described above.
          </p>
        </div>

        <div className="flex gap-4 justify-end">
          <button
            onClick={onDecline}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={onAccept}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyConsent;
