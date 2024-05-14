import { Controller } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IInvite } from './interfaces/IInvite';
import { InviteDto } from './dto/invite.dto';

@Controller('invite')
export class InviteRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findInviteByRoom(roomId: string): Promise<IInvite | null> {
    return this.prismaService.inviteList.findFirst({
      where: {
        roomId,
      },
    });
  }

  async createInvite(dto: InviteDto): Promise<IInvite> {
    return this.prismaService.inviteList.create({
      data: {
        roomId: dto.roomId,
        accept: dto.accept,
        token: dto.token,
      },
    });
  }

  async findRoomByToken(token: string): Promise<IInvite | null> {
    return this.prismaService.inviteList.findFirst({
      where: {
        token,
      },
      include: {
        room: true,
      },
    });
  }
}
