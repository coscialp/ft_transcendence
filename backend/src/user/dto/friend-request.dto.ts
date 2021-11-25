import { IsNotEmpty } from "class-validator";
import { User } from "../user.entity";

export class FriendRequestDto {
    @IsNotEmpty()
    from: User;

    @IsNotEmpty()
    to: User;
}