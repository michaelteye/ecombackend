// mailer.module.ts
import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.mailtrap.io',
        port: 2525,
        secure: false,
        auth: {
          user: 'bad313cf8d0c11',
          pass: 'e113c0e7ddacb3',
        },
      },
      defaults: {
        from: 'ecom.com',
      },
      template: {
        dir: __dirname + '/templates', // Specify the directory for email templates
        adapter: new HandlebarsAdapter(), // Use Handlebars templating engine
        options: {
          strict: true,
        },
      },
    }),
  ],
})
export class MailerConfigModule {}
