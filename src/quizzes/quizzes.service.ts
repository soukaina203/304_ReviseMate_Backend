import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class QuizzesService {
  private readonly apiUrl = 'https://api.mistral.ai/v1/chat/completions';
  private readonly apiKey = process.env.MISTRAL_API_KEY;

  constructor(private readonly httpService: HttpService) {}

  async generateQuizzes(content: string): Promise<{
    success: boolean;
    message: string;
    data?: {
      question: string;
      correctAnswer: string;
      wrongAnswers: string[];
    }[];
  }> {
    const prompt = `
Génère exactement 20 questions en français sur ce texte, avec :
- Une bonne réponse.
- Trois mauvaises réponses.

Réponse en format JSON strict (20 objets) :
[
  {
    "question": "ta question",
    "correct_answer": "bonne réponse",
    "incorrect_answers": ["mauvaise 1", "mauvaise 2", "mauvaise 3"]
  },
  ...
]

Texte : ${content}`;

    try {
      const response = await firstValueFrom(
        this.httpService.post(
          this.apiUrl,
          {
            model: 'mistral-medium',
            messages: [
              { role: 'system', content: 'Assistant' },
              { role: 'user', content: prompt },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      const messageContent = response.data.choices && response.data.choices[0]?.message?.content;

      if (!messageContent) {
        return {
          success: false,
          message: "La réponse de l'API est vide ou invalide.",
        };
      }

      const quizzes = JSON.parse(messageContent);

      if (!Array.isArray(quizzes)) {
        return {
          success: false,
          message: 'Le format des quiz reçu est invalide.',
        };
      }

      const validQuizzes = quizzes.map((quiz) => ({
        question: quiz.question,
        correctAnswer: quiz.correct_answer,
        wrongAnswers: quiz.incorrect_answers,
      }));

      if (validQuizzes.length === 0) {
        return { success: false, message: 'Aucun quiz valide généré.' };
      }

      return {
        success: true,
        message: 'Quizz généré avec succès.',
        data: validQuizzes.slice(0, 20),
      };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return {
        success: false,
        message: 'Erreur lors de la génération des quiz.',
      };
    }
  }
}