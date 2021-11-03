import { EntityRepository, Repository } from "typeorm";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { User } from "./user.entity";
import * as bcrypt from 'bcryptjs'

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
    async createUser(authCredentialsDto: AuthCredentialsDto) : Promise<void> {
        const { username, password } = authCredentialsDto;

        const salt: string = await bcrypt.genSalt();
        const hashedPassword: string = await bcrypt.hash(password, salt);

        const user: User = this.create({ username, password: hashedPassword });
        try {
            await this.save(user);
        } catch(error) {
            console.log(error.code);
        }
    }

    async createUser42(user: User) : Promise<void> {
        try {
            await this.save(user);
        } catch(error) {
            console.log(error.code);
        }
    }
}