import { Module } from '@nestjs/common';
import { InviteModule } from './invite/invite.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [InviteModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
