import { Component, ElementRef, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileComponent),
      multi: true
    }
  ]
})
export class FileComponent implements OnInit, ControlValueAccessor {

  @Input() label: any
  @ViewChild('UploadFileInput') uploadFileInput: ElementRef;
  filename = 'Seleccione Archivo';
  value = '';
  disabled = false;

  onChange: any = () => { };
  onTouched: any = () => { };

  constructor() { }

  writeValue(value: any): void {
    this.value = value;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  ngOnInit(): void {
  }

  fileChangeEvent(fileInput: any) {

    if (fileInput.target.files && fileInput.target.files[0]) {
      this.filename = '';
      Array.from(fileInput.target.files).forEach((file: File) => {
        this.filename += file.name;
      });
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = rs => {
          this.value = e.target.result;
          this.onChange(this.value);
        };
      };
      reader.readAsDataURL(fileInput.target.files[0]);
      this.uploadFileInput.nativeElement.value = "";
    } else {
      this.filename = 'Seleccione Archivo';
    }
  }

}
