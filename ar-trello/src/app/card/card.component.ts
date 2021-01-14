import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CardSchema } from '../cardSchema';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { CardStore } from '../cardStore';
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {

  // icons
  times = faTimes;

  @Input() card: CardSchema;

  @Input() store: CardStore;

  @Output() cardRemoved = new EventEmitter<string>();

  constructor() {}

  ngOnInit() {}

  dragStart(ev) {
    ev.dataTransfer.setData('text', ev.target.id);
  }

  async deleteCard(id: string) {
    await this.store.deleteCard(id);

    this.cardRemoved.emit(id);
  }

}
