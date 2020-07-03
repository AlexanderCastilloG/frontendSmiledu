import { Injectable } from '@angular/core';
import { Colaborador } from './colaborador.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {map} from 'rxjs/operators';

import {environment} from '../../environments/environment';
import { Subject } from 'rxjs';

const BACKEND_URL = environment.apiUrl + '/colaboradores';

@Injectable({
  providedIn: 'root'
})
export class ColaboradoresService {

  private colaboradores: Colaborador[] = [];
  private colaboradorUpdated = new Subject<{colaboradores: Colaborador[], colaboradorCount: number}>();
  public colaborador = new Subject<Colaborador>();
  private catchError = new Subject<boolean>();

  constructor(private http: HttpClient, private route: Router) {}

  getColaboradores(colaboradoresPerPage?: number, currentPage?: number) {

    const queryParams = `?pagesize=${colaboradoresPerPage}&page=${currentPage}`;

    this.http.get<{message: string, colaboradores: any, maxColaboradores: number}>(BACKEND_URL + queryParams)
    .pipe(
      map(data => {
        return {
          colaboradores: data.colaboradores.map((colaborador: Colaborador) => {
            const info: string[] = this.transformData(colaborador.nombres.toLowerCase(), colaborador.apellidos.toLowerCase());
            return {
              id: colaborador.id,
              nombres:  info[0] + ' ' + info[1],
              apellidos: colaborador.apellidos,
              salario: colaborador.salario,
              estado: colaborador.estado,
              cargo: colaborador.cargo,
              correo: colaborador.correo,
              created_at: colaborador.created_at,
              cargo_id: 0
            };
          }),
          maxColaboradores: data.maxColaboradores
        };
      })
    )
      .subscribe((transData) => {
        this.colaboradores = transData.colaboradores;
        this.colaboradorUpdated.next({
            colaboradores: [...this.colaboradores],
            colaboradorCount: transData.maxColaboradores
        });
      }, error => {
        this.catchError.next(true);
      });
  }

  getColaboradorUpdateListener() {
    return this.colaboradorUpdated.asObservable();
  }

  private transformData(nom: string, ape: string): string[] {
    const nombre = nom.split(' ');
    const apellido = ape.split(' ');
    let name;
    let lastName;

    if (nombre.length >= 2) {
      name = this.firstUpData(nombre[0]) + nombre[0].slice(1) + ' ' + this.firstUpData(nombre[1]) + nombre[1].slice(1);
    } else {
      name = this.firstUpData(nombre[0]) + nombre[0].slice(1);
    }

    if (apellido.length >= 2) {
      lastName =  this.firstUpData(apellido[0]) + apellido[0].slice(1) + ' ' + this.firstUpData(apellido[1]) + '.';
    } else {
      lastName = this.firstUpData(apellido[0]) + apellido[0].slice(1);
    }

    return [name, lastName];
  }

  private firstUpData(data: string): string {
    return data.charAt(0).toUpperCase();
  }


  getColaborador(id: string) {
    return this.http.get<{ok: boolean, colaborador: Colaborador}>(`${BACKEND_URL}/${id}`).pipe(
      map(data => {
        this.colaborador.next(data.colaborador);
        return data.colaborador;
      })
    );
  }

  updateColaborador() {
    return this.colaborador.asObservable();
  }

  guardarColaborador(colaborador: Colaborador) {
    let url = BACKEND_URL;

    if (colaborador.id) {
      // actualizando
      url += '/' + colaborador.id;
      return this.http.put<{ok: boolean, message: string, colaborador: Colaborador}>(url, colaborador).pipe(
        map((resp) => resp.colaborador)
      );

    } else {
      // creando
      return this.http.post<{ok: boolean, colaborador: Colaborador}>(url, colaborador).pipe(
        map((resp) => resp.colaborador)
      );
    }
  }

  borrarColaborador(id: number) {
    const url = BACKEND_URL + '/' + id;

    return this.http.delete<{ok: boolean, message: string}>(url);
  }

  findEmail(email: string, id?: number) {

    const url = BACKEND_URL + '/email/' + email + '/' + id;

    return this.http.get<{ok: number, message: string}>(url);
  }

}
