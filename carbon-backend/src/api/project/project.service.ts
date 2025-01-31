import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, RootFilterQuery } from 'mongoose';
import { Project } from '../../storage/schemas/project';
import { Portfolio, PortfolioAllocation } from '../../entities/portfolio';

@Injectable()
export class ProjectService {
  constructor(@InjectModel(Project.name) private projectModel: Model<Project>) {}

  async findAll() {
    return await this.projectModel.find().lean().exec();
  }
  async find(query: RootFilterQuery<Project>) {
    return await this.projectModel.find(query).lean().exec();
  }

  async generatePortfolio(desiredVolume: number, projects: Project[]): Promise<Portfolio> {
    const portfolioAllocations: (Project & PortfolioAllocation)[] = []

    const result = this.evluatePortfolioForProjects(desiredVolume, projects, portfolioAllocations);

    return {
      portfolioAllocations: result,
    }
  }

  private evluatePortfolioForProjects(targetVolume: number, projects: Project[], portfolioAllocations: (Project & PortfolioAllocation)[]): PortfolioAllocation[] {
    const availableProjectsByOfferedVolumenAsc = Array.from(projects
      .filter(p => p.offeredVolumeInTons > 0 && p.distributionWeight > 0)
      .sort((a,b) => a.offeredVolumeInTons - b.offeredVolumeInTons));

    const allocationMap = new Map<number, Project & PortfolioAllocation>(
      portfolioAllocations.map(pa => [pa.id, {...pa}])
    );

    let leftOverVolume = targetVolume;
    let availableProjects = availableProjectsByOfferedVolumenAsc;

    while (leftOverVolume > 0 && availableProjects.length > 0) {
      const totalWeight = availableProjects.reduce((sum, p) => sum + p.distributionWeight, 0);
      if (totalWeight === 0) break;

      let newLeftOver = 0;
      const currentProjects = [...availableProjects];

      for (const project of currentProjects) {
        const allocation = allocationMap.get(project.id);
        const remainingCapacity = allocation 
          ? project.offeredVolumeInTons - allocation.value 
          : project.offeredVolumeInTons;

        if (remainingCapacity <= 0) continue;

        const rebasedWeight = project.distributionWeight / totalWeight;
        const allocationAmount = leftOverVolume * rebasedWeight;
        
        const actualAllocation = Math.min(allocationAmount, remainingCapacity);
        const overflow = allocationAmount - actualAllocation;

        if (allocation) {
          allocation.value += actualAllocation;
        } else {
          allocationMap.set(project.id, {...project, value: actualAllocation});
        }

        newLeftOver += overflow;
      }

      leftOverVolume = newLeftOver;
      availableProjects = currentProjects.filter(project => {
        const allocation = allocationMap.get(project.id)?.value ?? 0;
        return allocation < project.offeredVolumeInTons;
      });
    }

    return Array.from(allocationMap.values()).map(({ id, value }) => ({ id, value }));
  }
}
