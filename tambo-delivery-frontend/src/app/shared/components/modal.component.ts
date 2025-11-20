import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
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
        <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <!-- Modal Panel -->
          <div 
            class="relative transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all w-full"
            [ngClass]="{
              'max-w-sm': size === 'sm',
              'max-w-md': size === 'md',
              'max-w-lg': size === 'lg',
              'max-w-2xl': size === 'xl',
              'max-w-4xl': size === '2xl'
            }"
            (click)="$event.stopPropagation()"
          >
            <!-- Header -->
            @if (showHeader) {
              <div class="bg-gradient-to-r from-[#a81b8d] to-[#8b1573] px-6 py-4">
                <div class="flex items-center justify-between">
                  <h3 class="text-xl font-semibold text-white">
                    {{ title }}
                  </h3>
                  @if (showCloseButton) {
                    <button
                      type="button"
                      (click)="close()"
                      class="text-white hover:text-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#a81b8d] rounded-lg p-1"
                    >
                      <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  }
                </div>
                @if (subtitle) {
                  <p class="mt-1 text-sm text-pink-100">{{ subtitle }}</p>
                }
              </div>
            }

            <!-- Body -->
            <div class="px-6 py-5">
              <ng-content></ng-content>
            </div>

            <!-- Footer -->
            @if (showFooter) {
              <div class="bg-gray-50 px-6 py-4 flex flex-row-reverse gap-3 border-t border-gray-200">
                <ng-content select="[footer]"></ng-content>
              </div>
            }
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
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() subtitle = '';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' | '2xl' = 'md';
  @Input() showHeader = true;
  @Input() showFooter = true;
  @Input() showCloseButton = true;
  @Input() closeOnBackdropClick = true;
  
  @Output() closeModal = new EventEmitter<void>();

  close(): void {
    this.closeModal.emit();
  }

  onBackdropClick(): void {
    if (this.closeOnBackdropClick) {
      this.close();
    }
  }
}
