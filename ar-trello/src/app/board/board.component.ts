import { Component, NgZone, OnInit } from '@angular/core';
import { CardStore } from '../CardStore';
import { ListSchema } from '../ListSchema';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  cardStore: CardStore;
  lists: ListSchema[];
  constructor(private _ngZone: NgZone) { }
  async setMockData() {
    this.cardStore = new CardStore();

    const toDoCards = await this.cardStore.getCards('To Do');

    const doingCards = await this.cardStore.getCards('Doing');

    const doneCards = await this.cardStore.getCards('Done');

    this._ngZone.run(() => {
      const lists: ListSchema[] = [
        {
          name: 'To Do',
          cards: toDoCards
        },
        {
          name: 'Doing',
          cards: doingCards
        },
        {
          name: 'Done',
          cards: doneCards
        }
      ];

      this.lists = lists;
  });
  }

  async ngOnInit() {
    await this.setMockData();
  }

}
