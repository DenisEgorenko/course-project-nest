import { IsBoolean } from 'class-validator';

export class BanStatusDto {
  @IsBoolean()
  isBanned: boolean;
}
