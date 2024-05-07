import { Controller, Get } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}
  @Get()
  public async sendEmail() {
    await this.emailService.sendEmailFromTemplate(
      'mayronfernandes01@gmail.com',
      'teste',
      'confirm-create-account',
      {
        name: 'mayron',
        confirmation_url:
          'https://mc.sendgrid.com/dynamic-templates/d-ef84b95b6054467194fe75d93d787a48/version/534d2dc4-33ef-4370-b3f6-95ddaa7ecaf6/editor',
      },
    );
  }
}
