import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as passport from 'passport';
import * as session from "express-session"
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"
import { ValidationPipe } from '@nestjs/common';
import { ClientsModule } from './clients/clients.module';
import { Authmodule } from './authUsers/authUser.module';
import { ProductModule } from './models/product/product.module';
import { WishListModule } from './models/wishlist/wishlist.module';
import { CartModule } from './models/shoppingCartsAndOrders/shoppingCartsAndOrders.module';

async function bootstrap(){
  const app = await NestFactory.create(AppModule);
  //setting the swagger
  const config = new DocumentBuilder()
  .setTitle('set ring info')
  .setDescription('The set ring API description')
  .setVersion('1.0')
  .addTag('ring')
  .build();
  const document = SwaggerModule.createDocument(app,config,
    {
      include: [
        ClientsModule,
        Authmodule,
        ProductModule,
        WishListModule,
        CartModule
      ]
    });
  SwaggerModule.setup('api/docs',app,document)
  // app.useGlobalPipes(new ValidationPipe({whitelist:true}));
  // app.enableCors();
  // setting up passport and sessions for user authentication

  app.setGlobalPrefix('api');
  app.use(
    session({
      secret:'awajurieiduueidheufyeiehc',
      saveUninitialized:false,
      resave:false,
      cookie:{
        maxAge: 60000,
      },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session())
  await app.listen(3001);
}
bootstrap();
