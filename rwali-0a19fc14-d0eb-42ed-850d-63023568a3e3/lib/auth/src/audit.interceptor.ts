import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import * as fs from 'fs';
const path = process.env.AUDIT_LOG_PATH || './tmp/audit.log';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const req = ctx.switchToHttp().getRequest();
    const start = Date.now();
    return next.handle().pipe(
      tap({
        next: () => log('OK'),
        error: (err) => log('ERR', err?.message),
      }),
    );

    function log(status: string, msg?: string) {
      const user = req.user ? `${req.user.id}:${req.user.email}` : 'anon';
      const line = JSON.stringify({
        ts: new Date().toISOString(),
        user,
        method: req.method,
        url: req.url,
        status,
        ms: Date.now() - start,
        msg,
      }) + '\n';
      fs.mkdirSync(require('path').dirname(path), { recursive: true });
      fs.appendFileSync(path, line);
      console.log('[AUDIT]', line.trim());
    }
  }
}
