import { LoginService } from './login.service';
import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import {jwtDecode} from "jwt-decode";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  public newUser = false;
  // public user: firebase.User;
  public loginForm: FormGroup;
  public show: boolean = false;
  public errorMessage: any;
 

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private loginService: LoginService 
  ) {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", Validators.required],
    });
  }

  ngOnInit() {}

  async login() {
    const playload = { ...this.loginForm.value };
    const resp = await this.loginService.login(playload);
    if (resp.token) {
      this.loginService.baseService.setItem("user", JSON.stringify(resp));
     const decode= jwtDecode(resp.token);
      this.loginService.baseService.setItem("data", JSON.stringify(decode));
      this.loginService.baseService.id=decode["id"];
      
      // Captura el email de los datos decodificados
      const email = decode["email"];
    
      // Almacena el email en localStorage
      const objeto = { nombre: email };
      localStorage.setItem('usuario', JSON.stringify(objeto));
      this.router.navigate(["dashboard/home"]);
    }
  }

  showPassword() {
    this.show = !this.show;
  }
}
