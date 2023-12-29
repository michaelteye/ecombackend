import { Exclude } from 'class-transformer';
import { IsAlphanumeric, IsDate, IsEmail, IsEnum, IsInt, IsNotEmpty, IsPhoneNumber, IsString, MinLength } from 'class-validator';
import { authEntity } from 'src/modules/authUsers/entities/authUser.entity';

export class CreateUserResponseDTO {
  id: string;
  @IsString()
 
  @IsNotEmpty()
  firstName: string;

  @IsString()
 
  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  
  // @IsAlphanumeric(null, {
  //   message: 'Username does not allow other than alpha numeric chars.',
  // })
  userName: string;

  @IsNotEmpty()
  // @IsEmail(null, { message: 'Please provide valid Password.' })
  password: string;

  @IsNotEmpty()
  // @IsPhoneNumber(null,{message:'phone number must start from 233'})
  phone: string;


  @IsNotEmpty()

  email: string;

  @IsInt()
  age: number;

  @IsString()
  @IsEnum(['f', 'm', 'u'])
  gender: string;  

  @IsNotEmpty()
  @IsDate()
  dateofBirth:Date

  @IsNotEmpty()
  @IsDate()
  createdAt:Date;

  @IsNotEmpty()
  @IsDate()
  updatedAt:Date;

  @Exclude()
  authUser: authEntity;
}

  // Exclude the authUser property to break the circular reference
  

