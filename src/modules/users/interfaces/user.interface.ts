import { PaginationDTO } from "src/common/dto/pagination.dto"
import { CreateUserDto } from "../dto/create-user.dto"
import { User } from "../entities/user.entity"
import { FindById } from "../dto/find-by-id.dto"
import { UpdateUserDto } from "../dto/update-user.dto"

export interface UserInterface {

    create(createUser: CreateUserDto): Promise<User>
    findAll(pagination: PaginationDTO): Promise<{
        total: number,
        page: number
        limit: number
        users: User[]
    }>

    findOne(id: FindById): Promise<User>
    update(id: FindById, updateUser: UpdateUserDto): Promise<User>
    remove(idObject: FindById): Promise<{ message: string }>



}
