import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { environment } from '../../environments/environment';

export function pexelsInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) {
  const apiKey = environment.apiKey;

  const authReq = req.clone({
    headers: req.headers.set('Authorization', `${apiKey}`),
  });

  return next(authReq);
}
