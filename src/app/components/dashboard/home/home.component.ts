import { Component, OnInit } from '@angular/core';
import { NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import * as data from "../../../shared/data/router-animation/default"
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  
  constructor(calendar: NgbCalendar) {}
  public purchaseRate = data.purchaseRate
  async ngOnInit(): Promise<void> {}
}
