import { Component, Inject,OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

  @Component({
  selector: 'app-usuario-no-encontrado',
  templateUrl: './usuario-no-encontrado.component.html',
  styleUrls: ['./usuario-no-encontrado.component.scss']
})

export class UsuarioNoEncontradoComponent implements OnInit{
  mensaje: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.mensaje = data.mensaje;
  }
  ngOnInit(): void {
      this.mostrarModal();
  }
  mostrarModal(): void {
    Swal.fire({
      html: `
      <h3 style="margin-bottom: 5px;">ERROR</h3>
      <p style="margin: 5px 0;">${this.mensaje}</p>
      `,
      icon: "warning",
      confirmButtonText: 'OK',
      confirmButtonColor: 'rgb(100, 21, 21)'
    });
  }
}