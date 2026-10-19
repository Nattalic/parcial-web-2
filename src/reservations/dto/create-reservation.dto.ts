import { IsInt, IsNotEmpty, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateReservationDto {
  // TODO 1: Add the validators required by the examination. Do not convert body numbers.
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  purpose!: string;

  @IsInt()
  @Min(1)
  @Max(20)
  participants!: number;

  @IsInt()
  @Min(1)
  roomId!: number;
}
