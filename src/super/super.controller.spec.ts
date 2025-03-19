import { Test, TestingModule } from '@nestjs/testing';
import { SuperController } from './super.controller';

describe('SuperController', () => {
  let controller: SuperController<any>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SuperController],
    }).compile();

    controller = module.get<SuperController<any>>(SuperController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
