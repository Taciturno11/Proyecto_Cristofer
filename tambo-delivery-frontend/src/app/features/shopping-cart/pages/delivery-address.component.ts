import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/button.component';

interface SavedAddress {
  id: number;
  name: string;
  address: string;
  district: string;
  reference?: string;
  isDefault: boolean;
}

@Component({
  selector: 'app-delivery-address',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  template: `
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <!-- Breadcrumb -->
      <nav class="text-sm mb-6">
        <ol class="flex items-center space-x-2">
          <li><a (click)="goToCart()" class="text-[#a81b8d] hover:underline cursor-pointer">Carrito</a></li>
          <li class="text-gray-400">/</li>
          <li class="text-gray-600">Dirección de entrega</li>
          <li class="text-gray-400">/</li>
          <li class="text-gray-400">Método de pago</li>
          <li class="text-gray-400">/</li>
          <li class="text-gray-400">Confirmación</li>
        </ol>
      </nav>

      <h1 class="text-3xl font-bold text-gray-900 mb-8">¿Dónde quieres recibir tu pedido?</h1>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Columna izquierda: Opciones de dirección -->
        <div class="lg:col-span-2 space-y-6">
          
          <!-- Direcciones guardadas -->
          @if (savedAddresses.length > 0) {
            <div>
              <h2 class="text-xl font-semibold text-gray-900 mb-4">Mis direcciones guardadas</h2>
              
              @for (address of savedAddresses; track address.id) {
                <div 
                  class="border rounded-lg p-4 mb-3 cursor-pointer transition-all hover:shadow-md"
                  [class.border-[#a81b8d]]="selectedAddressId === address.id"
                  [class.bg-purple-50]="selectedAddressId === address.id"
                  [class.border-gray-200]="selectedAddressId !== address.id"
                  (click)="selectAddress(address.id)"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center space-x-2 mb-2">
                        <input 
                          type="radio" 
                          [checked]="selectedAddressId === address.id"
                          class="text-[#a81b8d] focus:ring-[#a81b8d]"
                          readonly
                        />
                        <h3 class="font-medium text-gray-900">{{ address.name }}</h3>
                        @if (address.isDefault) {
                          <span class="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Por defecto</span>
                        }
                      </div>
                      <p class="text-gray-600 mb-1">{{ address.address }}</p>
                      <p class="text-gray-600 mb-1">{{ address.district }}</p>
                      @if (address.reference) {
                        <p class="text-sm text-gray-500">Referencia: {{ address.reference }}</p>
                      }
                    </div>
                    <button 
                      (click)="editAddress(address.id); $event.stopPropagation()"
                      class="text-gray-400 hover:text-gray-600"
                    >
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              }
            </div>
          }
          
          <!-- Agregar nueva dirección -->
          <div>
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold text-gray-900">
                @if (savedAddresses.length > 0) {
                  Agregar nueva dirección
                } @else {
                  Información de entrega
                }
              </h2>
              @if (savedAddresses.length > 0) {
                <button 
                  (click)="toggleNewAddressForm()"
                  class="text-[#a81b8d] hover:text-[#8a1676] font-medium"
                >
                  @if (showNewAddressForm) {
                    Cancelar
                  } @else {
                    + Agregar nueva
                  }
                </button>
              }
            </div>
            
            @if (showNewAddressForm || savedAddresses.length === 0) {
              <form [formGroup]="addressForm" class="space-y-4">
                
                <!-- Nombre de la dirección -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de la dirección *
                  </label>
                  <input
                    type="text"
                    formControlName="name"
                    placeholder="Ej: Casa, Oficina, Casa de mamá"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a81b8d] focus:border-transparent"
                  />
                  @if (addressForm.get('name')?.touched && addressForm.get('name')?.errors?.['required']) {
                    <p class="mt-1 text-sm text-red-600">Este campo es requerido</p>
                  }
                </div>
                
                <!-- Dirección completa -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Dirección completa *
                  </label>
                  <input
                    type="text"
                    formControlName="address"
                    placeholder="Calle, número, urbanización"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a81b8d] focus:border-transparent"
                  />
                  @if (addressForm.get('address')?.touched && addressForm.get('address')?.errors?.['required']) {
                    <p class="mt-1 text-sm text-red-600">Este campo es requerido</p>
                  }
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Distrito -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Distrito *
                    </label>
                    <select 
                      formControlName="district"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a81b8d] focus:border-transparent"
                    >
                      <option value="">Seleccionar distrito</option>
                      @for (district of districts; track district) {
                        <option [value]="district">{{ district }}</option>
                      }
                    </select>
                    @if (addressForm.get('district')?.touched && addressForm.get('district')?.errors?.['required']) {
                      <p class="mt-1 text-sm text-red-600">Este campo es requerido</p>
                    }
                  </div>
                  
                  <!-- Teléfono -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      formControlName="phone"
                      placeholder="999 999 999"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a81b8d] focus:border-transparent"
                    />
                    @if (addressForm.get('phone')?.touched && addressForm.get('phone')?.errors?.['required']) {
                      <p class="mt-1 text-sm text-red-600">Este campo es requerido</p>
                    }
                  </div>
                </div>
                
                <!-- Referencia -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Referencia (opcional)
                  </label>
                  <textarea
                    formControlName="reference"
                    rows="3"
                    placeholder="Ej: Casa blanca con reja negra, al frente del parque"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a81b8d] focus:border-transparent"
                  ></textarea>
                </div>
                
                <!-- Establecer como predeterminada -->
                <div class="flex items-center">
                  <input
                    id="isDefault"
                    type="checkbox"
                    formControlName="isDefault"
                    class="rounded border-gray-300 text-[#a81b8d] focus:ring-[#a81b8d]"
                  />
                  <label for="isDefault" class="ml-2 text-sm text-gray-700">
                    Establecer como dirección predeterminada
                  </label>
                </div>
              </form>
            }
          </div>
        </div>
        
        <!-- Columna derecha: Resumen del pedido -->
        <div class="lg:col-span-1">
          <div class="bg-gray-50 rounded-lg p-6 sticky top-32">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Resumen del pedido</h3>
            
            <div class="space-y-3 mb-4">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Subtotal</span>
                <span class="font-medium">S/ 42.90</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Costo de envío</span>
                <span class="font-medium text-green-600">Gratis</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">IGV (18%)</span>
                <span class="font-medium">S/ 7.72</span>
              </div>
            </div>
            
            <div class="border-t pt-4 mb-6">
              <div class="flex justify-between items-center">
                <span class="text-lg font-semibold text-gray-900">Total</span>
                <span class="text-2xl font-bold text-[#a81b8d]">S/ 50.62</span>
              </div>
            </div>
            
            <!-- Tiempo de entrega estimado -->
            <div class="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <div class="flex items-center space-x-2">
                <svg class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <div>
                  <p class="text-sm font-medium text-green-800">Entrega estimada</p>
                  <p class="text-xs text-green-700">30-45 minutos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Botones de navegación -->
      <div class="mt-8 flex justify-between">
        <app-button
          [config]="{
            text: 'Volver al carrito',
            type: 'secondary',
            size: 'md'
          }"
          (buttonClick)="goToCart()"
        />
        
        <app-button
          [config]="{
            text: 'Continuar al pago',
            type: 'primary',
            size: 'md'
          }"
          (buttonClick)="proceedToPayment()"
        />
      </div>
    </div>
  `
})
export class DeliveryAddressComponent {
  savedAddresses: SavedAddress[] = [
    {
      id: 1,
      name: 'Casa',
      address: 'Av. Javier Prado 1234',
      district: 'San Isidro',
      reference: 'Casa blanca con reja negra, al costado del banco',
      isDefault: true
    },
    {
      id: 2,
      name: 'Oficina',
      address: 'Jr. Lampa 456, Oficina 302',
      district: 'Cercado de Lima',
      reference: 'Edificio azul, tercer piso',
      isDefault: false
    }
  ];

  districts = [
    'San Isidro', 'Miraflores', 'San Borja', 'Surco', 'La Molina',
    'Cercado de Lima', 'Jesús María', 'Magdalena', 'Pueblo Libre',
    'San Miguel', 'Lince', 'Breña', 'Los Olivos', 'Independencia'
  ];

  selectedAddressId: number | null = this.savedAddresses.find(addr => addr.isDefault)?.id || null;
  showNewAddressForm = false;
  addressForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.addressForm = this.fb.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      district: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      reference: [''],
      isDefault: [false]
    });
  }

  selectAddress(addressId: number): void {
    this.selectedAddressId = addressId;
    this.showNewAddressForm = false;
  }

  toggleNewAddressForm(): void {
    this.showNewAddressForm = !this.showNewAddressForm;
    if (!this.showNewAddressForm) {
      this.addressForm.reset();
    } else {
      this.selectedAddressId = null;
    }
  }

  editAddress(addressId: number): void {
    // TODO: Implementar edición de dirección
    console.log('Editar dirección:', addressId);
  }

  canContinue(): boolean {
    if (this.selectedAddressId) {
      return true;
    }
    
    if (this.showNewAddressForm && this.addressForm.valid) {
      return true;
    }
    
    return false;
  }

  goToCart(): void {
    window.location.href = '/cart';
  }

  proceedToPayment(): void {
    let selectedAddress: any = null;

    if (this.showNewAddressForm && this.addressForm.valid) {
      // Crear nueva dirección temporal
      selectedAddress = {
        name: this.addressForm.value.name,
        address: this.addressForm.value.address,
        district: this.addressForm.value.district,
        phone: this.addressForm.value.phone,
        reference: this.addressForm.value.reference || ''
      };
    } else if (this.selectedAddressId) {
      // Usar dirección guardada seleccionada
      const saved = this.savedAddresses.find(a => a.id === this.selectedAddressId);
      if (saved) {
        selectedAddress = {
          name: saved.name,
          address: saved.address,
          district: saved.district,
          reference: saved.reference || ''
        };
      }
    }

    // Guardar en localStorage para usar en payment-method
    if (selectedAddress) {
      localStorage.setItem('deliveryAddress', JSON.stringify(selectedAddress));
      console.log('✅ Dirección guardada:', selectedAddress);
    }
    
    // Navegar a método de pago
    window.location.href = '/cart/pago';
  }
}