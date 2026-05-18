import { Body, Controller, Post } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateMessageDTO } from './dtos/create-message.dto';

@Controller('contact') // Daje endpoint: /api/contact
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Post('/')
  public create(@Body() messageData: CreateMessageDTO) {
    return this.contactService.create(messageData);
  }
}
