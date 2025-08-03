import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseInterceptors,
  UploadedFile,
  Query
} from '@nestjs/common';
import { CertificateService } from '../services/certificate.service';
import { CreateCertificateDto } from '../dtos/CreateCertificate.dto';
import { UpdateCertificateDto } from '../dtos/UpdateCertificate.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('certificate')
export class CertificateController {
  constructor(private readonly certificateService: CertificateService) {}

  @Get()
  async getAll() {
    return this.certificateService.getAll();
  }
  @Get('search')
  async searchCandidate(
    @Query('examScheduleUID', ParseIntPipe) examScheduleUID: number,
    @Query('query') query: string,
  ) {
    return this.certificateService.searchCandidateNumber(examScheduleUID, query);
  }
  


  @Post()
  async insertOne(@Body() dto: CreateCertificateDto) {
    return this.certificateService.insertOne(dto);
  }

  @Put(':id/print')
  async markAsPrinted(@Param('id', ParseIntPipe) id: number) {
    await this.certificateService.updateStatusWhenPrinted(id);
    return { message: 'Certificate marked as Printed' };
  }

  // certificate.controller.ts
  @Put(':id/ready')
  async markReadyForPickup(@Param('id', ParseIntPipe) id: number) {
    return this.certificateService.markReadyForPickup(id);
  }

    @Post(':id/email')
    @UseInterceptors(FileInterceptor('pdf'))
    async sendCertificateEmail(
      @Param('id', ParseIntPipe) id: number,
      @UploadedFile() pdfFile: Express.Multer.File,
    ) {
      return this.certificateService.sendCertificateEmail(id, pdfFile);
    }

@Put(':id/issue')
async issueCertificate(@Param('id', ParseIntPipe) id: number) {
  return this.certificateService.issueCertificate(id);
}

}
