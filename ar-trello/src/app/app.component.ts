import { Component, OnInit } from '@angular/core';

import Arweave from 'arweave/web';

// Since v1.5.1 you're now able to call the init function for the web version without options.
// The current path will be used by default, recommended.
const arweave = Arweave.init();

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'ar-trello';

  key: any;

  ngOnInit(): void {
    arweave.wallets.generate().then((key) => {
      this.key = key;
      console.log(key);

      arweave.wallets.jwkToAddress(this.key).then((address) => {
        console.log(address);

        arweave.wallets.getBalance(address).then((balance) => {
          const winston = balance;
          const ar = arweave.ar.winstonToAr(balance);

          console.log(winston);
          // 125213858712

          console.log(ar);
          // 0.125213858712
      });
      });
    });
  }
}
