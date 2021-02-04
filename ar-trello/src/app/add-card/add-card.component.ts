import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.scss']
})
export class AddCardComponent implements OnInit {

  addTaskForm: FormGroup;

  showDeleteTag = false;

  constructor(private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<AddCardComponent>,
              @Inject(MAT_DIALOG_DATA) public data: string) { }

  ngOnInit(): void {
    this.addTaskForm = this.formBuilder.group({
      title: [(this.data ? JSON.parse(this.data).title : ''), Validators.required],
      description: [(this.data ? JSON.parse(this.data).description : '')],
      priority: [(this.data ? JSON.parse(this.data).priority : '')],
      tags: [(this.data ? JSON.parse(this.data).tags : [])],
      tag: ['']
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addTag() {
    if (this.addTaskForm.controls.tag.value) {
      this.addTaskForm.controls.tags.value.push(this.addTaskForm.controls.tag.value);
      this.addTaskForm.patchValue({
        tag: ''
      });
    }
  }

  deleteTag(value: string) {
    const index = this.addTaskForm.controls.tags.value.indexOf(value);
    this.addTaskForm.controls.tags.value.splice(index, 1);
    this.showDeleteTag = !this.showDeleteTag;
  }

}
