// Gemini API Service Configuration
// Configuration for Gemini API integration

export const GEMINI_CONFIG = {
    // API key should be provided by user - NOT stored in code
    API_KEY: null,
    
    // API configuration
    BASE_URL: 'https://generativelanguage.googleapis.com/v1beta',
    DEFAULT_MODEL: 'gemini-1.5-flash-latest',
    
    // Default generation settings
    GENERATION_CONFIG: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
    },
    
    // Instructions for users to get API key
    API_KEY_INSTRUCTIONS: {
        title: 'Get Your Free Gemini API Key',
        steps: [
            'Go to https://aistudio.google.com/',
            'Sign in with your Google account',
            'Click "Get API key" in the left sidebar',
            'Create a new API key',
            'Copy the key and paste it when prompted'
        ],
        note: 'The API key is free and allows you to generate AI-powered quiz questions from images.'
    }
};

// Export individual values for convenience
export const { API_KEY, BASE_URL, DEFAULT_MODEL, GENERATION_CONFIG, API_KEY_INSTRUCTIONS } = GEMINI_CONFIG;