import { AfterViewInit, Component, OnInit } from '@angular/core';
import WeaveID from 'weaveid';
import { CardStore } from './cardStore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'ar-trello';

  key: any;

  cardStore = new CardStore();

  async ngOnInit() {
    // Initialize WeaveID:
    WeaveID.init();
  }

  async login() {
    const address = await WeaveID.openLoginModal();

    this.cardStore.loginDone(address);
  }
}
