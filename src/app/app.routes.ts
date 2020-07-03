import { Routes, RouterModule } from '@angular/router';

import { ColaboradorComponent } from './components/colaborador/colaborador.component';
import { ColaboradoresComponent } from './components/colaboradores/colaboradores.component';

const APP_ROUTES: Routes = [
    { path: 'home', component: ColaboradoresComponent, data: { titulo: 'Colaboradores'}},
    { path: 'colaborador/:id', component: ColaboradorComponent, data: { titulo: 'Perfil'}},
    { path: '**', pathMatch: 'full', redirectTo: 'home'}
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);
