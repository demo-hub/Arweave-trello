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

      toDoCards.reduce((prev, current) => {
        return (prev.description === current.description) ?
        ((new Date(prev.created) > new Date(current.created)) ?
        toDoCards.splice(toDoCards.indexOf(current), 1)[0] : toDoCards.splice(toDoCards.indexOf(prev), 1)[0]) : current;
      });

      const doingCards = await this.store.getCards('Doing', address);

      doingCards.reduce((prev, current) => {
        return (prev.description === current.description) ?
        ((new Date(prev.created) > new Date(current.created)) ?
        doingCards.splice(doingCards.indexOf(current), 1)[0] : doingCards.splice(doingCards.indexOf(prev), 1)[0]) : current;
      });

      const doneCards = await this.store.getCards('Done', address);

      doneCards.reduce((prev, current) => {
        return (prev.description === current.description) ?
        ((new Date(prev.created) > new Date(current.created)) ?
        doneCards.splice(doneCards.indexOf(current), 1)[0] : doneCards.splice(doneCards.indexOf(prev), 1)[0]) : current;
      });

      toDoCards.forEach(element => {
        if (toDoCards.filter(c => c.description === element.description).length > 1) {

        }
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
