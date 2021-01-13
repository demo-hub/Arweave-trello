import { Component, Input, NgZone, OnInit } from '@angular/core';
import { CardStore } from '../cardStore';
import { ListSchema } from '../listSchema';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  @Input() store: CardStore;

  lists: ListSchema[];

  constructor(private ngZone: NgZone) { }

  async setMockData() {
    this.store.login$.subscribe(async address => {
      const toDoCards = await this.store.getCards('To Do', address);

      const doingCards = await this.store.getCards('Doing', address);

      const doneCards = await this.store.getCards('Done', address);

      this.ngZone.run(() => {
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
    });
  }

  async ngOnInit() {
    await this.setMockData();
  }

}
