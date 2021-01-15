import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-add-card',
  templateUrl: './add-card.component.html',
  styleUrls: ['./add-card.component.scss']
})
export class AddCardComponent implements OnInit {

  addTaskForm: FormGroup;

  constructor(private formBuilder: FormBuilder, public dialogRef: MatDialogRef<AddCardComponent>) { }

  ngOnInit(): void {
    this.addTaskForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['']
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
