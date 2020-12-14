import { AfterViewInit, Component, OnInit } from '@angular/core';
import WeaveID from 'weaveid';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'ar-trello';

  key: any;

  async ngOnInit() {
    // Initialize WeaveID:
    WeaveID.init();
  }

  async login() {
    let address = await WeaveID.openLoginModal();
  }
}
