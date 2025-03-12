import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FlashcardService {
  private readonly apiUrl = 'https://api.mistral.ai/v1/chat/completions';
  private readonly apiKey = process.env.MISTRAL_API_KEY;

  constructor(private readonly httpService: HttpService) {}

  async generateFlashcards(content: string): Promise<{ question: string, answer: string }[]> {
    //Prompt pour l'API
    const prompt = `Crée jusqu'à 20 questions et leurs réponses à partir du texte suivant, sans inclure les mots "question" ou "réponse" dans les réponses : ${content}`;
  
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
  
      console.log('Réponse complète de l\'API:', response.data); // Affichage de la réponse brute
      
      // Extrait le contenu du message de la première réponse de l'API
      const messageContent = response.data.choices && response.data.choices[0]?.message?.content;
      
      // Vérifier si le contenu du message est vide
      if (!messageContent) {
        throw new Error('La réponse de l\'API ne contient pas de contenu valide');
      }
  
      // Log pour afficher le contenu reçu avant nettoyage
      console.log('Contenu reçu avant nettoyage:', messageContent);
  
      // Nettoyage de la réponse pour retirer "Réponse:" et "Question:" s'ils sont présents
      let cleanMessage = messageContent.trim();
      cleanMessage = cleanMessage.replace(/Réponse:/g, '').trim();
      cleanMessage = cleanMessage.replace(/Question:/g, '').trim();
  
      // Log après nettoyage
      console.log('Message nettoyé:', cleanMessage);
  
      // Diviser la réponse en paires de questions et réponses (séparées par des sauts de ligne)
      const pairs = cleanMessage.split('\n').filter(part => part.trim() !== '');
  
      // Log des paires après le filtrage
      console.log('Paires après découpage et filtrage :', pairs);
  
     // Le but de cette boucle est de parcourir une liste de chaînes de caractères
    // où chaque question est suivie immédiatement de sa réponse.
      const flashcards = [];
      for (let i = 0; i < pairs.length; i += 2) {
        // Extrait la question à l'index 'i', en supprimant les espaces blancs superflus
        let question = pairs[i]?.trim();
        // Extrait la réponse à l'index suivant 'i + 1', en supprimant les espaces blancs superflus
        let answer = pairs[i + 1]?.trim();
  
        // Limiter les réponses à 15 mots
        const words = answer.split(' ');
        if (words.length > 15) {
          answer = words.slice(0, 15).join(' ');
        }

        // Vérifier si la question et la réponse ne sont pas vides
        if (question && answer) {
          flashcards.push({ question, answer });
        }
  
        // Limiter à 20 paires
        if (flashcards.length >= 20) {
          break;
        }
      }
      // Vérifier si aucune paire de question-réponse valide n'a été générée
      if (flashcards.length === 0) {
        throw new Error('Aucune paire de question-réponse valide n\'a été générée.');
      }
  
      return flashcards; // Retourner les cartes mémoire générées
    } catch (error) {
      console.error('Erreur lors de la génération des cartes mémoire:', error);
      throw new Error('Échec de la génération des cartes mémoire');
    }
  }
  
  
}
