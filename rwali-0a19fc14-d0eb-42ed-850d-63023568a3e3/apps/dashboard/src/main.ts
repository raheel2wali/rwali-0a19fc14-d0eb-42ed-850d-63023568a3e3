import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/routes';
import { AppComponent } from './app/app.component';
import { authInterceptor } from './app/shared/auth.interceptor';


bootstrapApplication(AppComponent, {
providers: [
provideHttpClient(withInterceptors([authInterceptor])),
provideRouter(routes),
],
}).catch(err => console.error(err));
