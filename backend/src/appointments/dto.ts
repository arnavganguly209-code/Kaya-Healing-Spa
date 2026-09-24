import { Type } from "class-transformer";
import { IsEmail, IsInt, IsOptional, IsString, Max, Min, MinLength } from "class-validator";

export class CreateAppointmentDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  phone!: string;

  @IsString()
  @MinLength(8)
  preferredDate!: string;

  @IsString()
  @MinLength(4)
  preferredTime!: string;

  @IsOptional()
  @IsString()
  serviceSlug?: string;

  @IsOptional()
  @IsString()
  packageSlug?: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(8)
  guests!: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateNewsletterDto {
  @IsEmail()
  email!: string;
}

export class CreateContactDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  message!: string;
}
