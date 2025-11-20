import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from './button.component';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    @if (isOpen) {
      <!-- Backdrop -->
      <div 
        class="fixed inset-0 bg-black/50 transition-opacity z-40"
        style="backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);"
        (click)="onBackdropClick()"
      ></div>

      <!-- Modal Container -->
      <div class="fixed inset-0 z-50 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <!-- Modal Panel -->
          <div 
            class="relative transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all w-full max-w-md"
            (click)="$event.stopPropagation()"
          >
            <!-- Icon -->
            <div class="p-6 pb-4">
              <div class="flex items-center justify-center w-12 h-12 mx-auto rounded-full"
                [ngClass]="{
                  'bg-red-100': type === 'danger',
                  'bg-yellow-100': type === 'warning',
                  'bg-blue-100': type === 'info'
                }"
              >
                @switch (type) {
                  @case ('danger') {
                    <svg class="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  }
                  @case ('warning') {
                    <svg class="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  }
                  @case ('info') {
                    <svg class="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                }
              </div>
            </div>

            <!-- Content -->
            <div class="px-6 pb-6 text-center">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">
                {{ title }}
              </h3>
              <p class="text-sm text-gray-600">
                {{ message }}
              </p>
            </div>

            <!-- Actions -->
            <div class="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <app-button
                [config]="{
                  text: cancelText,
                  type: 'secondary',
                  size: 'md'
                }"
                (buttonClick)="onCancel()"
              />
              <app-button
                [config]="{
                  text: confirmText,
                  type: type === 'danger' ? 'danger' : 'primary',
                  size: 'md'
                }"
                (buttonClick)="onConfirm()"
              />
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    :host {
      display: contents;
    }
  `]
})
export class ConfirmModalComponent {
  @Input() isOpen = false;
  @Input() type: 'danger' | 'warning' | 'info' = 'danger';
  @Input() title = '¿Estás seguro?';
  @Input() message = 'Esta acción no se puede deshacer.';
  @Input() confirmText = 'Confirmar';
  @Input() cancelText = 'Cancelar';
  @Input() closeOnBackdropClick = false;
  
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm(): void {
    this.confirm.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onBackdropClick(): void {
    if (this.closeOnBackdropClick) {
      this.onCancel();
    }
  }
}
