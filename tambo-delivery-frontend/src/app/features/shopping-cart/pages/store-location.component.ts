import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/button.component';

// Declarar Leaflet
declare const L: any;

interface TamboStore {
  id: number;
  name: string;
  address: string;
  lat: number;
  lng: number;
  distance?: number;
  phone: string;
  hours: string;
  estimatedTime?: number; // Tiempo estimado en minutos
}

@Component({
  selector: 'app-store-location',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  styles: [`
    #map {
      cursor: crosshair;
    }
    #map:hover {
      cursor: pointer;
    }
  `],
  template: `
    <div class="container mx-auto px-4 py-8 max-w-7xl">
      <!-- Breadcrumb -->
      <nav class="text-sm mb-6">
        <ol class="flex items-center space-x-2">
          <li><a (click)="goToCart()" class="text-[#a81b8d] hover:underline cursor-pointer">Carrito</a></li>
          <li class="text-gray-400">/</li>
          <li class="text-gray-600 font-medium">Ubicación de entrega</li>
          <li class="text-gray-400">/</li>
          <li class="text-gray-400">Método de pago</li>
        </ol>
      </nav>

      <h1 class="text-3xl font-bold text-gray-900 mb-2">Encuentra tu Tambo más cercano</h1>
      <p class="text-gray-600 mb-8">Te entregaremos desde la tienda más cerca de ti en solo 30 minutos</p>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Mapa -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <!-- Mapa con Leaflet + OpenStreetMap (100% GRATIS) -->
            <div #mapContainer id="map" class="w-full h-[500px]"></div>
            
            <!-- Información de ubicación actual -->
            @if (currentLocation) {
              <div class="p-4 bg-gray-50 border-t">
                  <div class="flex items-start space-x-3">
                  <svg class="h-5 w-5 text-[#a81b8d] mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/>
                  </svg>
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-900">Tu ubicación de entrega</p>
                    <p class="text-sm text-gray-600">{{ currentAddress }}</p>
                    
                    <div class="mt-2 flex items-center space-x-2">
                      <svg class="h-4 w-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path>
                      </svg>
                      <p class="text-xs text-blue-600 font-medium">💡 Haz clic en el mapa para cambiar tu ubicación</p>
                    </div>
                    
                    @if (changingLocation) {
                      <div class="mt-2 flex items-center space-x-2 text-xs text-gray-500">
                        <svg class="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Buscando tiendas cercanas...</span>
                      </div>
                    }
                  </div>
                </div>
              </div>
            } @else {
              <div class="p-4 bg-blue-50 border-t border-blue-200">
                <div class="flex items-center space-x-2">
                  <svg class="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p class="text-sm text-blue-800">Obteniendo tu ubicación...</p>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Lista de tiendas cercanas -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Tiendas Tambo cercanas
              @if (nearbyStores.length > 0) {
                <span class="text-sm font-normal text-gray-600">({{ nearbyStores.length }})</span>
              }
            </h3>

            @if (loadingStores) {
              <div class="text-center py-8">
                <svg class="animate-spin h-8 w-8 text-[#a81b8d] mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p class="text-sm text-gray-600">Buscando tiendas...</p>
              </div>
            } @else if (nearbyStores.length === 0) {
              <div class="text-center py-8">
                <svg class="h-12 w-12 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <p class="text-sm text-gray-600">No se encontraron tiendas cercanas</p>
              </div>
            } @else {
              <div class="space-y-3 max-h-[400px] overflow-y-auto">
                @for (store of nearbyStores; track store.id) {
                  <div 
                    class="border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md"
                    [class.border-[#a81b8d]]="selectedStore?.id === store.id"
                    [class.bg-purple-50]="selectedStore?.id === store.id"
                    [class.border-gray-200]="selectedStore?.id !== store.id"
                    (click)="selectStore(store)"
                  >
                    <div class="flex items-start justify-between mb-2">
                      <div class="flex-1">
                        <h4 class="font-medium text-gray-900">{{ store.name }}</h4>
                        @if (store.distance) {
                          <p class="text-xs text-[#a81b8d] font-medium">
                            📍 {{ store.distance.toFixed(2) }} km - ⏱️ {{ store.estimatedTime }} min
                          </p>
                        }
                      </div>
                      <input 
                        type="radio" 
                        [checked]="selectedStore?.id === store.id"
                        class="mt-1 text-[#a81b8d] focus:ring-[#a81b8d]"
                        readonly
                      />
                    </div>
                    <p class="text-sm text-gray-600 mb-1">{{ store.address }}</p>
                    <p class="text-xs text-gray-500">{{ store.hours }}</p>
                    <p class="text-xs text-gray-500">📞 {{ store.phone }}</p>
                  </div>
                }
              </div>
            }

            <!-- Botón continuar -->
            @if (selectedStore) {
              <div class="mt-6 pt-6 border-t">
                <div class="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <p class="text-xs text-green-800">
                      ✅ Tienda seleccionada: <span class="font-medium">{{ selectedStore.name }}</span>
                    </p>
                    <p class="text-xs text-green-700 mt-1">
                      ⏱️ Tiempo estimado de entrega: {{ selectedStore.estimatedTime || 30 }} min
                    </p>
                    <p class="text-xs text-green-600 mt-1">
                      📍 Distancia: {{ selectedStore.distance?.toFixed(2) }} km
                    </p>
                </div>

                <app-button
                  [config]="{
                    text: 'Continuar al pago',
                    type: 'primary',
                    size: 'lg'
                  }"
                  (buttonClick)="proceedToPayment()"
                  class="w-full"
                />
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Botón volver -->
      <div class="mt-8">
        <app-button
          [config]="{
            text: 'Volver al carrito',
            type: 'secondary',
            size: 'md'
          }"
          (buttonClick)="goToCart()"
        />
      </div>
    </div>
  `
})
export class StoreLocationComponent implements OnInit, AfterViewInit {
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  
  map: any;
  currentLocation: { lat: number; lng: number } | null = null;
  currentAddress = '';
  selectedStore: TamboStore | null = null;
  nearbyStores: TamboStore[] = [];
  loadingStores = false;
  routeLine: any = null; // Línea de ruta en el mapa
  userMarker: any = null; // Marcador de usuario
  changingLocation = false; // Indicador de cambio de ubicación
  storeMarkers: any[] = []; // Almacenar marcadores de tiendas
  
  // Cache de tiendas obtenidas de OpenStreetMap
  private tamboStoresData: TamboStore[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Cargar Leaflet CSS y JS
    this.loadLeafletResources();
  }

  ngAfterViewInit(): void {
    // El mapa se inicializará después de cargar Leaflet
  }

  private loadLeafletResources(): void {
    // Verificar si Leaflet ya está cargado
    if (typeof L !== 'undefined') {
      this.initMap();
      return;
    }

    // Cargar CSS de Leaflet
    const linkCSS = document.createElement('link');
    linkCSS.rel = 'stylesheet';
    linkCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(linkCSS);

    // Cargar JS de Leaflet
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => this.initMap();
    document.head.appendChild(script);
  }

  private initMap(): void {
    // Obtener ubicación del usuario
    if (navigator.geolocation) {
      this.loadingStores = true;
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.createMap();
          this.findNearbyStores();
          this.reverseGeocode();
        },
        (error) => {
          console.error('Error getting location:', error);
          // Usar ubicación por defecto (Lima Centro)
          this.currentLocation = { lat: -12.0464, lng: -77.0428 };
          this.createMap();
          this.findNearbyStores();
        }
      );
    } else {
      // Geolocation no soportada, usar ubicación por defecto
      this.currentLocation = { lat: -12.0464, lng: -77.0428 };
      this.createMap();
      this.findNearbyStores();
    }
  }

  private createMap(): void {
    if (!this.currentLocation) return;

    // Crear mapa con Leaflet + OpenStreetMap (100% GRATIS)
    this.map = L.map(this.mapContainer.nativeElement).setView(
      [this.currentLocation.lat, this.currentLocation.lng],
      14
    );

    // Agregar capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(this.map);

    // Crear icono personalizado para ubicación actual
    const userIcon = L.divIcon({
      className: 'custom-user-marker',
      html: `<div style="
        background-color: #4285F4;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      "></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    // Agregar marcador de ubicación actual y guardarlo
    this.userMarker = L.marker([this.currentLocation.lat, this.currentLocation.lng], { icon: userIcon })
      .addTo(this.map)
      .bindPopup('Tu ubicación')
      .openPopup();

    // Agregar listener de clic en el mapa para cambiar ubicación
    this.map.on('click', (e: any) => {
      this.onMapClick(e.latlng);
    });
  }

  private findNearbyStores(): void {
    if (!this.currentLocation) return;

    this.loadingStores = true;

    // Búsqueda optimizada en Overpass API con timeout muy corto
    const radius = 1000; // 1km para búsqueda más rápida
    const overpassQuery = `[out:json][timeout:3];
(
  node["name"~"Tambo",i](around:${radius},${this.currentLocation.lat},${this.currentLocation.lng});
  way["name"~"Tambo",i](around:${radius},${this.currentLocation.lat},${this.currentLocation.lng});
);
out center 5;`;

    // Timeout de 3 segundos para la búsqueda
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: overpassQuery,
      signal: controller.signal
    })
    .then(response => {
      clearTimeout(timeoutId);
      return response.json();
    })
    .then(data => {
      if (data.elements && data.elements.length > 0) {
        // Procesar tiendas encontradas y filtrar solo Tambo (no Limatambo ni Cajatambo)
        const filteredElements = data.elements
          .filter((element: any) => {
            const name = element.tags?.name || '';
            const lat = element.lat || element.center?.lat;
            // Filtrar: debe tener coordenadas y NO contener "Limatambo" ni "Cajatambo"
            return (lat && !name.toLowerCase().includes('limatambo') && !name.toLowerCase().includes('cajatambo'));
          })
          .slice(0, 5); // Reducido a 5 elementos para más velocidad

        // Obtener direcciones reales solo para las 5 más cercanas (optimización)
        const storesWithDistance = filteredElements.map((element: any, index: number) => {
          const lat = element.lat || element.center?.lat;
          const lon = element.lon || element.center?.lon;
          const distance = this.calculateDistance(
            this.currentLocation!.lat,
            this.currentLocation!.lng,
            lat,
            lon
          );
          
          return {
            element,
            index,
            lat,
            lon,
            distance
          };
        })
        .sort((a: any, b: any) => a.distance - b.distance)
        .slice(0, 5); // Solo las 5 más cercanas

        // Obtener direcciones en paralelo con Promise.all pero con límite
        const storePromises = storesWithDistance.map(async ({ element, index, lat, lon }: any) => {
          // Obtener dirección real mediante geocodificación inversa
          let address = 'Lima, Perú';
          try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`, {
              signal: AbortSignal.timeout(2000) // Timeout de 2 segundos por geocodificación
            });
            const addressData = await response.json();
            if (addressData.address) {
              const parts = [];
              if (addressData.address.road) parts.push(addressData.address.road);
              if (addressData.address.house_number) parts.push(addressData.address.house_number);
              if (addressData.address.suburb) parts.push(addressData.address.suburb);
              if (addressData.address.city_district) parts.push(addressData.address.city_district);
              address = parts.length > 0 ? parts.join(', ') : addressData.display_name;
            }
          } catch (error) {
            // Si falla o toma mucho tiempo, usar dirección genérica
            console.warn('Error obteniendo dirección:', error);
          }

          return {
            id: element.id || index,
            name: element.tags?.name || 'Tambo+',
            address: address,
            lat: lat,
            lng: lon,
            phone: element.tags?.phone || element.tags?.['contact:phone'] || 'No disponible',
            hours: element.tags?.opening_hours || '24 horas'
          };
        });

        // Esperar a que todas las direcciones se obtengan
        Promise.all(storePromises).then(stores => {
          this.tamboStoresData = stores;
          
          // Si no hay datos de OSM, usar fallback
          if (!this.tamboStoresData || this.tamboStoresData.length === 0) {
            this.tamboStoresData = this.getFallbackStores();
          }

          this.processNearbyStores();
        });
      } else {
        // Si no hay datos de OSM, usar fallback
        this.tamboStoresData = this.getFallbackStores();
        this.processNearbyStores();
      }
    })
    .catch(error => {
      clearTimeout(timeoutId);
      console.warn('Búsqueda OSM fallida, usando datos locales:', error.message);
      // Usar tiendas locales en caso de error o timeout
      this.tamboStoresData = this.getFallbackStores();
      this.processNearbyStores();
    });
  }

  private processNearbyStores(): void {
    if (!this.currentLocation) return;

    // Calcular distancia, tiempo estimado y filtrar por rango
    this.nearbyStores = this.tamboStoresData
      .map(store => {
        const distance = this.calculateDistance(
          this.currentLocation!.lat,
          this.currentLocation!.lng,
          store.lat,
          store.lng
        );
        const estimatedTime = Math.ceil((distance / 3) * 60) + 10;
        return {
          ...store,
          distance,
          estimatedTime
        };
      })
      .filter(store => (store.distance || 0) <= 3) // Solo tiendas a máx 3km
      .sort((a, b) => (a.distance || 0) - (b.distance || 0))
      .slice(0, 5); // Top 5 más cercanas

    this.loadingStores = false;

    if (this.nearbyStores.length > 0) {
      this.selectStore(this.nearbyStores[0]);
    }

    this.addStoreMarkers();
  }

  private formatAddress(tags: any): string {
    if (!tags) return 'Dirección no disponible';
    
    const parts = [];
    
    // Intentar construir dirección de diferentes formas
    if (tags['addr:street']) {
      let street = tags['addr:street'];
      if (tags['addr:housenumber']) {
        street += ' ' + tags['addr:housenumber'];
      }
      parts.push(street);
    }
    
    if (tags['addr:district']) parts.push(tags['addr:district']);
    if (tags['addr:suburb']) parts.push(tags['addr:suburb']);
    if (tags['addr:city']) parts.push(tags['addr:city']);
    
    // Si no hay dirección estructurada, usar el campo 'address' si existe
    if (parts.length === 0 && tags['address']) {
      return tags['address'];
    }
    
    // Si tampoco hay 'address', intentar con otros campos comunes
    if (parts.length === 0) {
      if (tags['place']) parts.push(tags['place']);
      if (tags['location']) parts.push(tags['location']);
    }
    
    return parts.length > 0 ? parts.join(', ') : 'Lima, Perú';
  }

  private getFallbackStores(): TamboStore[] {
    // Tiendas de respaldo con ubicaciones reales conocidas de Tambo en Lima
    // Expandido con más ubicaciones estratégicas
    return [
      {
        id: 1,
        name: 'Tambo+ San Isidro',
        address: 'Av. Conquistadores 945, San Isidro',
        lat: -12.0957,
        lng: -77.0365,
        phone: '(01) 411-3000',
        hours: '24 horas'
      },
      {
        id: 2,
        name: 'Tambo+ Miraflores',
        address: 'Av. Larco 1301, Miraflores',
        lat: -12.1212,
        lng: -77.0300,
        phone: '(01) 445-2200',
        hours: '24 horas'
      },
      {
        id: 3,
        name: 'Tambo+ Surco',
        address: 'Av. Benavides 3680, Surco',
        lat: -12.1360,
        lng: -77.0083,
        phone: '(01) 372-1500',
        hours: '24 horas'
      },
      {
        id: 4,
        name: 'Tambo+ La Molina',
        address: 'Av. Javier Prado Este 4200, La Molina',
        lat: -12.0750,
        lng: -76.9450,
        phone: '(01) 368-7700',
        hours: '24 horas'
      },
      {
        id: 5,
        name: 'Tambo+ San Borja',
        address: 'Av. San Luis 2315, San Borja',
        lat: -12.0960,
        lng: -77.0030,
        phone: '(01) 225-4800',
        hours: '24 horas'
      },
      {
        id: 6,
        name: 'Tambo+ Jesús María',
        address: 'Av. Brasil 2791, Jesús María',
        lat: -12.0720,
        lng: -77.0490,
        phone: '(01) 330-5500',
        hours: '24 horas'
      },
      {
        id: 7,
        name: 'Tambo+ Lince',
        address: 'Av. Arequipa 2650, Lince',
        lat: -12.0850,
        lng: -77.0350,
        phone: '(01) 422-8900',
        hours: '24 horas'
      },
      {
        id: 8,
        name: 'Tambo+ Magdalena',
        address: 'Av. Brasil 3890, Magdalena',
        lat: -12.0880,
        lng: -77.0650,
        phone: '(01) 263-7400',
        hours: '24 horas'
      },
      {
        id: 9,
        name: 'Tambo+ San Miguel',
        address: 'Av. La Marina 2000, San Miguel',
        lat: -12.0770,
        lng: -77.0850,
        phone: '(01) 578-1200',
        hours: '24 horas'
      },
      {
        id: 10,
        name: 'Tambo+ Barranco',
        address: 'Av. Grau 350, Barranco',
        lat: -12.1450,
        lng: -77.0200,
        phone: '(01) 247-3300',
        hours: '24 horas'
      },
      {
        id: 11,
        name: 'Tambo+ Pueblo Libre',
        address: 'Av. Universitaria 1801, Pueblo Libre',
        lat: -12.0720,
        lng: -77.0680,
        phone: '(01) 461-9800',
        hours: '24 horas'
      },
      {
        id: 12,
        name: 'Tambo+ Los Olivos',
        address: 'Av. Alfredo Mendiola 5200, Los Olivos',
        lat: -11.9850,
        lng: -77.0620,
        phone: '(01) 533-2100',
        hours: '24 horas'
      },
      {
        id: 13,
        name: 'Tambo+ Independencia',
        address: 'Av. Túpac Amaru 4890, Independencia',
        lat: -11.9920,
        lng: -77.0480,
        phone: '(01) 528-4500',
        hours: '24 horas'
      },
      {
        id: 14,
        name: 'Tambo+ Breña',
        address: 'Av. Arica 1250, Breña',
        lat: -12.0580,
        lng: -77.0450,
        phone: '(01) 433-7200',
        hours: '24 horas'
      },
      {
        id: 15,
        name: 'Tambo+ Chorrillos',
        address: 'Av. Huaylas 2100, Chorrillos',
        lat: -12.1680,
        lng: -77.0120,
        phone: '(01) 251-8900',
        hours: '24 horas'
      }
    ];
  }

  private addStoreMarkers(): void {
    if (!this.map || !this.nearbyStores) return;

    // Limpiar marcadores anteriores de tiendas
    this.storeMarkers.forEach(marker => {
      this.map.removeLayer(marker);
    });
    this.storeMarkers = [];

    this.nearbyStores.forEach((store, index) => {
      // Icono personalizado para tiendas Tambo
      const storeIcon = L.divIcon({
        className: 'custom-store-marker',
        html: `<div style="
          background-color: #a81b8d;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50% 50% 50% 0;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
          transform: rotate(-45deg);
        ">
          <span style="transform: rotate(45deg);">${index + 1}</span>
        </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
      });

      const marker = L.marker([store.lat, store.lng], { icon: storeIcon })
        .addTo(this.map)
        .bindPopup(`
          <div style="min-width: 200px;">
            <h3 style="font-weight: bold; margin-bottom: 8px; color: #a81b8d;">${store.name}</h3>
            <p style="margin: 4px 0; font-size: 13px;">${store.address}</p>
            <p style="margin: 4px 0; font-size: 12px; color: #666;">📞 ${store.phone}</p>
            <p style="margin: 4px 0; font-size: 12px; color: #666;">🕒 ${store.hours}</p>
            <p style="margin: 8px 0 0 0; font-size: 13px; color: #a81b8d; font-weight: bold;">
              📍 ${store.distance?.toFixed(2)} km - ⏱️ ${store.estimatedTime} min
            </p>
          </div>
        `);

      // Click en marcador selecciona la tienda
      marker.on('click', () => {
        this.selectStore(store);
      });
      
      // Guardar marcador para poder limpiarlo después
      this.storeMarkers.push(marker);
    });
  }

  onMapClick(latlng: { lat: number; lng: number }): void {
    // Mostrar indicador de carga
    this.changingLocation = true;

    // Actualizar ubicación
    this.currentLocation = { lat: latlng.lat, lng: latlng.lng };

    // Actualizar marcador de usuario sin abrir popup
    if (this.userMarker) {
      this.userMarker.setLatLng([latlng.lat, latlng.lng]);
    }

    // Limpiar ruta anterior
    if (this.routeLine) {
      this.map.removeLayer(this.routeLine);
      this.routeLine = null;
    }

    // Actualizar dirección
    this.reverseGeocode();

    // Buscar tiendas cercanas a la nueva ubicación
    this.findNearbyStores();

    // Ocultar indicador de carga después de buscar
    setTimeout(() => {
      this.changingLocation = false;
    }, 500);
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLng = this.deg2rad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  private reverseGeocode(): void {
    if (!this.currentLocation) return;

    // Usar Nominatim de OpenStreetMap para geocodificación inversa (GRATIS)
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${this.currentLocation.lat}&lon=${this.currentLocation.lng}`;
    
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data && data.display_name) {
          this.currentAddress = data.display_name;
        }
      })
      .catch(error => {
        console.error('Error en geocodificación:', error);
        this.currentAddress = 'Lima, Perú';
      });
  }

  selectStore(store: TamboStore): void {
    this.selectedStore = store;

    // Eliminar ruta anterior si existe
    if (this.routeLine) {
      this.map.removeLayer(this.routeLine);
    }

    // Dibujar ruta desde ubicación actual hasta la tienda
    if (this.currentLocation && this.map) {
      const latlngs = [
        [this.currentLocation.lat, this.currentLocation.lng],
        [store.lat, store.lng]
      ];

      // Crear línea de ruta con estilo
      this.routeLine = L.polyline(latlngs, {
        color: '#a81b8d',
        weight: 4,
        opacity: 0.7,
        dashArray: '10, 10',
        lineJoin: 'round'
      }).addTo(this.map);

      // Ajustar zoom para mostrar toda la ruta
      const bounds = L.latLngBounds(latlngs);
      this.map.fitBounds(bounds, { padding: [50, 50] });
    }
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  proceedToPayment(): void {
    if (!this.selectedStore) {
      alert('Por favor selecciona una tienda');
      return;
    }

    if (!this.currentLocation) {
      alert('No se pudo determinar tu ubicación');
      return;
    }

    // Guardar tienda seleccionada en localStorage
    localStorage.setItem('selectedStore', JSON.stringify(this.selectedStore));

    // Guardar dirección de entrega (donde pusiste el pin)
    const deliveryData = {
      address: this.currentAddress,
      lat: this.currentLocation.lat,
      lng: this.currentLocation.lng,
      district: this.extractDistrict(this.currentAddress),
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('deliveryLocation', JSON.stringify(deliveryData));
    console.log('📍 Dirección de entrega guardada:', deliveryData);

    // Navegar a método de pago
    this.router.navigate(['/cart/pago']);
  }

  private extractDistrict(address: string): string {
    // Intentar extraer el distrito de la dirección
    // Formato común: "Calle X, Distrito, Lima, Perú"
    const parts = address.split(',').map(p => p.trim());
    
    // El distrito suele estar en la segunda o tercera posición
    if (parts.length >= 2) {
      // Intentar encontrar un distrito conocido
      const knownDistricts = [
        'San Isidro', 'Miraflores', 'San Borja', 'Surco', 'La Molina',
        'Cercado de Lima', 'Jesús María', 'Magdalena', 'Pueblo Libre',
        'San Miguel', 'Lince', 'Breña', 'Los Olivos', 'Independencia',
        'Magdalena del Mar', 'Barranco', 'Chorrillos'
      ];
      
      for (const part of parts) {
        for (const district of knownDistricts) {
          if (part.toLowerCase().includes(district.toLowerCase())) {
            return district;
          }
        }
      }
      
      // Si no se encuentra un distrito conocido, usar la segunda parte
      return parts[1] || parts[0];
    }
    
    return 'Lima';
  }
}
