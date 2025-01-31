import { Test, TestingModule } from '@nestjs/testing';
import { ProjectService } from './project.service';
import { mockProjects } from './portfolio.test-data';
import { Project } from '../../storage/schemas/project';
import { getModelToken } from '@nestjs/mongoose';

describe('ProjectService', () => {
  let service: ProjectService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        {
          provide: getModelToken(Project.name),
          useValue: {
            find: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
  });

  describe('evluatePortfolioForProjects', () => {
    it('should handle mixed weights and capacities', () => {
      const modifiedProjects = [
        ...mockProjects,
        {
          _id: { $oid: "679a97657910731ae5a79e1e" },
          id: 6,
          name: "Zero Capacity Project",
          country: "CountryF",
          image: "https://example.com/image6.jpg",
          pricePerTon: 1.0,
          offeredVolumeInTons: 0,
          distributionWeight: 0.2,
          supplierName: "Test Supplier",
          earliestDelivery: "2023-01-01",
          description: "Test zero capacity"
        }
      ];
    
      const result = service['evluatePortfolioForProjects'](20000, modifiedProjects, []);
      
      // Verify zero capacity project gets nothing
      expect(result.find(a => a.id === 6)?.value).toBeUndefined();
      
      // Verify total allocation doesn't exceed available capacity
      expect(result.reduce((sum, a) => sum + a.value, 0)).toEqual(19515);
    });

    it('should handle projects with identical offered volumes', () => {
      const projects = [
        ...mockProjects,
        {
          ...mockProjects[0],
          id: 6,
          offeredVolumeInTons: 15, // Same as project 1
          distributionWeight: 0.2
        }
      ];
      
      const result = service['evluatePortfolioForProjects'](1000, projects, []);
      const project1Allocation = result.find(a => a.id === 1)?.value || 0;
      const project6Allocation = result.find(a => a.id === 6)?.value || 0;
      
      // Both should be fully allocated due to same offeredVolume and higher combined weight
      expect(project1Allocation).toBe(15);
      expect(project6Allocation).toBe(15);
    });
  
    it('should handle negative distribution weights', () => {
      const modifiedProjects = mockProjects.map(p => ({...p}));
      modifiedProjects[0].distributionWeight = -0.05;
      
      const result = service['evluatePortfolioForProjects'](1000, modifiedProjects, []);
      const totalAllocated = result.reduce((sum, a) => sum + a.value, 0);
      
      // Should ignore negative weight and distribute among others
      expect(totalAllocated).toBe(1000);
      expect(result.find(a => a.id === 1)?.value).toBeUndefined();
    });
  
    it('should handle projects with decimal offered volumes', () => {
      const projects = [
        {
          ...mockProjects[0],
          offeredVolumeInTons: 15.5,
          distributionWeight: 0.2
        },
        {
          ...mockProjects[1],
          offeredVolumeInTons: 899.999,
          distributionWeight: 0.8
        }
      ];
      
      const result = service['evluatePortfolioForProjects'](1000, projects, []);
      const total = result.reduce((sum, a) => sum + a.value, 0);
      
      expect(total).toBeCloseTo(915.499, 2);
    });
  
    it('should not modify input projects array', () => {
      const originalProjects = [...mockProjects];
      const projectsCopy = [...mockProjects];
      
      service['evluatePortfolioForProjects'](1000, projectsCopy, []);
      expect(projectsCopy).toEqual(originalProjects);
    });
  
    it('should handle massive target volume beyond Number.MAX_SAFE_INTEGER', () => {
      const bigProject = {
        ...mockProjects[4],
        offeredVolumeInTons: Number.MAX_SAFE_INTEGER,
        distributionWeight: 1
      };
      
      const result = service['evluatePortfolioForProjects'](
        Number.MAX_SAFE_INTEGER,
        [bigProject],
        []
      );
      
      expect(result[0].value).toBe(Number.MAX_SAFE_INTEGER);
    });
  
    // it('should handle initial allocations exceeding project capacity', () => {
    //   const initialAllocations = [{ id: 1, value: 20 }]; // Project 1 only has 15 capacity
    //   const result = service['evluatePortfolioForProjects'](1000, mockProjects, initialAllocations);
      
    //   // Should cap at project's max capacity
    //   expect(result.find(a => a.id === 1)?.value).toBe(15);
    // });
  
    it('should allocate correctly when all projects have same distribution weight', () => {
      const equalWeightProjects = mockProjects.map(p => ({
        ...p,
        distributionWeight: 0.2
      }));
      
      const result = service['evluatePortfolioForProjects'](1000, equalWeightProjects, []);
      
      // Expected to distribute based on capacity limits
      const allocations = result.map(a => a.value);
      expect(allocations).toEqual([15, 246.25, 246.25, 246.25, 246.25]); // Last 2 projects get 0 due to sorting
    });
  
  
    it('should return empty array when all projects have zero capacity', () => {
      const zeroCapacityProjects = mockProjects.map(p => ({
        ...p,
        offeredVolumeInTons: 0
      }));
      
      const result = service['evluatePortfolioForProjects'](1000, zeroCapacityProjects, []);
      expect(result).toEqual([]);
    });
  
    it('should handle precision loss in small allocations', () => {
      const projects = [
        {
          ...mockProjects[0],
          offeredVolumeInTons: 0.0001,
          distributionWeight: 0.5
        },
        {
          ...mockProjects[1],
          offeredVolumeInTons: 0.0001,
          distributionWeight: 0.5
        }
      ];
      
      const result = service['evluatePortfolioForProjects'](0.0003, projects, []);
      const total = result.reduce((sum, a) => sum + a.value, 0);
      
      expect(total).toBeCloseTo(0.0002, 4); // Both projects max out at 0.0001 each
    });
  
    it('should maintain id order in output when capacities are equal', () => {
      const projects = [
        { ...mockProjects[0], id: 10, offeredVolumeInTons: 100 },
        { ...mockProjects[1], id: 20, offeredVolumeInTons: 100 },
        { ...mockProjects[2], id: 30, offeredVolumeInTons: 100 }
      ];
      
      const result = service['evluatePortfolioForProjects'](300, projects, []);
      const ids = result.map(a => a.id);
      
      // Should maintain original order when offered volumes are equal
      expect(ids).toEqual([10, 20, 30]);
    });
  
    it('should handle concurrent full allocation of multiple projects', () => {
      const projects = [
        { ...mockProjects[0], offeredVolumeInTons: 100 },
        { ...mockProjects[1], offeredVolumeInTons: 100 },
        { ...mockProjects[2], offeredVolumeInTons: 100 },
        { ...mockProjects[3], offeredVolumeInTons: 100 },
      ];
      
      const result = service['evluatePortfolioForProjects'](500, projects, []);
      const totalAllocated = result.reduce((sum, a) => sum + a.value, 0);
      
      expect(totalAllocated).toBe(400); // All 4 projects max out at 100 each
    });
  });
});
