import { Component, OnInit } from '@angular/core';
import { ModificationService } from '../modification.service';

@Component({
  selector: 'app-modification',
  templateUrl: './modification.component.html',
  styleUrls: ['./modification.component.css']
})
export class ModificationComponent implements OnInit {

  constructor(private modificationService: ModificationService) { }

  ngOnInit() {
  }

}
