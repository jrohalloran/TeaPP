import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true, // This makes it a standalone component
  imports: [CommonModule], // <-- This is the key part
  templateUrl: './modal.html',
  styleUrls: ['./modal.css']
})
export class ModalComponent {
  @Input() show = false;
  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  confirm() {
    console.log('Confirm clicked');
    this.onConfirm.emit();
  }

  cancel() {
    console.log('Cancel clicked');
    this.onCancel.emit();
  }
}

