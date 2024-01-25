import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as session from "express-session";
import * as passport from 'passport';
import { AppModule } from './app.module';
import { Authmodule } from './modules/authUsers/authUser.module';
import { ClientsModule } from './modules/clients/clients.module';
import { ProductModule } from './modules/product/product.module';
import { CartModule } from './modules/shoppingCartsAndOrders/shoppingCartsAndOrders.module';
import { WishListModule } from './modules/wishlist/wishlist.module';

async function bootstrap(){
  const app = await NestFactory.create(AppModule);
  //enable cors
  app.enableCors()
  //setting the swagger
  const config = new DocumentBuilder() 
  .setTitle('set ring info')
  .setDescription('The set ring API description')
  .setVersion('1.0')
  .addTag('ring')
  .build();
  app.enableCors();
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
