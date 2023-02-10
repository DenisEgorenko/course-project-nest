import * as bcrypt from 'bcrypt';

import { Injectable } from '@nestjs/common';

@Injectable()
export class PasswordService {
  async generateSalt() {
    return await bcrypt.genSalt(10);
  }

  async generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt);
  }
}
