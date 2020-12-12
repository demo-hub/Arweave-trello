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

    const toDoCards = await this.cardStore.getToDoCards();
    this._ngZone.run(() => {
      const lists: ListSchema[] = [
        {
          name: 'To Do',
          cards: toDoCards
        },
        {
          name: 'Doing',
          cards: []
        },
        {
          name: 'Done',
          cards: []
        }
      ];

      this.lists = lists;
  });
  }

  async ngOnInit() {
    await this.setMockData();
  }

}
