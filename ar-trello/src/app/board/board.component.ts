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
      await this.getLists(address);
    });
  }

  async ngOnInit() {
    await this.setMockData();

    await this.getLists();
  }

  async getLists(address?: string) {
      let toDoCards = await this.store.getCards('To Do', address);

      if (toDoCards.length > 0) {
         const reduced = toDoCards.reduce((res, card) => {
                                if (!res[card.description]) {
                                  res[card.description] = card;
                                } else if (res[card.description].created < card.created) {
                                  res[card.description] = card;
                                }

                                return res;
                              }, {});

         toDoCards = Object.values(reduced);
      }

      let doingCards = await this.store.getCards('Doing', address);

      if (doingCards.length > 0) {
        const reduced = doingCards.reduce((res, card) => {
          if (!res[card.description]) {
            res[card.description] = card;
          } else if (res[card.description].created < card.created) {
            res[card.description] = card;
          }

          return res;
        }, {});

        doingCards = Object.values(reduced);
      }

      let doneCards = await this.store.getCards('Done', address);

      if (doneCards.length > 0) {
        const reduced = doneCards.reduce((res, card) => {
          if (!res[card.description]) {
            res[card.description] = card;
          } else if (res[card.description].created < card.created) {
            res[card.description] = card;
          }

          return res;
        }, {});

        doneCards = Object.values(reduced);
      }

      toDoCards.forEach(element => {
        const doingReplicants = doingCards.filter(c => c.description === element.description);
        if (doingReplicants.length > 0) {
          doingReplicants.forEach(doingElement => {
            if (new Date(doingElement.created) > new Date(element.created)) {
              toDoCards.splice(toDoCards.indexOf(element), 1);
            } else {
              doingCards.splice(doingCards.indexOf(doingElement), 1);
            }
          });
        }

        const doneReplicants = doneCards.filter(c => c.description === element.description);
        if (doneReplicants.length > 0) {
          doneReplicants.forEach(doneElement => {
            if (new Date(doneElement.created) > new Date(element.created)) {
              toDoCards.splice(toDoCards.indexOf(element), 1);
            } else {
              doneCards.splice(doneCards.indexOf(doneElement), 1);
            }
          });
        }
      });

      doneCards.forEach(element => {
        const doingReplicants = doingCards.filter(c => c.description === element.description);
        if (doingReplicants.length > 0) {
          doingReplicants.forEach(doingElement => {
            if (new Date(doingElement.created) > new Date(element.created)) {
              doneCards.splice(doneCards.indexOf(element), 1);
            } else {
              doingCards.splice(doingCards.indexOf(doingElement), 1);
            }
          });
        }
      });

      if (toDoCards.length > 0) {
        toDoCards = toDoCards.filter(c => c.active);
      }

      if (doingCards.length > 0) {
        doingCards = doingCards.filter(c => c.active);
      }

      if (doneCards.length > 0) {
        doneCards = doneCards.filter(c => c.active);
      }

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
  }

}
