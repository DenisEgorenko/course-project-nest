import { IsIn, IsString } from 'class-validator';

export class SetLikeStatusDto {
  @IsString()
  @IsIn(['None', 'Like', 'Dislike'])
  likeStatus: string;
}
