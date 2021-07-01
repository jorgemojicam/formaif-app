import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/app/shared/modal/modal.component';

@Component({
  selector: 'app-modal-infomap',
  templateUrl: './modal-infomap.component.html',
  styleUrls: ['./modal-infomap.component.scss']
})
export class ModalInfomapComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ModalInfomapComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    dialogRef.disableClose = true;
  }

  formMap: FormGroup = new FormGroup({
    titulo: new FormControl(null, Validators.required),
    descripcion: new FormControl(null, Validators.required),
    color: new FormControl('#2889e9'),
  })

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addMapdata() {
    let values = this.formMap.value
    this.dialogRef.close({
      data: values,
      type: 'create'
    })

  }

}
