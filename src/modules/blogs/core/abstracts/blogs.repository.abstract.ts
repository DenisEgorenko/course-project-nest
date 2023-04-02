import { BlogBaseEntity } from '../entity/blog.entity';

export abstract class IBlogsRepository {
  abstract save(blog: BlogBaseEntity);

  abstract getBlogById(id: string);

  abstract getAllBannedBlogsIds();

  abstract deleteBlogById(blogId: string);
}
