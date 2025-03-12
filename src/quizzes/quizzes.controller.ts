import { Controller, Post } from "@nestjs/common";
import { QuizzesService } from "./quizzes.service";

@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Post('generate')
  async generateQuizzes() {
    try {
      // Appel au service pour générer le quiz
      const quiz = await this.quizzesService.generateQuizzes();
      return quiz; // Retourne le quiz généré
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch {
      return {
        error: 'Une erreur est survenue lors de la génération du quiz.',
      };
    }
  }
}
