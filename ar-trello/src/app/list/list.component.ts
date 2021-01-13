import { Component, HostListener, Input, NgZone, OnInit } from '@angular/core';
import { ListSchema } from '../listSchema';
import { CardStore } from '../cardStore';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  @Input() list: ListSchema;
  @Input() cardStore: CardStore;
  displayAddCard = false;
  constructor(private ngZone: NgZone) {}
  toggleDisplayAddCard() {
    this.displayAddCard = !this.displayAddCard;
  }
  ngOnInit(): void {}
  allowDrop($event) {
    $event.preventDefault();
  }
  async drop($event) {
    $event.preventDefault();
    const data = $event.dataTransfer.getData("text");
    let target = $event.target;
    const targetClassName = target.className;
    while (target.className !== "list") {
      target = target.parentNode;
    }
    target = target.querySelector(".cards");
    if (targetClassName === "card") {
      $event.target.parentNode.insertBefore(
        document.getElementById(data),
        $event.target
      );
    } else if (targetClassName === "list__title") {
      if (target.children.length) {
        target.insertBefore(document.getElementById(data), target.children[0]);
      } else {
        target.appendChild(document.getElementById(data));
      }
    } else {
      target.appendChild(document.getElementById(data));
    }

    console.log(data)

    await this.cardStore.changeState(data, target.className.split(' ')[1]);
  }
  async onEnter(value: string, state: string) {
    const cardId = await this.cardStore.newCard(value, state);
    this.ngZone.run(() => {
      this.list.cards.push(cardId);
  });
  }
}
