import Arweave from 'arweave/web';
import { TransactionUploader } from 'arweave/web/lib/transaction-uploader';
import { CardSchema } from './cardSchema';

import { and, or, equals } from 'arql-ops';

// Since v1.5.1 you're now able to call the init function for the web version without options.
// The current path will be used by default, recommended.
const arweave = Arweave.init();
export class CardStore {
  cards: object = {};
  lastid = -1;

  _addCard(card: CardSchema) {
    this.cards[card.id] = card;
    return card;
  }

  async getCard(cardId: string) {
    const transaction = await arweave.transactions.getData(cardId, {decode: true, string: true});

    return JSON.parse(transaction.toString());
  }

  async newCard(description: string, state: string): Promise<CardSchema> {
    const card = new CardSchema();
    card.description = description;
    card.created = new Date();

    const key = await arweave.wallets.generate();

    const txData = JSON.stringify(card);

    const transactionA = await arweave.createTransaction({
      data: txData
    }, key);

    transactionA.addTag('app', 'arTrello');
    transactionA.addTag('state', state);

    await arweave.transactions.sign(transactionA, key, { saltLength: 1 });

    const uploader: TransactionUploader = await arweave.transactions.getUploader(transactionA);

    while (!uploader.isComplete) {
      await uploader.uploadChunk();
    }

    const transaction = await arweave.transactions.getData(transactionA.id, {decode: true, string: true});

    card.id = transaction.toString();

    return this._addCard(card);
  }

  async getCards(state: string): Promise<CardSchema[]> {
    const myQuery = and(
      equals('app', 'arTrello'),
      equals('state', state)
    );

    const results: string[] = await arweave.arql(myQuery);

    const result: CardSchema[] = [];

    for (const r of results) {
      const transaction = await arweave.transactions.getData(r, {decode: true, string: true});

      result.push(JSON.parse(transaction.toString()));

      result[result.length - 1].id = transaction.toString();
    }

    return result;
  }
}
