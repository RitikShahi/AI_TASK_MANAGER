import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not defined in environment variables');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Add delay function for rate limiting
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function generateTasks(topic: string): Promise<string[]> {
  try {
    // Add a small delay to avoid rate limiting
    await delay(1000);
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }); // Use faster model
    
    const prompt = `Generate exactly 5 actionable, specific learning tasks for "${topic}". 
    Each task should be:
    - Practical and achievable for a beginner to intermediate learner
    - Specific with clear outcomes
    - Progressive in difficulty (from basic to more advanced)
    - Focused on hands-on learning and practice
    - Between 5-15 words long
    
    Return only the task titles, one per line, without numbers, bullet points, or extra formatting.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Split by lines and clean up
    const tasks = text
      .split('\n')
      .map(task => task.trim())
      .filter(task => task.length > 0 && !task.match(/^\d+\.?\s*/))
      .slice(0, 5);

    if (tasks.length === 0) {
      throw new Error('No valid tasks generated');
    }

    return tasks;
  } catch (error: any) {
    console.error('Error generating tasks with Gemini:', error);
    
    // Better error handling based on search results
    if (error.message?.includes('429')) {
      throw new Error('Rate limit exceeded. Please wait a moment and try again.');
    }
    if (error.message?.includes('403')) {
      throw new Error('API key permission denied. Please check your API key.');
    }
    if (error.message?.includes('400')) {
      throw new Error('Invalid request. Please try a different topic.');
    }
    if (error.message?.includes('SAFETY')) {
      throw new Error('Content blocked by safety filters. Please try a different topic.');
    }
    
    throw new Error('Failed to generate tasks. Please try again.');
  }
}
