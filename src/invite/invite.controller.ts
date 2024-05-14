import { Controller } from '@nestjs/common';
import { InviteService } from './invite.service';
import { InviteDto } from './dto/invite.dto';
import { IInvite } from './interfaces/IInvite';
import { IRoom } from './interfaces/IRoom';
import { IUser } from './interfaces/IUser';
import {
  ClientProxy,
  ClientProxyFactory,
  MessagePattern,
  Transport,
} from '@nestjs/microservices';
import { firstValueFrom, Observable } from 'rxjs';

@Controller('invite')
export class InviteController {
  private readonly user_client: ClientProxy;
  private readonly room_client: ClientProxy;
  constructor(private readonly inviteService: InviteService) {
    this.user_client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: 5001,
      },
    });
    this.room_client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: 5003,
      },
    });
  }

  @MessagePattern('post.create')
  async createInvite(dto: InviteDto): Promise<IInvite> {
    await this.inviteService.findInviteByRoom(dto.roomId);

    const inviteCreated: IInvite = await this.inviteService.createInvite(dto);

    this.room_client.send('post.addInviteLink', {
      inviteLink: dto.inviteLink,
      roomId: dto.roomId,
    });
    return inviteCreated;
  }

  @MessagePattern('put.accept')
  async acceptInvite(data: {
    roomId: string;
    userId: { userId: string };
  }): Promise<Observable<IRoom>> {
    console.log(data);
    const user: Observable<IUser> = this.user_client.send(
      'get.users.byId',
      data.userId.userId,
    );

    const currentUser = await firstValueFrom(user);

    this.room_client.send('get.byId', data.roomId);

    return this.room_client.send('post.addUser', {
      roomId: data.roomId,
      userId: currentUser.id,
    });
  }

  @MessagePattern('get.roomByToken')
  async getRoomByToken(token: string): Promise<IInvite> {
    return await this.inviteService.findRoomByToken(token);
  }
}
