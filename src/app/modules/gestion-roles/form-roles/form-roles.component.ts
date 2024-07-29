import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Rol, Usuario } from '../utils';
import { RequestManager } from 'src/app/managers/requestManager';
import { TokenService } from 'src/app/managers/token'; 
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-form-roles',
  templateUrl: './form-roles.component.html',
  styleUrls: ['./form-roles.component.scss']
})
export class FormRolesComponent /*implements OnInit*/ {
  // rolesUsuario: Rol[] = [];
  // rolesSistema: Rol[] = [
  //   { rol: 'ROL_AUDITOR', selected: false },
  //   { rol: 'ROL_EJECUTOR', selected: false },
  //   { rol: 'ROL_SOPORTE', selected: false }
  // ];

  // @Input() usuario: Usuario = {
  //   role: [],
  //   documento: '',
  //   email: '',
  //   Estado: ''
  // };

  // @Output() errorEnPeticion = new EventEmitter<any>();

  // constructor(
  //   private request: RequestManager,
  //   private router: Router,
  //   private tokenService: TokenService // Inyecta el servicio de token
  // ) { }

  // ngOnInit(): void {
  //   this.initializeUserFromToken();
  //   this.rolesUsuario = this.formatearRoles(this.usuario);
  //   this.rolesSistema = this.rolesSistema.filter(sistemaRol => {
  //     return !this.rolesUsuario.some(usuarioRol => usuarioRol.rol === sistemaRol.rol);
  //   });

  //   this.validarRoles(this.rolesUsuario, this.rolesSistema);
  // }

  // //Se obtienen los datos del usuario desde el token en el local storage de manera temporal
  // initializeUserFromToken(): void {
  //   const token = this.tokenService.getToken();
  //   if (token) {
  //     const payload = JSON.parse(atob(token.split('.')[1]));
  //     this.usuario = {
  //       role: payload.roles || ['ROL_SOPORTE'], //Se agrega un rol por defecto para pruebas
  //       documento: payload.documento || '',
  //       email: payload.email || '',
  //       Estado: payload.Estado || 'Activo'
  //     };
  //   }
  //   console.log(this.usuario);
  // }

  // seleccionarRol(item: Rol) {
  //   item.selected = !item.selected;
  // }

  // vincularRol() {
  //   const rolesSeleccionados = this.rolesSistema.filter(item => item.selected);
  //   if (rolesSeleccionados.length === 0) return;
  //   Swal.fire({
  //     title: 'Vincular Rol',
  //     icon: 'warning',
  //     text: `¿Está seguro de vincular el rol al usuario?, si el usuario tiene otra vinculación se verá afectada con el cambio de rol`,
  //     showCancelButton: true,
  //     confirmButtonText: `Si`,
  //     cancelButtonText: `No`,
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       const successfulResponses: any[] = []; // Variable para almacenar las respuestas exitosas
        
  //       rolesSeleccionados.reduce((promiseChain, rol) => {
  //         return promiseChain.then(() => {
  //           return new Promise((resolve, reject) => {
  //             let body = {
  //               "user": this.usuario.email,
  //               "rol": rol.rol
  //             };
  //             this.mostrarMensajeCarga();
        
  //             this.request.post(`${environment.AUTENTICACION_MID}/rol/add`, '', body)
  //               .subscribe((data) => {
  //                 if (data != null && data != undefined && data != "") {
  //                   this.cerrarMensajeCarga();
  //                   data.rolUsuario = rol; // Agregar el nombre del rol a la respuesta
  //                   successfulResponses.push(data); // Almacenar la respuesta exitosa
  //                   resolve();
  //                 }
  //               }, (error) => {
  //                 Swal.fire({
  //                   title: 'Error en la operación',
  //                   text: `No se pudo vincular el rol ${rol.rol} al usuario`,
  //                   icon: 'warning',
  //                   showConfirmButton: false,
  //                   timer: 2500
  //                 }).then(() => {
  //                   this.enviarErrorPeticion();
  //                 });
  //                 reject(error);
  //               });
  //           });
  //         });
  //       }, Promise.resolve())
  //       .then(async () => {
  //         for (const response of successfulResponses) {
  //           if (response != null && response != undefined) {
  //             if (response.data != "" && response.status === 200) {
  //               if (!this.rolesUsuario.find(i => i.rol === response.rolUsuario.rol)) {
  //                 this.rolesUsuario.push({ ...response.rolUsuario });
  //               }
  //               this.rolesSistema = this.rolesSistema.filter(item => !item.selected);
  //               await this.mostrarMensajeExito(response.rolUsuario.rol, 'vincular');
  //             } else if (response.status === 400 && response.success == false) {
  //               this.mostrarMensajeError(`El usuario ya tiene el rol ${response.rolUsuario.rol} asignado`);
  //             } else {
  //               this.mostrarMensajeError(`No se pudo vincular el rol ${response.rolUsuario.rol} al usuario`);
  //             }
  //           }
  //         }
  //         this.clearSelection();
  //       }).catch(error => {
  //         console.error('Error en alguna de las promesas de vinculación de roles:', error);
  //       });
  //     } else if (result.dismiss === Swal.DismissReason.cancel) {
  //       Swal.fire({
  //         title: 'Cambio cancelado',
  //         icon: 'error',
  //         showConfirmButton: false,
  //         timer: 2500
  //       });
  //     }
  //   });
  // }

  // desvincularRol() {
  //   const rolesSeleccionados = this.rolesUsuario.filter(item => item.selected);
  //   if (rolesSeleccionados.length === 0) return;
  //   Swal.fire({
  //     title: 'Desvincular Rol',
  //     icon: 'warning',
  //     text: `¿Está seguro de desvincular el rol al usuario? Si el usuario tiene otra vinculación, se verá afectada con el cambio de rol.`,
  //     showCancelButton: true,
  //     confirmButtonText: `Sí`,
  //     cancelButtonText: `No`,
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       const successfulResponses: any[] = []; // Variable para almacenar las respuestas exitosas
  
  //       rolesSeleccionados.reduce((promiseChain, rol) => {
  //         return promiseChain.then(() => {
  //           return new Promise((resolve, reject) => {
  //             let body = {
  //               "user": this.usuario.email,
  //               "rol": rol.rol
  //             };
  //             this.mostrarMensajeCarga();
  
  //             this.request.post(`${environment.AUTENTICACION_MID}/rol/remove`, '', body)
  //               .subscribe((data: any) => {
  //                 if (data != null && data != undefined && data != "") {
  //                   this.cerrarMensajeCarga();
  //                   data.rolUsuario = rol; // Agregar el nombre del rol a la respuesta
  //                   successfulResponses.push(data); // Almacenar la respuesta exitosa
  //                   resolve();
  //                 }
  //               }, (error) => {
  //                 Swal.fire({
  //                   title: 'Error en la operación',
  //                   text: 'No se pudo desvincular el rol del usuario',
  //                   icon: 'warning',
  //                   showConfirmButton: false,
  //                   timer: 2500
  //                 }).then(() => {
  //                   this.enviarErrorPeticion();
  //                 });
  //                 reject(error);
  //               });
  //           });
  //         });
  //       }, Promise.resolve())
  //       .then(async () => {
  //         for (const response of successfulResponses) {
  //           if (response != null && response != undefined) {
  //             if (response.data != "" && response.status === 200) {
  //               if (!this.rolesSistema.find(i => i.rol === response.rolUsuario.rol)) {
  //                 this.rolesSistema.push({ ...response.rolUsuario });
  //               }
  //               this.rolesUsuario = this.rolesUsuario.filter(item => !item.selected);
  //               await this.mostrarMensajeExito(response.rolUsuario.rol, 'desvincular');
  //             } else if (response.status === 400 && response.success == false) {
  //               this.mostrarMensajeError(`El usuario no tiene el rol ${response.rolUsuario.rol} asignado`);
  //             } else {
  //               this.mostrarMensajeError(`No se pudo desvincular el rol ${response.rolUsuario.rol} del usuario`);
  //             }
  //           }
  //         }
  //         this.clearSelection();
  //       })
  //       .catch(error => {
  //         console.error('Error en alguna de las promesas de desvinculación de roles:', error);
  //       });
  //     } else if (result.dismiss === Swal.DismissReason.cancel) {
  //       Swal.fire({
  //         title: 'Cambio cancelado',
  //         icon: 'error',
  //         showConfirmButton: false,
  //         timer: 2500
  //       });
  //     }
  //   });
  // }

  // mostrarMensajeCarga(): void {
  //   Swal.fire({
  //     title: 'Realizando petición...',
  //     allowEscapeKey: false,
  //     allowOutsideClick: false,
  //     didOpen: () => {
  //       Swal.showLoading();
  //     }
  //   });
  // }

  // cerrarMensajeCarga(): void {
  //   Swal.close();
  // }

  // mostrarMensajeExito(rol: string, tipo: string) {
  //   let mensaje = '';
  //   tipo == 'vincular' ? mensaje = `Rol ${rol} vinculado correctamente` : mensaje = `Rol ${rol} desvinculado correctamente`;
  
  //   return new Promise(resolve => {
  //     Swal.fire({
  //       title: 'Operación exitosa',
  //       text: mensaje,
  //       icon: 'success',
  //       showConfirmButton: false,
  //       timer: 2500,
  //       willClose: () => resolve(true)
  //     });
  //   });
  // }

  // mostrarMensajeError(mensaje: any) {
  //   Swal.fire({
  //     title: 'Error en la operación',
  //     text: mensaje,
  //     icon: 'warning',
  //     showConfirmButton: false,
  //     timer: 2500
  //   });
  // }

  // clearSelection() {
  //   this.rolesUsuario.forEach(item => item.selected = false);
  //   this.rolesSistema.forEach(item => item.selected = false);
  // }

  // formatearRoles(usuario: Usuario): Rol[] {
  //   return usuario.role
  //     .filter(rol => rol !== 'Internal/everyone' && rol !== 'Internal/selfsignup')
  //     .map(rol => ({ rol: rol, selected: false }));
  // }

  // validarRoles(rolesUsuario: Rol[], rolesSistema: Rol[]) {
  //   // Crea un conjunto de roles del usuario para facilitar la búsqueda
  //   const rolesSet = new Set(rolesUsuario.map(role => JSON.stringify(role)));

  //   // Filtra los roles del sistema excluyendo los del usuario
  //   this.rolesSistema = rolesSistema.filter(role => !rolesSet.has(JSON.stringify(role)));
  // }

  // enviarErrorPeticion() {
  //   this.errorEnPeticion.emit(true);
  // }
}