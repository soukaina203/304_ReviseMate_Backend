import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class SummaryService {
// The API URL and key are stored in the environment variables
  private readonly apiUrl = 'https://api.mistral.ai/v1/chat/completions';
  private readonly apiKey = process.env.MISTRAL_API_KEY;
  
// The summarizeText method sends a POST request to the Mistral API with the text to summarize
  async summarizeText(text: string): Promise<string> {
    const response = await axios.post(
      this.apiUrl,
      {
        model: 'mistral-medium',
        messages: [{ role: 'user', content: `Résumé : ${text}` }],
        max_tokens: 4096, //max tokens
      },
      { headers: { Authorization: `Bearer ${this.apiKey}`, 'Content-Type': 'application/json' } }
    );
    return response.data.choices[0].message.content;
  }
}
