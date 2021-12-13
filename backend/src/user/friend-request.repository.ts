import {EntityRepository, Repository } from 'typeorm';
import { FriendRequestDto } from './dto/friend-request.dto';
import { FriendRequest } from './friend-request.entity';
import { UsersRepository } from './user.repository';


@EntityRepository(FriendRequest)
export class FriendRequestRepository extends Repository<FriendRequest> {
    async createFriendRequest(friendRequestDto: FriendRequestDto, userRepository: UsersRepository): Promise<void> {
        const { from, to } = friendRequestDto;

        const request: FriendRequest = this.create({ from, to });

        const allUser = await userRepository.find({ relations: ['requestFrom', 'requestTo'] });

        const { requestFrom } = allUser.find((user) => { return user.id === to.id; });
        const { requestTo } = allUser.find((user) => { return user.id === from.id; });
        
        console.log(requestTo);
        console.log(requestFrom);

        from.requestFrom = requestTo;
        to.requestTo = requestFrom;

        from.requestFrom.push(request);
        to.requestTo.push(request);
        try {
          await this.save(request);
          await userRepository.save(from);
          await userRepository.save(to);
        } catch (error) {
          console.log(error.code);
        }
      }
}