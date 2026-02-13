/**
 * Privacy consent management utilities
 */

const CONSENT_KEY = 'privacy_consent_given';
const CONSENT_TIMESTAMP_KEY = 'privacy_consent_timestamp';

export interface ConsentStatus {
  given: boolean;
  timestamp?: number;
}

/**
 * Check if user has given privacy consent
 */
export async function hasPrivacyConsent(): Promise<ConsentStatus> {
  return new Promise((resolve) => {
    chrome.storage.local.get([CONSENT_KEY, CONSENT_TIMESTAMP_KEY], (result) => {
      resolve({
        given: result[CONSENT_KEY] === true,
        timestamp: result[CONSENT_TIMESTAMP_KEY]
      });
    });
  });
}

/**
 * Store user's privacy consent decision
 */
export async function setPrivacyConsent(given: boolean): Promise<void> {
  return new Promise((resolve) => {
    const data = {
      [CONSENT_KEY]: given,
      [CONSENT_TIMESTAMP_KEY]: Date.now()
    };
    chrome.storage.local.set(data, () => {
      resolve();
    });
  });
}

/**
 * Revoke privacy consent (for use in settings)
 */
export async function revokePrivacyConsent(): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.remove([CONSENT_KEY, CONSENT_TIMESTAMP_KEY], () => {
      resolve();
    });
  });
}
