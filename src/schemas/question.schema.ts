import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
;

@Schema({ collection: 'question' })
export class Question extends Document {
  @Prop({ required: true })
  question: string;

  @Prop({ required: true })
  correct_answer: string;

  @Prop({
    type: [String],
    required: true,
    validate: {
      validator: function (incorrectAnswers: string[]) {
        return incorrectAnswers.length === 3;
      },
      message: 'incorrect_answers doit contenir 3 réponses.',
    },
  })
  incorrect_answers: string[];

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    required: false,
    ref: 'id_quiz',
  })
  id_quiz: Types.ObjectId;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
