import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    DatabaseModule,
    UserModule,
    ProductModule,
    CategoryModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
