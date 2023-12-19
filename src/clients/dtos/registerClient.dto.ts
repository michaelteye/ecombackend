import {
    IsAlphanumeric,
    isDate,
    IsDate,
    IsEmail,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsPhoneNumber,
    IsString,
    MinLength,
  } from 'class-validator';
import { OmitType } from '@nestjs/swagger';
import { authUserDto } from 'src/authUsers/dtos/authUsers.dto';

import { authEntity } from 'src/authUsers/entities/authUser.entity';
  
  const passwordRegEx =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@$!%*?&])[A-Za-zd@$!%*?&]{8,20}$/;
  
  export class RegisterClientDto  extends authUserDto{
    @IsString()

    firstName: string;

    @IsString()

    lastName: string;
  
    @IsNotEmpty()
    
    userName: string;

    @IsNotEmpty()
    pasword: string;

    @IsNotEmpty()
    phone: string;

  
    @IsNotEmpty()
    email: string;
  
    @IsInt()
    age: number;
  
    @IsString()
    @IsEnum(['f', 'm', 'u'])
    gender: string;

    @IsString()
    @IsEnum(['local', 'google'])
    provider:string

    authUser: authEntity;
    

    @IsNotEmpty()
    @IsDate()
    dateofBirth:Date

    @IsNotEmpty()
    @IsDate()
    createdAt:Date;

    @IsNotEmpty()
    @IsDate()
    updatedAt:Date;
  }

  export class RegisterAdmintDto extends OmitType(RegisterClientDto,[
    'age',
    'gender',
    'provider',
    'userName',
    'dateofBirth',
    'userName'
  ]){
    @IsString() 
    firstName: string;

    @IsString()
    lastName: string;

    @IsNotEmpty()
    pasword: string;

    @IsNotEmpty()
    phone: string;

  
    @IsNotEmpty()
    email: string;
  }
  export class signInWithGoogleDto extends OmitType(authUserDto,[
    'password',
    'phone',
    'createdAt',
    'updatedAt'
  ]){
    @IsNotEmpty()
    @IsString()
    userName: string;
  
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;
}

export class RegisterWithGoogleDto extends OmitType(authUserDto,[
  'password',
  'phone',
  'createdAt',
  'updatedAt'
  
]){
  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;
}
  
