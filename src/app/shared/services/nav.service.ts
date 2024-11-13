import { SliderService } from './../components/sidebar/slidebar.service';
import { Injectable, OnDestroy } from "@angular/core";
import { Subject, BehaviorSubject, fromEvent } from "rxjs";
import { takeUntil, debounceTime } from "rxjs/operators";
import { Router } from "@angular/router";

// Menu
export interface Menu {
  headTitle1?: string;
  headTitle2?: string;
  path?: string;
  title?: string;
  icon?: string;
  type?: string;
  badgeType?: string;
  badgeValue?: string;
  active?: boolean;
  bookmark?: boolean;
  children?: Menu[];
}

@Injectable({
  providedIn: "root",
})
export class NavService implements OnDestroy {
  private unsubscriber: Subject<any> = new Subject();
  public screenWidth: BehaviorSubject<number> = new BehaviorSubject(window.innerWidth);

  // Search Box
  public search: boolean = false;

  // Language
  public language: boolean = false;

  // Mega Menu
  public megaMenu: boolean = false;
  public levelMenu: boolean = false;
  public megaMenuColapse: boolean = window.innerWidth < 1199 ? true : false;

  // Collapse Sidebar
  public collapseSidebar: boolean = window.innerWidth < 991 ? true : false;

  // For Horizontal Layout Mobile
  public horizontal: boolean = window.innerWidth < 991 ? false : true;

  // Full screen
  public fullScreen: boolean = false;

  // Menú inicial vacío, que se actualizará con los elementos permitidos
  MENUITEMS: Menu[] = [];
  // Array
  items = new BehaviorSubject<Menu[]>(this.MENUITEMS);

  constructor(private router: Router,
    private dashboardService: SliderService,

  ) {
    this.setScreenWidth(window.innerWidth);
    fromEvent(window, "resize")
      .pipe(debounceTime(1000), takeUntil(this.unsubscriber))
      .subscribe((evt: any) => {
        this.setScreenWidth(evt.target.innerWidth);
        if (evt.target.innerWidth < 991) {
          this.collapseSidebar = true;
          this.megaMenu = false;
          this.levelMenu = false;
        }
        if (evt.target.innerWidth < 1199) {
          this.megaMenuColapse = true;
        }
      });
    if (window.innerWidth < 991) {
      // Detect Route change sidebar close
      this.router.events.subscribe((event) => {
        this.collapseSidebar = true;
        this.megaMenu = false;
        this.levelMenu = false;
      });
    }
    this.loadMenuItems();
  }

  private setScreenWidth(width: number): void {
    this.screenWidth.next(width);
  }

  private async loadMenuItems(): Promise<void> {
    try {
      const response = await this.dashboardService.getUserRoute();
      const routeCodes = response.data;
      
      // Inicializar el menú con la opción principal de Home
      this.MENUITEMS = [
        { path: "dashboard/home", icon: "home", title: "Home", active: false, type: "link", bookmark: true },
      ];
  
      // Variables para almacenar reportes dinámicos
      const reportChildren = [];
  
      // Agregar "Solicitar Firma" si routeCodes incluye 1
      if (routeCodes.includes(1)) {
        this.MENUITEMS.push({ path: "dashboard/solicitar-firma", icon: "user", title: "Solicitar Firma", active: false, type: "link", bookmark: true });
        // Añadir a reportes
        reportChildren.push({ title: "Solicitar Firma", path: "dashboard/reporte-solicitar", type: "link" });
      }
  
      // Agregar "Verificar Identidad" si routeCodes incluye 2
      if (routeCodes.includes(2)) {
        this.MENUITEMS.push({ path: "dashboard/verificar-identidad", icon: "search", title: "Verificar Identidad", active: false, type: "link", bookmark: true });
        // Añadir a reportes
        reportChildren.push({ title: "Verificar Identidad", path: "dashboard/reporte-verificar", type: "link" });
      }
  
      // Agregar sección de Reportes si hay elementos en reportChildren
      if (reportChildren.length > 0) {
        this.MENUITEMS.push({
          title: "Reportes",
          icon: "file",
          type: "sub",
          badgeType: "light-primary",
          active: true,
          children: reportChildren
        });
      }
      
      this.items.next(this.MENUITEMS); // Actualiza los elementos de menú
    } catch (error) {
      // console.error("Error al cargar los elementos de menú:", error);
    }
  }
  



  ngOnDestroy() {
    // this.unsubscriber.next();
    this.unsubscriber.complete();
  }

}