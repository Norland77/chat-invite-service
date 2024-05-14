import { Module } from '@nestjs/common';
import { InviteController } from './invite.controller';
import { InviteService } from './invite.service';
import { InviteRepository } from './invite.repository';

@Module({
  controllers: [InviteController, InviteRepository],
  providers: [InviteService, InviteRepository],
})
export class InviteModule {}
