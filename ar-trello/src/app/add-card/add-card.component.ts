import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.scss']
})
export class AddCardComponent implements OnInit {

  addTaskForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<AddCardComponent>,
              @Inject(MAT_DIALOG_DATA) public data: string) { }

  ngOnInit(): void {
    this.addTaskForm = this.formBuilder.group({
      title: [(this.data ? JSON.parse(this.data).title : ''), Validators.required],
      description: [(this.data ? JSON.parse(this.data).description : '')]
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
