import { BadRequestException, Body, Controller, Get, Post, Query, ValidationPipe } from '@nestjs/common';
import { ProjectService } from './project.service';
import { SearchQueryBody, SearchQueryRangeNumberKeys } from 'src/queries/searchQueryBody';
import { IsNumber } from 'class-validator';
import { GeneratePortfolioRequest } from 'src/queries/generatePortfolioRequest';

@Controller('project')
export class ProjectController {
    constructor(private projectService: ProjectService) {}

    @Get('all')
    public getAllProjects() {
        return this.projectService.findAll();
    }

    @Post('generate-portfolio')
    public async generatePortfolio(
        @Body() generatePortfolioRequest: GeneratePortfolioRequest
    ) {
        if(generatePortfolioRequest.desiredVolume <= 0){
            throw new BadRequestException('Desired Volume must be > 0');
        }
        const projects = await this.projectService.findAll();
        return this.projectService.generatePortfolio(generatePortfolioRequest.desiredVolume, projects);
    }

    @Get('search')
    public search(
        @Query(new ValidationPipe({ transform: true, whitelist: true })) request: SearchQueryBody,
    ) {

        const query = {};
        for(let key in request){
            const value = request[key];
            if(Array.isArray(value) && SearchQueryRangeNumberKeys.some(s => s === key)){
                const minRange = value[0];
                const maxRange = value[1];
                query[key] = {
                    ...(minRange ? {$gte: minRange} : {}),
                    ...(maxRange ? {$lte: maxRange} : {})
                }
                continue;
            } else if ( typeof value === 'string' || typeof value === 'number'){
                query[key] = value
            }
        }
        if(Object.keys(query).length === 0){
            throw new BadRequestException('No search parameters were provided.');
        }
        return this.projectService.find(query);
    }

}
