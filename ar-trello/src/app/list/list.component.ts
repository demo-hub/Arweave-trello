import { ChangeDetectorRef, Component, HostListener, Input, NgZone, OnInit } from '@angular/core';
import { ListSchema } from '../listSchema';
import { CardStore } from '../cardStore';
import { MatDialog } from '@angular/material/dialog';
import { AddCardComponent } from '../add-card/add-card.component';
import { NotifierService } from 'angular-notifier';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {

  @Input() list: ListSchema;

  @Input() cardStore: CardStore;

  displayAddCard = false;

  constructor(private dialog: MatDialog, private notifier: NotifierService) {}

  toggleDisplayAddCard() {
    this.displayAddCard = !this.displayAddCard;
  }

  ngOnInit(): void {}

  allowDrop($event) {
    $event.preventDefault();
  }

  async drop($event) {
    $event.preventDefault();
    const data = $event.dataTransfer.getData('text');
    let target = $event.target;
    const targetClassName = target.className;
    while (target.className !== 'list') {
      target = target.parentNode;
    }
    target = target.querySelector('.cards');
    if (targetClassName === 'card') {
      $event.target.parentNode.insertBefore(
        document.getElementById(data),
        $event.target
      );
    } else if (targetClassName === 'list__title') {
      if (target.children.length) {
        target.insertBefore(document.getElementById(data), target.children[0]);
      } else {
        target.appendChild(document.getElementById(data));
      }
    } else {
      target.appendChild(document.getElementById(data));
    }

    this.notifier.notify('warning', 'A transaction is being made');

    const result = await this.cardStore.changeState(data, target.className.split(' ')[1]);

    console.log(result);

    this.notifier.notify('success', 'The transaction has completed');
  }

  /* async onEnter(value: string, state: string) {
    const cardId = await this.cardStore.newCard(value, state);
    this.ngZone.run(() => {
      this.list.cards.push(cardId);
    });
  } */

  cardDeleted(id: string) {
    this.list.cards.splice(this.list.cards.indexOf(this.list.cards.filter(c => c.id === id)[0]), 1);

    this.notifier.notify('success', 'The transaction has completed');
  }


  async openAddCard() {

    const dialogRef = this.dialog.open(AddCardComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(async result => {
      this.notifier.notify('warning', 'A transaction is being made');
      const cardId = await this.cardStore.newCard(result.title,
        result.description,
        result.priority,
        result.tags,
        result.subtasks,
        this.list.name);
      this.list.cards.push(cardId);
      this.notifier.notify('success', 'The transaction has completed');
    });
  }

  openCardEdit(id: string) {
    const dialogRef = this.dialog.open(AddCardComponent, {
      width: '400px',
      data: id
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        this.notifier.notify('warning', 'A transaction is being made');
        await this.cardStore.deleteCard(id);
        const cardId = await this.cardStore.newCard(result.title,
          result.description,
          result.priority,
          result.tags,
          result.subtasks,
          this.list.name);
        const index = this.list.cards.indexOf(this.list.cards.filter(c => c.id === id)[0]);
        this.list.cards[index] = cardId;
        this.notifier.notify('success', 'The transaction has completed');
      }
    });
  }
}
