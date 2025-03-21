import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FlashcardService {
  private readonly apiUrl = 'https://api.mistral.ai/v1/chat/completions';
  private readonly apiKey = process.env.MISTRAL_API_KEY;

  constructor(private readonly httpService: HttpService) {}

  async generateFlashcards(content: string): Promise<{ success: boolean, message: string, data?: { question: string, réponse: string }[] }> {
    // Prompt pour l'API avec instruction de langue
    const prompt = `Crée jusqu'à 20 questions et leurs réponses en français à partir du texte suivant. Chaque réponse ne doit pas dépasser 20 mots. Ne pas inclure les mots "question" ou "réponse" dans les réponses : ${content}`;


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

      const messageContent = response.data.choices && response.data.choices[0]?.message?.content;

      if (!messageContent) {
        return { success: false, message: 'La réponse de l\'API est vide ou invalide.' };
      }

      let cleanMessage = messageContent.trim();
      cleanMessage = cleanMessage.replace(/Réponse:/g, '').trim();
      cleanMessage = cleanMessage.replace(/Question:/g, '').trim();

      const pairs = cleanMessage.split('\n').filter(part => part.trim() !== '');
      const flashcards = [];
      
      for (let i = 0; i < pairs.length; i += 2) {
        let question = pairs[i]?.trim();
        let réponse = pairs[i + 1]?.trim();

        const words = réponse.split(' ');
        if (words.length > 15) {
          réponse = words.slice(0, 15).join(' ');
        }

        if (question && réponse) {
          flashcards.push({ question, réponse });
        }

        if (flashcards.length >= 20) {
          break;
        }
      }

      if (flashcards.length === 0) {
        return { success: false, message: 'Aucune paire de question-réponse valide n\'a été générée.' };
      }

      return { success: true, message: 'Cartes mémoire générées avec succès.', data: flashcards };
    } catch (error) {
      return { success: false, message: 'Erreur lors de la génération des cartes mémoire.' };
    }
  }
}
