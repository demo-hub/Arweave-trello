import { Component, OnInit } from '@angular/core';

import Arweave from 'arweave/web';
import { TransactionUploader } from 'arweave/web/lib/transaction-uploader';

import { UUID } from 'angular2-uuid';

import { and, or, equals } from 'arql-ops';
import Transaction from 'arweave/web/lib/transaction';

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

  async ngOnInit() {
  }
}
