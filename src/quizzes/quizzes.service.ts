import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class QuizzesService {
  private readonly api_url = 'https://api.mistral.ai/v1/chat/completions';
  private readonly api_key = process.env.MISTRAL_API_KEY;

  constructor(private readonly httpService: HttpService) {
  }

  async generateQuizzes(
    content: string,
  ): Promise<{ question: string; answer: string }[]> {
    const prompt = `Crée jusqu'à 20 questions, et pour chaque question, une bonne réponse et 3 mauvaises réponses. Utilise le texte suivant pour générer les questions : ${content}`;

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          this.api_url,
          {
            model: 'mistral-medium',
            messages: [
              { role: 'system', content: 'Assistant' },
              { role: 'user', content: prompt },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${this.api_key}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      console.log("Réponse complète de l'API:", response.data);
    } catch (error) {
      console.error('Erreur lors de la génération du quiz :', error);
      throw new Error(
        "Une erreur est survenue lors de la génération du quiz par l'IA.",
      );
    }
  }
}
