import { Transform } from "class-transformer";
import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";


export const SearchQueryRangeNumberKeys = [
    'pricePerTon',
    'offeredVolumeInTons',
    'distributionWeight'
]

const validateRangeNumbers = ({ value }) => 
    (Array.isArray(value) ? (value.map(v => v ? +v : undefined)) : [value ? +value : undefined]);

export class SearchQueryBody {
    @IsOptional()
    @IsNumber()
    @Transform(({value}) => (value ? +value : undefined), {
        toClassOnly: true,
    })
    id?: number;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    country?: string;

    @IsOptional()
    @IsString()
    supplierName?: string;

    @IsOptional()
    @IsNumber({}, {each: true})
    @IsArray()
    @Transform(validateRangeNumbers, {
        toClassOnly: true,
    })
    pricePerTon?: number;

    @IsOptional()
    @IsNumber({}, {each: true})
    @IsArray()
    @Transform(validateRangeNumbers, {
        toClassOnly: true,
    })
    offeredVolumeInTons?: number[];

    @IsOptional()
    @IsNumber({}, {each: true})
    @IsArray()
    @Transform(validateRangeNumbers, {
        toClassOnly: true,
    })
    distributionWeight?: number;

}