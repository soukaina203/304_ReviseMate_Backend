import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from '../../schemas/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Update_userDto } from '../../auth/dto/update_user.dto';
import { Quiz } from '../../schemas/quiz.schema';
import { Fiche } from '../../schemas/fiche.schema';
import { CarteMemoire } from '../../schemas/carte_memoire.schema';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Quiz.name) private readonly quizModel: Model<Quiz>,
    @InjectModel(Fiche.name) private readonly ficheModel: Model<Fiche>,
    @InjectModel(CarteMemoire.name) private readonly carteMemoireModel: Model<CarteMemoire>,
  ) {}


  async update(id: string, updateUserDto: Update_userDto): Promise<User> {
    this.logger.log(`Mise à jour de l'utilisateur avec l'ID : ${id}`);

    const cleanId = id.trim();

    //Vérifie si l'utilisateur existe | Check if the user exists
    const user = await this.userModel.findById(cleanId);
    if (!user) {
      throw new NotFoundException(`Utilisateur avec l'ID ${cleanId} non trouvé.`);
    }

    //Si un mot de passe est fourni, on le hash | If a password is provided, hash it
    if (updateUserDto.password) {
      this.logger.log('Hashage du mot de passe...');
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    //Mise à jour de l'utilisateur | Update the user
    await this.userModel.findByIdAndUpdate(cleanId, updateUserDto, { new: true });

    //Retourne l'utilisateur mis à jour | Return the updated user
    return this.userModel.findById(cleanId);
  }
  async getEtudiantWithDetails(id: string) {
    const etudiantRoleId = new Types.ObjectId('67c8621008049ddd39d069f1');

    const user = await this.userModel.findOne({ _id: id, id_role: etudiantRoleId });

    if (!user) {
      throw new NotFoundException(`Étudiant avec l'ID ${id} non trouvé ou n'est pas un étudiant.`);
    }

    const quizCree = await this.quizModel.find({ id_utilisateur: id });
    const fiches = await this.ficheModel.find({ id_utilisateur: id });
    const cartes = await this.carteMemoireModel.find({ id_utilisateur: id });

    return {
      ...user.toObject(),
      quizCree,
      fiches,
      cartes,
    };
  }
  
}
