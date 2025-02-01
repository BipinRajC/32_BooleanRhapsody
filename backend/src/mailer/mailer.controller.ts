import { Controller, Get } from '@nestjs/common';
import { MailerService } from './mailer.service';

@Controller('mailer')
export class MailerController {
  constructor(private mailService: MailerService) {}

  @Get('sendMail')
  sendMail() {
    this.mailService.sendMail('test', 'karthik.pv77@gmail.com');
    return { message: 'Email sent successfully.' };
  }
}
