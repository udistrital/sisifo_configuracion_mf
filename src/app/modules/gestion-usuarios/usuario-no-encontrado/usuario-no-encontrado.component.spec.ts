import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioNoEncontradoComponent } from './usuario-no-encontrado.component';

describe('UsuarioNoEncontradoComponent', () => {
  let component: UsuarioNoEncontradoComponent;
  let fixture: ComponentFixture<UsuarioNoEncontradoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsuarioNoEncontradoComponent]
    });
    fixture = TestBed.createComponent(UsuarioNoEncontradoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
