import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ColaboradoresService } from '../colaboradores.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-borrar-dialog',
  templateUrl: './borrar-dialog.component.html',
  styleUrls: ['./borrar-dialog.component.css']
})
export class BorrarDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<BorrarDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {id: number, colaboradoresPerPage: number, currentPage: number},
    public colaboradorService: ColaboradoresService) { }

  cerrar() {
    this.dialogRef.close();
  }

  borrar() {
    this.colaboradorService.borrarColaborador(this.data.id).subscribe(msg => {
      if (msg.ok) {
        this.colaboradorService.getColaboradores(this.data.colaboradoresPerPage, this.data.currentPage);
        this.dialogRef.close();
        Swal.fire({
          icon: 'success',
          text: 'Trabajador Eliminado!',
          width: '250px'
        });
      }
    });
  }

}
