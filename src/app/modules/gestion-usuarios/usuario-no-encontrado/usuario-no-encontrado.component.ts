import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario-no-encontrado',
  templateUrl: './usuario-no-encontrado.component.html',
  styleUrls: ['./usuario-no-encontrado.component.scss']
})

export class UsuarioNoEncontradoComponent implements OnInit{
  ngOnInit(): void {
      this.mostrarModal();
  }
  mostrarModal(): void {
    Swal.fire({
      html: `
      <h3 style="margin-bottom: 5px;">USUARIO NO ENCONTRADO</h3>
      <p style="margin: 5px 0;">NO SE ENCONTRARON DATOS DEL USUARIO</p>
      `,
      icon: "warning",
      confirmButtonText: 'OK',
      confirmButtonColor: 'rgb(100, 21, 21)'
    });
  }
}