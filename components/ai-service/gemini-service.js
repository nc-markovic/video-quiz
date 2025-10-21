import { API_KEY, BASE_URL, DEFAULT_MODEL, GENERATION_CONFIG, API_KEY_INSTRUCTIONS } from './gemini-service-config.js';

export class GeminiService {
    constructor(apiKey = null) {
        // Only use config API_KEY if it's explicitly set (not null)
        this.apiKey = apiKey || (API_KEY !== null ? API_KEY : this.getStoredApiKey());
        this.baseUrl = BASE_URL;
        this.model = DEFAULT_MODEL;
        this.defaultGenerationConfig = GENERATION_CONFIG;
        this.apiKeyInstructions = API_KEY_INSTRUCTIONS;
    }
    
    // Get API key from localStorage or prompt user
    getStoredApiKey() {
        const stored = localStorage.getItem('gemini_api_key');
        if (stored) {
            return stored;
        }
        
        // If no stored key, prompt user with enhanced instructions
        const instructionText = this.apiKeyInstructions ? 
            `${this.apiKeyInstructions.title}\n\n` +
            this.apiKeyInstructions.steps.map((step, i) => `${i + 1}. ${step}`).join('\n') +
            `\n\n${this.apiKeyInstructions.note}\n\nPlease enter your API key:` :
            'Please enter your Gemini API key.\n\n' +
            'To get a free API key:\n' +
            '1. Go to https://aistudio.google.com/\n' +
            '2. Sign in with your Google account\n' +
            '3. Click "Get API key" and create a new key\n' +
            '4. Copy the key and paste it here';
        
        const userKey = prompt(instructionText);
        
        if (userKey && userKey.trim()) {
            localStorage.setItem('gemini_api_key', userKey.trim());
            return userKey.trim();
        }
        
        return null;
    }
    
    // Set API key programmatically
    setApiKey(apiKey) {
        this.apiKey = apiKey;
        if (apiKey) {
            localStorage.setItem('gemini_api_key', apiKey);
        } else {
            localStorage.removeItem('gemini_api_key');
        }
    }
    
    // Check if API key is available
    hasApiKey() {
        return !!this.apiKey;
    }
    
    // Generate quiz questions from image URL
    async generateQuizFromImage(imageUrl, options = {}) {
        if (!this.apiKey) {
            throw new Error('Gemini API key is required. Please set your API key first.');
        }
        
        const {
            numQuestions = 5,
            difficulty = 'medium',
            questionTypes = ['multiple_choice'],
            subject = 'general'
        } = options;
        
        try {
            // First, try to get available models and use the best one
            const availableModels = await this.getAvailableModels();
            const imageModel = this.findBestImageModel(availableModels);
            
            if (!imageModel) {
                throw new Error('No suitable model found for image processing');
            }
            
            const prompt = this.buildPrompt(numQuestions, difficulty, questionTypes, subject);
            
            const requestBody = {
                contents: [{
                    parts: [
                        {
                            text: prompt
                        },
                        {
                            inline_data: {
                                mime_type: "image/jpeg",
                                data: await this.imageUrlToBase64(imageUrl)
                            }
                        }
                    ]
                }],
                generationConfig: this.defaultGenerationConfig
            };
            
            const response = await fetch(
                `${this.baseUrl}/models/${imageModel}:generateContent?key=${this.apiKey}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody)
                }
            );
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API Error: ${errorData.error?.message || 'Unknown error'}`);
            }
            
            const data = await response.json();
            const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (!generatedText) {
                throw new Error('No quiz questions generated');
            }
            
            return this.parseQuizQuestions(generatedText);
            
        } catch (error) {
            console.error('Error generating quiz from image:', error);
            throw error;
        }
    }
    
    // Convert image URL to base64
    async imageUrlToBase64(imageUrl) {
        try {
            const response = await fetch(imageUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch image: ${response.statusText}`);
            }
            
            const blob = await response.blob();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const base64 = reader.result.split(',')[1];
                    resolve(base64);
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            throw new Error(`Failed to process image: ${error.message}`);
        }
    }
    
    // Build the prompt for quiz generation
    buildPrompt(numQuestions, difficulty, questionTypes, subject) {
        const difficultyText = {
            'easy': 'easy (suitable for beginners)',
            'medium': 'medium (moderate difficulty)',
            'hard': 'hard (challenging for experts)'
        }[difficulty] || 'medium';
        
        const typeText = questionTypes.includes('multiple_choice') ? 'multiple choice' : 'various types';
        
        return `Analyze the provided image and generate ${numQuestions} quiz questions about what you see in the image.

Requirements:
- Generate ${numQuestions} questions of ${typeText} format
- Difficulty level: ${difficultyText}
- Subject focus: ${subject}
- Each question should have 4 answer options (A, B, C, D)
- Mark the correct answer clearly
- Questions should be based on observable elements in the image
- Make questions educational and engaging

Format your response as a JSON array with this structure:
[
  {
    "question": "What is the main subject of this image?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 1,
    "explanation": "Brief explanation of why this answer is correct"
  }
]

Please ensure the JSON is valid and properly formatted.`;
    }
    
    // Parse the generated quiz questions from AI response
    parseQuizQuestions(text) {
        try {
            // Extract JSON from the response (in case there's extra text)
            const jsonMatch = text.match(/\[[\s\S]*\]/);
            if (!jsonMatch) {
                throw new Error('No valid JSON found in response');
            }
            
            const questions = JSON.parse(jsonMatch[0]);
            
            // Validate the structure
            if (!Array.isArray(questions)) {
                throw new Error('Response is not an array');
            }
            
            // Validate each question
            const validatedQuestions = questions.map((q, index) => {
                if (!q.question || !q.options || !Array.isArray(q.options) || q.options.length !== 4) {
                    throw new Error(`Invalid question structure at index ${index}`);
                }
                
                if (typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
                    throw new Error(`Invalid correctAnswer at index ${index}`);
                }
                
                return {
                    question: q.question,
                    options: q.options,
                    correctAnswer: q.correctAnswer,
                    explanation: q.explanation || 'No explanation provided'
                };
            });
            
            return validatedQuestions;
            
        } catch (error) {
            console.error('Error parsing quiz questions:', error);
            
            // Fallback: try to create basic questions
            return this.createFallbackQuestions();
        }
    }
    
    // Create fallback questions if AI response parsing fails
    createFallbackQuestions() {
        return [
            {
                question: "What type of image is this?",
                options: ["Nature scene", "Urban landscape", "Abstract art", "Portrait"],
                correctAnswer: 0,
                explanation: "This is a fallback question. Please check your API key and try again."
            },
            {
                question: "What colors are most prominent in this image?",
                options: ["Blue and green", "Red and orange", "Black and white", "Purple and pink"],
                correctAnswer: 0,
                explanation: "This is a fallback question. Please check your API key and try again."
            },
            {
                question: "What is the mood of this image?",
                options: ["Peaceful", "Energetic", "Mysterious", "Sad"],
                correctAnswer: 0,
                explanation: "This is a fallback question. Please check your API key and try again."
            }
        ];
    }
    
    // Test API connection
    async testConnection() {
        if (!this.apiKey) {
            return { success: false, error: 'No API key provided' };
        }
        
        try {
            const response = await fetch(
                `${this.baseUrl}/models?key=${this.apiKey}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
            
            if (!response.ok) {
                const errorData = await response.json();
                return { 
                    success: false, 
                    error: errorData.error?.message || 'API connection failed' 
                };
            }
            
            return { success: true, message: 'API connection successful' };
            
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    // Get available models
    async getAvailableModels() {
        if (!this.apiKey) {
            throw new Error('API key is required');
        }
        
        try {
            const response = await fetch(
                `${this.baseUrl}/models?key=${this.apiKey}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
            
            if (!response.ok) {
                throw new Error('Failed to fetch models');
            }
            
            const data = await response.json();
            return data.models || [];
            
        } catch (error) {
            throw new Error(`Failed to get models: ${error.message}`);
        }
    }
    
    // Find the best model for image processing
    findBestImageModel(models) {
        // Priority order for image-capable models
        const preferredModels = [
            'gemini-1.5-flash-latest',
            'gemini-1.5-flash',
            'gemini-1.5-pro-latest',
            'gemini-1.5-pro',
            'gemini-pro-vision',
            'gemini-pro'
        ];
        
        // Find the first available model that supports image input
        for (const modelName of preferredModels) {
            const model = models.find(m => m.name === `models/${modelName}`);
            if (model && model.supportedGenerationMethods?.includes('generateContent')) {
                return modelName;
            }
        }
        
        // Fallback: look for any model with 'vision' or 'flash' in the name
        const visionModel = models.find(m => 
            m.name.includes('vision') || 
            m.name.includes('flash') ||
            m.name.includes('pro')
        );
        
        if (visionModel) {
            return visionModel.name.replace('models/', '');
        }
        
        return null;
    }
}

// Create and export singleton instance
export const geminiService = new GeminiService();
