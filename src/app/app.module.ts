import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// angularMaterial
import { AngularMaterialModule } from './angular-material.module';

// routes
import { APP_ROUTING } from './app.routes';

// components
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColaboradoresComponent } from './components/colaboradores/colaboradores.component';
import { ColaboradorComponent } from './components/colaborador/colaborador.component';
import { HeaderComponent } from './components/header/header.component';
import { BorrarDialogComponent } from './components/borrar-dialog/borrar-dialog.component';
import { ModalComponent } from './components/modal/modal.component';

// pipes
import { SalarioPipe } from './pipes/salario.pipe';
import { CapitalizadoPipe } from './pipes/capitalizado.pipe';


@NgModule({
  declarations: [
    AppComponent,
    SalarioPipe,
    CapitalizadoPipe,
    HeaderComponent,
    BorrarDialogComponent,
    ColaboradoresComponent,
    ColaboradorComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    APP_ROUTING,
    AngularMaterialModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    BorrarDialogComponent,
    ModalComponent
  ]
})
export class AppModule { }
