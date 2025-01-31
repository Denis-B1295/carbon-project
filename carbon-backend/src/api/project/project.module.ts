import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { Project, ProjectSchema } from 'src/storage/schemas/project';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectController } from './project.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }])],
  controllers: [ProjectController],
  providers: [ProjectService]
})
export class ProjectModule {}
