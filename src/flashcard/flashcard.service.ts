import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FlashcardService {
  private readonly apiUrl = 'https://api.mistral.ai/v1/chat/completions';
  private readonly apiKey = process.env.MISTRAL_API_KEY;

  constructor(private readonly httpService: HttpService) {}

  async generateFlashcards(content: string): Promise<{ question: string, answer: string }[]> {
    // Prompt pour l'API avec instruction de langue
    const prompt = `Crée jusqu'à 20 questions et leurs réponses en français à partir du texte suivant, sans inclure les mots "question" ou "réponse" dans les réponses : ${content}`;

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
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
            },
          }
        )
      );

      console.log('Réponse complète de l\'API:', response.data);

      const messageContent = response.data.choices && response.data.choices[0]?.message?.content;

      if (!messageContent) {
        throw new Error('La réponse de l\'API ne contient pas de contenu valide');
      }

      console.log('Contenu reçu avant nettoyage:', messageContent);

      let cleanMessage = messageContent.trim();
      cleanMessage = cleanMessage.replace(/Réponse:/g, '').trim();
      cleanMessage = cleanMessage.replace(/Question:/g, '').trim();

      console.log('Message nettoyé:', cleanMessage);

      const pairs = cleanMessage.split('\n').filter(part => part.trim() !== '');

      console.log('Paires après découpage et filtrage :', pairs);

      const flashcards = [];
      for (let i = 0; i < pairs.length; i += 2) {
        let question = pairs[i]?.trim();
        let answer = pairs[i + 1]?.trim();

        const words = answer.split(' ');
        if (words.length > 15) {
          answer = words.slice(0, 15).join(' ');
        }

        if (question && answer) {
          flashcards.push({ question, answer });
        }

        if (flashcards.length >= 20) {
          break;
        }
      }

      if (flashcards.length === 0) {
        throw new Error('Aucune paire de question-réponse valide n\'a été générée.');
      }

      return flashcards;
    } catch (error) {
      console.error('Erreur lors de la génération des cartes mémoire:', error);
      throw new Error('Échec de la génération des cartes mémoire');
    }
}

  
  
}
