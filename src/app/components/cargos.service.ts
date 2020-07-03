import { Injectable } from '@angular/core';
import { Cargo } from './cargo.mode';
import {environment} from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

const BACKEND_URL = environment.apiUrl + '/cargos';

@Injectable({
  providedIn: 'root'
})
export class CargosService {

  constructor(private http: HttpClient) { }

  getCargos() {
    return this.http.get<{ok: true, cargos: Cargo[]}>(BACKEND_URL).pipe(
      map(resp => resp.cargos)
    );
  }
}
