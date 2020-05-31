//Modules
import { Routes,RouterModule } from '@angular/router';
//Guards
import { AuthGuard } from './_guards/index';
//Components
import { DatabaseComponent } from './database/index';
import { DetailviewerComponent } from './detailviewer/index';
import { DetailviewerIntranetComponent } from './detailviewerIntranet/index';
import { DetailviewerIntranetROComponent } from './detailviewerIntranetRO/index';
import { DetailviewerIntranetRWComponent } from './detailviewerIntranetRW/index';
import { HomeComponent } from './home/index';
import { LoginComponent } from './login/index';
import { RedirectDVIntranetComponent } from './redirectdvIntranet/index';
import { RegisterComponent } from './register/index';
import { UsersComponent } from './users/index';
import { WorkareaComponent } from './workarea/index';
import { WorkareaIntranetComponent } from './workareaIntranet/index';

const appRoutes: Routes=[
  { path: 'database',component: DatabaseComponent, canActivate: [AuthGuard] },
  { path: 'detailviewer',component: DetailviewerComponent},
  { path: 'detailviewerIntranet',component: DetailviewerIntranetComponent, canActivate: [AuthGuard] },
  { path: 'detailviewerIntranetRO',component: DetailviewerIntranetROComponent, canActivate: [AuthGuard] },
  { path: 'detailviewerIntranetRW',component: DetailviewerIntranetRWComponent, canActivate: [AuthGuard] },
  { path: '',component: HomeComponent },
  { path: 'login',component: LoginComponent },
  { path: 'redirectdvIntranet',component: RedirectDVIntranetComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },
  { path: 'workarea',component: WorkareaComponent},
  { path: 'workareaIntranet',component: WorkareaIntranetComponent, canActivate: [AuthGuard] },
  // otherwise redirect to home
  { path: '**', redirectTo: '' }  //quest'ultimo serve a ridirigere sulla home in qualsiasi caso qualcosa delle precedenti vada male - gli asterischi sono wildcards - è una catena ma che si aspetta comunque un match per fare qualcosa, non ha dei predefiniti... se commentata questa riga non c'è un match esatto per molte cose, quando la pagina fallisce si ricarica solo il container.
];

export const routing=RouterModule.forRoot(appRoutes);
