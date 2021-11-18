import { IsEnum, IsNotEmpty, IsOptional } from "class-validator";

export class GetUserFilterDto {
    @IsOptional()
    @IsNotEmpty()
    search?: string;
}