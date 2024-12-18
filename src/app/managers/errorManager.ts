import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Injectable} from '@angular/core';
import Swal from 'sweetalert2';

export interface ErrorResponse {
  status: number;
  message: string;
  details?: any;
}
@Injectable({
  providedIn: 'root',
})
export class HttpErrorManager {
  constructor() {}

  public async handleError(error: HttpErrorResponse): Promise<Observable<ErrorResponse>> {
    let errorResponse: ErrorResponse;
  
    if (error.error instanceof ErrorEvent) {
      errorResponse = {
        status: error.status,
        message: 'Error de red o del cliente',
        details: error.error.message,
      };
    } else {
      errorResponse = {
        status: error.status,
        message: 'Ha ocurrido un error, por favor inténtalo nuevamente.',
        details: error.error,
      };
    }
     
    console.error('Error capturado:', error.status, error.error);
  
    await Swal.fire({
      icon: 'error',
      title: `Error ${errorResponse.status || 'Error'}`,
      text: errorResponse.message || 'Algo salió mal.',
      confirmButtonText: 'OK',
      confirmButtonColor: 'rgb(100, 21, 21)',
    });    
  
    return throwError(errorResponse);
  }  
}
