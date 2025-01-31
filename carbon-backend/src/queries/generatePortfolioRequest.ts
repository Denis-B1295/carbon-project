import { Transform } from "class-transformer";
import { IsNumber } from "class-validator";

export class GeneratePortfolioRequest {
    @IsNumber()
    @Transform(({value}) => (value ? +value : undefined), {
        toClassOnly: true,
    })
    desiredVolume: number;
}