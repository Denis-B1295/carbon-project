import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProjectDocument = HydratedDocument<Project>;

@Schema({collection: 'projects'})
export class Project {
  @Prop()
  name: string;

  @Prop()
  id: number;

  @Prop()
  country: string;

  @Prop()
  image: string;

  @Prop()
  pricePerTon: number;

  @Prop()
  offeredVolumeInTons: number;

  @Prop()
  distributionWeight: number;

  @Prop()
  supplierName: string;

  @Prop()
  description: string;

  @Prop()
  earliestDelivery: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
