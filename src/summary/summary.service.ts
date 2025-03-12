import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class SummaryService {
  // The API URL and key are stored in the environment variables
  private readonly apiUrl = 'https://api.mistral.ai/v1/chat/completions';
  private readonly apiKey = process.env.MISTRAL_API_KEY;

  // The createRevisionSheet method sends a POST request to the Mistral API with the text to summarize
  async createRevisionSheet(text: string, customPrompt?: string): Promise<string> {
    // The base prompt is the default prompt used for all requests | Base prompt
    const basePrompt = "Crée une fiche de révision structurée à partir du texte suivant. Inclus les points clés, les définitions importantes, et les exemples pertinents";
    // If a custom prompt is provided, it is appended to the base prompt | Prompt utilisateur
    const fullPrompt = customPrompt ? `${basePrompt}. ${customPrompt} : ${text}` : `${basePrompt} : ${text}`;
  
    const response = await axios.post(
      this.apiUrl,
      {
        model: 'mistral-medium',
        messages: [{ role: 'user', content: fullPrompt }],
        max_tokens: 4096,
      },
      { headers: { Authorization: `Bearer ${this.apiKey}`, 'Content-Type': 'application/json' } }
    );
    return response.data.choices[0].message.content;
  }
  
}
