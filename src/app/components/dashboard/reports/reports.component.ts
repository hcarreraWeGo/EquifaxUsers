import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent {

  public iframeUrl: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    // Asigna la URL que quieras mostrar en el iframe
    const url = 'https://enext.online/reporteria/public/index.php';
    this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
