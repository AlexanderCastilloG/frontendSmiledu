import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

import { ColaboradoresService } from '../colaboradores.service';
import { Colaborador } from '../colaborador.model';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { BorrarDialogComponent } from '../borrar-dialog/borrar-dialog.component';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-colaboradores',
  templateUrl: './colaboradores.component.html',
  styleUrls: ['./colaboradores.component.css']
})
export class ColaboradoresComponent implements OnInit, OnDestroy {

  private colaboradores: Colaborador[] = [];
  private colaboradoresSub: Subscription;

  totalColaboradores = 0;
  colaboradoresPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [5, 10, 15, 20];

  displayedColumns: string[] = ['nombres', 'salario', 'estado', 'cargo', 'correo', 'ver', 'borrar'];
  dataSource = new MatTableDataSource<Colaborador>([]);

  constructor(
    public colaboradoresService: ColaboradoresService,
    public dialog: MatDialog) {}

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  ngOnInit() {

    this.colaboradoresService.getColaboradores(this.colaboradoresPerPage, this.currentPage);

    this.colaboradoresSub = this.colaboradoresService.getColaboradorUpdateListener()
    .subscribe((colaboradoresData: {colaboradores: Colaborador[], colaboradorCount: number}) => {
      this.totalColaboradores = colaboradoresData.colaboradorCount;
      this.colaboradores = colaboradoresData.colaboradores;
      this.dataSource = new MatTableDataSource<Colaborador>(this.colaboradores);
    });

    this.dataSource.paginator = this.paginator;
  }

  onChangedPage(pageData: PageEvent) {
    this.currentPage = pageData.pageIndex + 1; // pageIndex empieza de cero según angular material
    this.colaboradoresPerPage = pageData.pageSize;
    this.colaboradoresService.getColaboradores(this.colaboradoresPerPage, this.currentPage);
  }

  registrar(): void {
    this.dialog.open(ModalComponent, {
      data: {add: true, colababorador: null}
    });
  }

  onDelete(id: number) {
    this.dialog.open(BorrarDialogComponent, {
      data: {id, colaboradoresPerPage: this.colaboradoresPerPage, currentPage: this.currentPage}
    });
  }

  ngOnDestroy(): void {
    this.colaboradoresSub.unsubscribe();
  }
}
