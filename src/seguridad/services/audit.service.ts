import { Injectable } from '@nestjs/common';

@Injectable()
export class AuditService {
  async log(action: string, userId?: number) {
    return { action, userId, ok: true };
  }
}
