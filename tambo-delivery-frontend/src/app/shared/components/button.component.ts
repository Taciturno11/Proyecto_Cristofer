import { Component, Input, Output, EventEmitter } from '@angular/core';

export interface ButtonConfig {
  text: string;
  type?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
}

@Component({
  selector: 'app-button',
  template: `
    <button
      [class]="buttonClasses"
      [disabled]="isDisabled || isLoading"
      (click)="onClickHandler()"
    >
      @if (isLoading) {
        <span class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
      }
      @if (iconClass && !isLoading) {
        <span [class]="iconClass + ' mr-2'"></span>
      }
      {{ buttonText }}
    </button>
  `,
  standalone: true
})
export class ButtonComponent {
  // Soporte para configuración por objeto
  @Input() config?: ButtonConfig;
  
  // Soporte para propiedades individuales
  @Input() text?: string;
  @Input() type?: 'primary' | 'secondary' | 'danger' | 'success';
  @Input() size?: 'sm' | 'md' | 'lg';
  @Input() disabled?: boolean;
  @Input() loading?: boolean;
  @Input() icon?: string;
  
  @Output() buttonClick = new EventEmitter<void>();
  @Output() onClick = new EventEmitter<void>();

  get buttonText(): string {
    return this.config?.text || this.text || '';
  }

  get buttonType(): 'primary' | 'secondary' | 'danger' | 'success' {
    return this.config?.type || this.type || 'primary';
  }

  get buttonSize(): 'sm' | 'md' | 'lg' {
    return this.config?.size || this.size || 'md';
  }

  get isDisabled(): boolean {
    return this.config?.disabled || this.disabled || false;
  }

  get isLoading(): boolean {
    return this.config?.loading || this.loading || false;
  }

  get iconClass(): string | undefined {
    return this.config?.icon || this.icon;
  }

  get buttonClasses(): string {
    const baseClasses = 'cursor-pointer inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base'
    };

    const typeClasses = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
      success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500'
    };

    const disabledClasses = (this.isDisabled || this.isLoading) 
      ? 'opacity-50 cursor-not-allowed' 
      : '';

    return [
      baseClasses,
      sizeClasses[this.buttonSize],
      typeClasses[this.buttonType],
      disabledClasses
    ].join(' ');
  }

  onClickHandler(): void {
    if (!this.isDisabled && !this.isLoading) {
      this.buttonClick.emit();
      this.onClick.emit();
    }
  }
}
