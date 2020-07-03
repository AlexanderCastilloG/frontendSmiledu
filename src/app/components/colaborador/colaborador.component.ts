import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ColaboradoresService } from '../colaboradores.service';
import { Colaborador } from '../colaborador.model';
import { ModalComponent } from '../modal/modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-colaborador',
  templateUrl: './colaborador.component.html',
  styleUrls: ['./colaborador.component.css']
})
export class ColaboradorComponent implements OnInit, OnDestroy {

  colaborador: Colaborador;
  colaboradorSubcription: Subscription;
  estado = false;

  constructor(
    public colaboradorService: ColaboradoresService,
    public route: ActivatedRoute,
    public router: Router,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('id')) {
        this.cargarColaborador(paramMap.get('id'));
      }
    });

    this.colaboradorSubcription = this.colaboradorService.updateColaborador().subscribe(data => {
      this.colaborador = data;
    });
  }

  cargarColaborador(id: string) {
    this.colaboradorService.getColaborador(id).subscribe(data => {
      this.estado = !this.estado;
      this.colaborador = data;
    }, err => {
      const {error: {ok}} = err;
      if (!ok) {
        this.router.navigate(['home']);
      }
    });
  }

  editar(): void {
    this.dialog.open(ModalComponent, {
      data: {add: false, colaborador: this.colaborador}
    });
  }

  ngOnDestroy(): void {
    this.colaboradorSubcription.unsubscribe();
  }

}
