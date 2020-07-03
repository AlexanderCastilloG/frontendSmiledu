import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Colaborador } from '../colaborador.model';
import { ColaboradoresService } from '../colaboradores.service';
import { Cargo } from '../cargo.mode';
import { CargosService } from '../cargos.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, Observer } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {

  colaborador: Colaborador;
  form: FormGroup;
  crear = true;
  verifyEmail = false;

  cargos: Cargo[] = [];

  constructor(
    public dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {add: boolean, colaborador: Colaborador},
    public colaboradorService: ColaboradoresService,
    public cargoService: CargosService) { }

  ngOnInit(): void {

    this.cargoService.getCargos().subscribe(cargos => {
      this.cargos = cargos;
    });

    this.form = new FormGroup({
      nombres: new FormControl(null, { validators: [Validators.required]}),
      apellidos: new FormControl(null, { validators: [Validators.required]}),
      cargo: new FormControl(null, { validators: [Validators.required]}),
      correo: new FormControl(null, {
        validators: [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]
      }),
      salario: new FormControl(null, { validators: [Validators.required]})
    });

    this.form.controls.correo.setAsyncValidators([
      this.verificarCorreo.bind(this)
    ]);

    if (!this.data.add) {
      this.crear = false;
      this.colaborador = this.data.colaborador;

      this.form.setValue({
        nombres : this.colaborador.nombres,
        apellidos : this.colaborador.apellidos,
        cargo: this.colaborador.cargo_id,
        correo: this.colaborador.correo,
        salario: this.colaborador.salario
      });
    }
  }

  guardar(): void {

    if (this.form.invalid) {
      return;
    }

    const usuario: Colaborador = {
      ...this.colaborador,
      nombres: this.form.value.nombres,
      apellidos : this.form.value.apellidos,
      cargo: this.form.value.cargo,
      correo: this.form.value.correo,
      salario: this.form.value.salario
    };

    this.colaboradorService.guardarColaborador(usuario).subscribe(resp => {
      if (this.crear) {
        this.colaboradorService.getColaboradores(10, 0);
        Swal.fire({
          icon: 'success',
          text: 'Trabajador Registrado!',
          width: '250px'
        });
      } else {

        const data = this.cargos.find(cargo => cargo.id === resp.cargo_id);

        this.colaboradorService.colaborador.next({
          ...usuario,
          cargo: data.cargo,
          cargo_id: data.id
        });
        Swal.fire({
          icon: 'success',
          text: 'Trabajador Actualizado!',
          width: '250px'
        });
      }

      this.cerrar();

    });

    this.form.reset({});
  }

  verificarCorreo(control: FormControl): Promise<any> | Observable<any> {

    const forma: any = this;
    let id;

    const frObs = Observable.create((observer: Observer<{[key: string]: any}>) => {

      if (forma.crear) {
        id = 0;
      } else {
        id = forma.colaborador.id;
      }

      forma.colaboradorService.findEmail(control.value, id).subscribe(data => {
        if (data.ok) {
          observer.next({invalidCorreo: true});
        } else {
          observer.next(null);
        }

        observer.complete();
      });

    });

    return frObs;
  }

  cerrar() {
    this.dialogRef.close();
  }
}
