import { Module } from '@nestjs/common';
import { CertificateController } from './controllers/certificate.controller';
import { CertificateService } from './services/certificate.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([])], // Không cần entity
  controllers: [CertificateController],
  providers: [CertificateService],
  exports: [CertificateService],
})
export class CertificateModule {}
