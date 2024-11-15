import { IsUUID,IsNotEmpty } from "class-validator";

export class FindById{
    @IsUUID()
    @IsNotEmpty()
    id:string
}