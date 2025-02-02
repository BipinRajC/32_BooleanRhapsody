import { Injectable } from '@nestjs/common';
import { AiApiHandlerService } from './ai-api-handler.service';

export class DocumentRetrievalUtil {
  static splitContentToFiles(content: string): string[] {
    const contentPattern = /Content:\n((?:.*\n)*?)(?=Filename:|$)/g;
    const splitContent: string[] = [];
    let match;

    while ((match = contentPattern.exec(content)) !== null) {
      const extractedContent = match[1].trim();
      if (extractedContent) {
        splitContent.push(extractedContent);
      }
    }
    return splitContent;
  }

  static async getAiSummaryForSplitContent(
    aiService: AiApiHandlerService,
    splitContent: string[],
  ): Promise<string[]> {
    const summaryArray: string[] = [];

    for (const content of splitContent) {
      try {
        const result = await aiService.getSummaryFromAiModel(
          'explain the following code in brief.....but cover the important details - ' +
            content,
          'gemini',
        );

        summaryArray.push(result);

        // Optional: Add a small delay between requests to prevent rate limiting
        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1-second delay
      } catch (error) {
        console.error(`Error generating summary for content: ${error}`);
        summaryArray.push(`Error generating summary: ${error.message}`);

        // Optional: Add a longer delay after an error
        await new Promise((resolve) => setTimeout(resolve, 3000)); // 3-second delay
      }
    }

    return summaryArray;
  }

  static async getSummaryOfSummaryArray(
    aiService: AiApiHandlerService,
    summaryArray: string[],
  ): Promise<string> {
    const summaryConcat: string = summaryArray.join('\n\n');
    console.log(summaryConcat);
    const summary = await aiService.getSummaryFromAiModel(
      'Summarize this content - ' + summaryConcat,
      'groq',
    );
    return summary;
  }

  static async streamlinedParentChildDocumentRetrievalSimulation(
    aiService: AiApiHandlerService,
    content: string,
  ): Promise<string> {
    const splitContent = this.splitContentToFiles(content);
    const summaryArray = await this.getAiSummaryForSplitContent(
      aiService,
      splitContent,
    );
    console.log(summaryArray);
    const summary = await this.getSummaryOfSummaryArray(
      aiService,
      summaryArray,
    );
    return summary;
  }
}
