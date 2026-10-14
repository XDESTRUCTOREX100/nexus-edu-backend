import { Injectable } from '@nestjs/common';

@Injectable()
export class AuditService {
  log(action: string, userId?: number) {
    return { action, userId, ok: true };
  }
}
