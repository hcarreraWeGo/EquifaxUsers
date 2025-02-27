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
    private loginService: LoginService,
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
      this.loginService.baseService.idEmpresa=decode["idEmpresa"];
      sessionStorage.setItem('nombreEmpresa',decode["nombreEmpresa"]);
      console.log("seguimiento",this.loginService.baseService.id);
      // Captura el email de los datos decodificados
      const username = decode["username"];
    
      // Almacena el email en localStorage
      const objeto = { nombre: username };
      localStorage.setItem('usuario', JSON.stringify(objeto));
      this.router.navigate(["content/dashboard/home"]);
    }
  }

  showPassword() {
    this.show = !this.show;
  }
}
