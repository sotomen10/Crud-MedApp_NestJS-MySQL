import { IsPositive,IsOptional,IsInt, IsNotEmpty } from "class-validator";
import { Type } from "class-transformer";



export class PaginationDTO{

    @IsPositive()
    @IsOptional()
    @IsInt()
    @Type(()=>Number)
    page?:number=1

    @IsPositive()
    @IsOptional()
    @IsInt()
    @Type(()=>Number)
    limit?:number=10
}