import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class QuizzesService {
  private readonly api_url = 'https://api.mistral.ai/v1/chat/completions';
  private readonly api_key = process.env.MISTRAL_API_KEY;

  constructor(private readonly httpService: HttpService) {}

  async generateQuizzes(content: string): Promise<
    {
      question: string;
      correctAnswer: string;
      wrongAnswers: string[];
    }[]
  > {
    const prompt = `
  Génère exactement 20 questions sur ce texte. Pour chaque question, donne :
  - Une bonne réponse.
  - Trois mauvaises réponses.

Format de réponse JSON strict :
[
  {
    "question ": "ta question",
    "correct_answer": "bonne réponse",
    "incorrect_answers": ["mauvaise 1", "mauvaise 2", "mauvaise 3"]
  },
  ...
]

Texte source : ${content}
`;

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

      const messageContent =
        response.data.choices && response.data.choices[0]?.message?.content;

      if (!messageContent) {
        throw new Error(
          "La réponse de l'API ne contient pas de contenu valide",
        );
      }

      console.log('Contenu brut reçu:', messageContent);

      // Parse the JSON response directly
      const quizzes = JSON.parse(messageContent);

      if (!Array.isArray(quizzes)) {
        throw new Error('Le format des quiz reçu est invalide.');
      }

      const validQuizzes = quizzes.map((quiz) => ({
        question: quiz.question,
        correctAnswer: quiz.correct_answer,
        wrongAnswers: quiz.incorrect_answers,
      }));

      if (validQuizzes.length === 0) {
        throw new Error('Aucun quiz valide généré.');
      }

      return validQuizzes.slice(0, 20);
    } catch (error) {
      console.error('Erreur lors de la génération du quiz :', error);
      throw new Error(
        "Une erreur est survenue lors de la génération du quiz par l'IA.",
      );
    }
  }
}