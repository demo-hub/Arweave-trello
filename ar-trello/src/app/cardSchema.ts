export class CardSchema {
  id: string;
  title: string;
  description: string;
  created: Date;
  active: boolean;
  priority: string;
  tags: string[];
}
