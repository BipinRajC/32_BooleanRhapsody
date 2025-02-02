import { Injectable } from '@nestjs/common';
//import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import { DocumentRetrievalUtil } from './utils';
import Groq from 'groq-sdk';
import Anthropic from '@anthropic-ai/sdk';
import axios from 'axios';

// @Injectable()
//export class AiApiHandlerService {
// private readonly genAI: GoogleGenerativeAI;
//private readonly model: any;

//constructor(private readonly configService: ConfigService) {
//  this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
//}

//async getSummaryFromAiModel(prompt: string): Promise<string> {
//const result = await this.model.generateContent(prompt);
//const response = result.response;
//const text = response.text();
//return text;
//}

dotenv.config();

@Injectable()
export class AiApiHandlerService {
  private readonly groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
  private readonly geminiClient = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY,
  );
  private readonly claudeClient = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY,
  });

  async getSummaryFromAiModel(prompt: string, provider: string) {
    try {
      if (prompt.length > 1000) {
        const response = await axios.post(
          'http://localhost:5001/api/summarize',
          {
            content: prompt,
          },
        );
        console.log(response.data);
        return (await response).data.summary;
      }
      console.log('Received Prompt:', prompt);
      console.log('Selected Provider"', provider);
      if (provider === 'groq') {
        console.log('groq');
        return this.getGroqResponse(prompt);
      } else if (provider === 'gemini') {
        console.log('gemini');
        return this.getGeminiResponse(prompt);
      } else if (provider === 'claude') {
        console.log('claude');
        return this.getClaudeResponse(prompt);
      } else {
        console.log('Invalid provider:', provider);
        throw new Error(
          'Invalid AI provider. Choose either "groq" or "gemini".',
        );
      }
    } catch (error) {
      console.error('Error fetching AI model response:', error);
      throw error;
    }
  }

  private async getGroqResponse(prompt: string) {
    console.log('Calling Groq API....');
    const result = await this.groqClient.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama3-8b-8192',
    });
    console.log('Groq Response:', result);
    return result.choices[0]?.message?.content || '';
  }

  private async getGeminiResponse(prompt: string) {
    const model = this.geminiClient.getGenerativeModel({
      model: 'gemini-1.5-flash',
    });
    const result = await model.generateContent(prompt);
    return result.response.text() + '/n/n gemini';
  }
  private async getClaudeResponse(prompt: string) {
    const result = await this.claudeClient.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    });

    // Extract all text content from Claude's response
    const responseText = result.content
      .map((block) => ('text' in block ? block.text : '')) // Get only text parts
      .join('\n'); // Join multiple text parts if present

    return responseText;
  }

  generateManagerPrompt(code: string): string {
    return `  
Strategic Project Management Code Review Protocol:  

Comprehensive Executive Summary Objectives:  
1. Strategic Impact Analysis  
   - Identify critical architectural transformations  
   - Quantify potential business value generation  
   - Validate alignment with strategic roadmap  

2. Advanced Risk Mapping  
   - Pinpoint potential technical debt risks  
   - Evaluate performance optimization vectors  
   - Predict integration complexity  

3. Strategic Resource Allocation  
   - Precise development effort estimation  
   - Proactive timeline adjustment strategies  
   - Intelligent resource deployment recommendations  

Technical Code Context:  
${code}  

Deliverable: Concise, actionable strategic narrative for executive decision-making.  
`;
  }

  generatePeerDeveloperPrompt(code: string): string {
    return `  
Advanced Technical Code Review Framework:  

Collaborative Development Insights:  
1. Architectural Code Analysis  
   - Comprehensive code structure evaluation  
   - Identify design pattern implementations  
   - Assess scalability and maintainability  

2. Technical Depth Exploration  
   - Detailed algorithmic complexity assessment  
   - Performance optimization potential  
   - Architectural design pattern alignment  

3. Collaborative Improvement Strategies  
   - Identify refactoring opportunities  
   - Propose innovative solution approaches  
   - Highlight potential cross-functional improvements  

Detailed Code Examination Context:  
${code}  

Deliverable: Precise, technically nuanced code review for professional developers.  
`;
  }

  generateLearnerPrompt(code: string): string {
    return `  
Beginner-Friendly Code Learning Journey:  

Learning Objectives:  
1. Foundational Concept Introduction  
   - Break down complex programming concepts  
   - Explain coding principles in simple language  
   - Provide real-world context for code examples  

2. Incremental Understanding  
   - Step-by-step code functionality explanation  
   - Highlight learning opportunities  
   - Connect code to practical applications  

3. Curiosity and Growth Mindset  
   - Encourage exploration of new concepts  
   - Provide additional learning resources  
   - Foster a supportive learning environment  

Accessible Code Learning Context:  
${code}  

Deliverable: Engaging, comprehensible code explanation for emerging developers.  
`;
  }

  generateCustomPrompt(prompt: string, code: string): string {
    return `  
Custom Analysis Framework:  

User-Defined Exploration Objectives:  
${prompt}  

Contextual Code Reference:  
${code}  

Deliverable: Tailored insights based on specific user requirements.  
`;
  }
}
