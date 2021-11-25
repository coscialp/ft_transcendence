import {EntityRepository, Repository } from 'typeorm';
import { FriendRequestDto } from './dto/friend-request.dto';
import { FriendRequest } from './friend-request.entity';


@EntityRepository(FriendRequest)
export class FriendRequestRepository extends Repository<FriendRequest> {
    async createFriendRequest(friendRequestDto: FriendRequestDto): Promise<void> {
        const { from, to } = friendRequestDto;

        const request: FriendRequest = this.create({ from, to });
        from.requestFrom.push(request);
        to.requestTo.push(request);
        try {
          await this.save(request);
        } catch (error) {
          console.log(error.code);
        }
      }
}