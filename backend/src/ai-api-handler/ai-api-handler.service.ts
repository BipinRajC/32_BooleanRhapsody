import { Injectable } from '@nestjs/common';
//import { ConfigService } from '@nestjs/config';
//import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import Groq from 'groq-sdk';

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
  private readonly apiKey = process.env.GROQ_API_KEY;
  private readonly groqClient = new Groq({ apiKey: this.apiKey });

  async getSummaryFromAiModel(prompt: string) {
    try {
      const result = await this.groqClient.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama3-8b-8192', // Replace with your desired model ID
      });
      const response = result.choices[0]?.message?.content;
      return response;
    } catch (error) {
      console.error('Error fetching AI model response:', error);
      throw error;
    }
  }

  generateManagerPrompt(code: string): string {
    const prompt = `
      As a project manager, you need concise updates on GitHub repository changes. 
      Provide a summary that highlights major commits, new features, and potential risks. 
      Include actionable insights for decision-making.
      Chain of Thought (CoT) Steps:
      - Identify Recent Commits: Review the latest commits to the repository.
      - Highlight Major Changes: Focus on significant code additions, deletions, and modifications.
      - Evaluate Impact: Assess how these changes affect project timelines and milestones.
      - Risk Assessment: Identify any potential risks or issues introduced by recent updates.
      - Recommendations: Provide actionable recommendations for addressing risks or leveraging new features.
      - Explanation of code: Explain in detail what the code does at a difficulty level which a product manager can comprehend
     `;
    return prompt + '\n\n' + code;
  }

  generatePeerDeveloperPrompt(code: string): string {
    const prompt = `
      As a peer developer, you seek detailed insights into GitHub repository updates for collaboration and code review. 
      Deliver a summary that explains recent code changes, technical challenges, and suggested improvements.
      Chain of Thought (CoT) Steps:
      - Review Code Changes: Examine recent commits to understand code additions, modifications, and refactorings.
      - Technical Challenges: Identify any challenges encountered during development or integration.
      - Code Quality: Evaluate the quality of recent code changes, focusing on readability, efficiency, and adherence to coding standards.
      - Collaboration Opportunities: Highlight areas where collaboration among team members could improve code quality or solve technical challenges.
      - Suggestions for Improvement: Provide constructive feedback and suggestions for enhancing code performance or addressing technical issues.
      - Explanation of Code: Explain each function in detail with use of good technical terms.
    `;
    return prompt + '\n\n' + code;
  }

  generateLearnerPrompt(code: string): string {
    const prompt = `
      As a learner new to coding and GitHub, you're eager to understand repository changes and their implications.
      Provide a detailed summary that explains basic coding concepts, recent commits, and their significance in plain language.
      Chain of Thought (CoT) Steps:
      - Introduction to Commits: Explain what commits are and their role in tracking changes in code.
      - Basic Coding Concepts: Introduce fundamental coding concepts relevant to recent commits (e.g., functions, variables).
      - Recent Changes Analysis: Break down recent commits into specific changes made (e.g., adding a new feature, fixing a bug).
      - Understanding Implications: Discuss how recent changes affect the overall functionality or performance of the project.
      - Learning Pathways: Recommend resources or further reading to deepen understanding of coding concepts and GitHub usage.
      - Explanation of Code: Explain the code in words in detail like you would to a high school student.
    `;
    return prompt + '\n\n' + code;
  }

  generateCustomPrompt(prompt: string, code: string) {
    return prompt + '\n\n' + code;
  }
}
