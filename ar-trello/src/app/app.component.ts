import { Component, OnInit } from '@angular/core';

import Arweave from 'arweave/web';
import { TransactionUploader } from 'arweave/web/lib/transaction-uploader';

import { UUID } from 'angular2-uuid';

import { and, or, equals } from 'arql-ops';

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
    this.key = await arweave.wallets.generate();

    console.log(this.key);

    const address = await arweave.wallets.jwkToAddress(this.key);

    console.log(address);

    /* const winston = await arweave.wallets.getBalance(address);

    const ar = arweave.ar.winstonToAr(winston);

    console.log(winston);

    console.log(ar); */

    const transactionA = await arweave.createTransaction({
      data: UUID.UUID()
    }, this.key);

    transactionA.addTag('app', 'arTrello');

    await arweave.transactions.sign(transactionA, this.key, { saltLength: 1 });

    console.log(transactionA);

    const uploader: TransactionUploader = await arweave.transactions.getUploader(transactionA);

    while (!uploader.isComplete) {
      await uploader.uploadChunk();
      console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
    }

    // Get the data decode as string data
    const data = await arweave.transactions.getData(transactionA.id, {decode: true, string: true});

    console.log(data);

    const myQuery = and(
      equals('app', 'arTrello')
    );

    const results = await arweave.arql(myQuery);

    console.log(results);
  }
}
