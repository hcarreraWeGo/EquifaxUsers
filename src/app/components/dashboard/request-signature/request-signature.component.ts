import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request-signature',
  templateUrl: './request-signature.component.html',
  styleUrl: './request-signature.component.scss'
})
export class RequestSignatureComponent implements OnInit{

  show: boolean = false;
  showC: boolean = false;
  registerForm: FormGroup;
  formSubmitted: boolean = false;  // Nueva variable
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      nombre1: ['', Validators.required],
      nombre2: ['', Validators.required],
      apellido1: ['', Validators.required],
      apellido2: ['', Validators.required],
      cedula: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      celular: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      ciudad: ['', [Validators.required, Validators.pattern('^[a-zA-Z]*$')]],
      provincia: ['', [Validators.required, Validators.pattern('^[a-zA-Z]*$')]],
      direccion: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit() {
    this.formSubmitted = true;
    if (this.registerForm.valid) {
      //console.log(this.registerForm.value);
      this.register(this.registerForm);
    }
  }

  async register(form: FormGroup) {
    const data = {
      "nombres": `${form.get('nombre1')?.value} ${form.get('nombre2')?.value}`,
      "cedula": form.get('cedula')?.value,
      "apellido1": form.get('apellido1')?.value,
      "apellido2": form.get('apellido2')?.value,
      "direccion": form.get('direccion')?.value,
      "telefono": form.get('celular')?.value,
      "ciudad": form.get('ciudad')?.value,
      "provincia": form.get('provincia')?.value,
      "email": form.get('correo')?.value,
      "password": form.get('password')?.value,
    };

  }

  showPassword() {
    this.show = !this.show;
  }

  showPasswordC() {
    this.showC = !this.showC;
  }

}
