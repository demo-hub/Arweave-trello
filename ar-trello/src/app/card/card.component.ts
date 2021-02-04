import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CardSchema } from '../cardSchema';
import { faEdit, faFlag, faTimes } from '@fortawesome/free-solid-svg-icons';
import { CardStore } from '../cardStore';
import { NotifierService } from 'angular-notifier';
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {

  // icons
  times = faTimes;

  edit = faEdit;

  flag = faFlag;

  @Input() card: CardSchema;

  @Input() store: CardStore;

  @Output() cardRemoved = new EventEmitter<string>();

  @Output() cardEdit = new EventEmitter<string>();

  constructor(private notifierService: NotifierService) {}

  ngOnInit() {}

  dragStart(ev) {
    ev.dataTransfer.setData('text', ev.target.id);
  }

  async deleteCard(id: string) {
    this.notifierService.notify('warning', 'A transaction is being made');

    id = await this.store.deleteCard(id);

    this.cardRemoved.emit(id);
  }

  async editCard(id: string) {
    this.cardEdit.emit(id);
  }

}
