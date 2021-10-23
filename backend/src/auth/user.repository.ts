import { EntityRepository, Repository } from "typeorm";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";
import { User } from "./user.entity";

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
    async createUser(authCredentialsDto: AuthCredentialsDto) : Promise<void> {
        const { username, password } = authCredentialsDto;

        console.log(`username: ${username}\npassword: ${password}\n`);

        const user = this.create({ username, password });
        try {
            await this.save(user);
        } catch(error) {
            console.log(error.code);
        }
    }
}