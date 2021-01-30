import { AfterViewInit, Component, OnInit } from '@angular/core';
import WeaveID from 'weaveid';
import { CardStore } from './cardStore';
import { faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'ar-trello';

  key: any;

  cardStore = new CardStore();

  github = faGithub;

  twitter = faTwitter;

  constructor(private notifier: NotifierService) {}

  async ngOnInit() {
    // Initialize WeaveID:
    WeaveID.init();
  }

  async login() {
    const address = await WeaveID.openLoginModal();

    this.cardStore.loginDone(address);

    this.notifier.getConfig().behaviour.autoHide = false;

    this.notifier.notify('warning', 'Every action you take (create, edit, delete or change state of tasks) will be recorded in a form of a transaction on the Arweave network. These transactions have a minimal fee.');
  }
}
