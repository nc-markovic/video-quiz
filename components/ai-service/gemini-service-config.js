// Gemini API Configuration
// Set API_KEY to null to use localStorage or prompt user
export const API_KEY = null;

export const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';

export const DEFAULT_MODEL = 'gemini-1.5-flash-latest';

export const GENERATION_CONFIG = {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 1024,
    responseMimeType: "application/json"
};

export const API_KEY_INSTRUCTIONS = `
🔑 To get your Gemini API key:

1. Go to https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key

⚠️ Important:
- Keep your API key secure and private
- Don't share it publicly or commit it to version control
- The key will be stored locally in your browser

Your API key will be saved securely in your browser's local storage.
`;