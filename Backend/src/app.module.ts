import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import env from './configs/env';
import { AuthModule } from './module/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmAsyncConfig } from './configs/typeorm.config';
import { UserModule } from './module/user/user.module';
import { ExamResultModule } from './module/examResult/examResult.module';
import { CertificateModule } from './module/certificate/certificate.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [env] }),
    AuthModule,
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    UserModule,
    ExamResultModule, // Thêm Module Kết quả Thi
    CertificateModule, // Thêm Module Chứng chỉ
  ],
})
export class AppModule {}
