import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-legals',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div class="container mx-auto px-4 py-12 max-w-4xl">
        <!-- Header -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">Términos Legales</h1>
          <p class="text-lg text-gray-600">Condiciones generales de uso y venta</p>
        </div>

        <!-- Contenido principal -->
        <div class="bg-white rounded-lg shadow-lg p-8 space-y-8">
          
          <!-- Sección 1: Validez de ofertas -->
          <section>
            <h2 class="text-2xl font-bold text-[#a81b8d] mb-4 border-b-2 border-[#a81b8d] pb-2">
              Plazo de Validez de las Ofertas y Precios
            </h2>
            <div class="space-y-4 text-gray-700 leading-relaxed">
              <p>
                El plazo de validez de la oferta es aquel que coincide con la fecha de vigencia indicada en la promoción o en virtud del agotamiento de las cantidades de productos disponibles para esa promoción debidamente informados al Usuario.
              </p>
              <p>
                Cuando quiera que en una promoción no se indique una fecha de terminación se entenderá que la actividad se extenderá hasta el agotamiento de los inventarios correspondientes.
              </p>
              <p>
                Los precios de los productos y servicios disponibles en este sitio web solo tendrán vigencia y aplicación en éste y no serán aplicables a otros canales de venta utilizados por las empresas ofertantes.
              </p>
              <div class="bg-gray-50 p-4 rounded-lg border-l-4 border-[#a81b8d]">
                <p class="font-semibold text-gray-800">Importante:</p>
                <ul class="list-disc list-inside mt-2 space-y-1">
                  <li>Máximo 01 promoción por cliente y por pedido</li>
                  <li>Máximo 01 pedido por cliente</li>
                </ul>
              </div>
            </div>
          </section>

          <!-- Sección 2: Cobertura -->
          <section>
            <h2 class="text-2xl font-bold text-[#a81b8d] mb-4 border-b-2 border-[#a81b8d] pb-2">
              Cobertura de Delivery
            </h2>
            <div class="space-y-4 text-gray-700 leading-relaxed">
              <p class="font-semibold">Por el momento llegamos a los siguientes distritos:</p>
              <div class="grid md:grid-cols-2 gap-4">
                <div class="bg-blue-50 p-4 rounded-lg">
                  <h4 class="font-semibold text-gray-800 mb-2">Zona Sur:</h4>
                  <ul class="list-disc list-inside space-y-1 text-sm">
                    <li>Santiago de Surco</li>
                    <li>Surquillo</li>
                    <li>San Juan de Lurigancho (Zona Sur)</li>
                    <li>Chorrillos</li>
                    <li>Barranco</li>
                  </ul>
                </div>
                <div class="bg-green-50 p-4 rounded-lg">
                  <h4 class="font-semibold text-gray-800 mb-2">Zona Centro:</h4>
                  <ul class="list-disc list-inside space-y-1 text-sm">
                    <li>San Miguel</li>
                    <li>Pueblo Libre</li>
                    <li>Magdalena del Mar</li>
                    <li>Jesús María</li>
                    <li>Lince</li>
                  </ul>
                </div>
                <div class="bg-purple-50 p-4 rounded-lg">
                  <h4 class="font-semibold text-gray-800 mb-2">Zona Premium:</h4>
                  <ul class="list-disc list-inside space-y-1 text-sm">
                    <li>Miraflores</li>
                    <li>San Borja</li>
                    <li>San Isidro</li>
                    <li>La Molina (Zona Oeste)</li>
                  </ul>
                </div>
                <div class="bg-yellow-50 p-4 rounded-lg">
                  <h4 class="font-semibold text-gray-800 mb-2">Otras Zonas:</h4>
                  <ul class="list-disc list-inside space-y-1 text-sm">
                    <li>Santa Anita</li>
                    <li>San Luis</li>
                    <li>San Martín de Porres</li>
                    <li>Cercado de Lima</li>
                    <li>Callao (Zona Este)</li>
                    <li>Ate</li>
                    <li>Los Olivos</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <!-- Sección 3: Retiro en tienda -->
          <section>
            <h2 class="text-2xl font-bold text-[#a81b8d] mb-4 border-b-2 border-[#a81b8d] pb-2">
              Retiro en Tienda
            </h2>
            <div class="space-y-4 text-gray-700 leading-relaxed">
              <h3 class="text-xl font-semibold text-gray-800">¿Cómo comprar con retiro en tienda?</h3>
              <div class="grid md:grid-cols-3 gap-4">
                <div class="bg-gradient-to-br from-blue-100 to-blue-200 p-4 rounded-lg text-center">
                  <div class="text-3xl font-bold text-blue-600 mb-2">1</div>
                  <p class="text-sm">Elige tu producto y verifica que tenga la opción de "Retiro en tienda"</p>
                </div>
                <div class="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-lg text-center">
                  <div class="text-3xl font-bold text-green-600 mb-2">2</div>
                  <p class="text-sm">Recibirás un correo confirmando cuando tu pedido esté listo</p>
                </div>
                <div class="bg-gradient-to-br from-purple-100 to-purple-200 p-4 rounded-lg text-center">
                  <div class="text-3xl font-bold text-purple-600 mb-2">3</div>
                  <p class="text-sm">Lleva tu DNI/C.E. y el comprobante de pago con el número de pedido</p>
                </div>
              </div>
              
              <div class="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                <h4 class="font-semibold text-red-800 mb-2">Condiciones importantes:</h4>
                <ul class="list-disc list-inside space-y-1 text-red-700 text-sm">
                  <li>Plazo de recojo: <strong>30 minutos</strong></li>
                  <li>Plazo máximo: <strong>12 horas</strong> desde la fecha seleccionada</li>
                  <li>Documento obligatorio: DNI o Carnet de Extranjería</li>
                  <li>Solo retira quien está registrado en la solicitud</li>
                </ul>
              </div>
            </div>
          </section>

          <!-- Sección 4: Promociones especiales -->
          <section>
            <h2 class="text-2xl font-bold text-[#a81b8d] mb-4 border-b-2 border-[#a81b8d] pb-2">
              Promociones Especiales
            </h2>
            <div class="space-y-6">
              
              <!-- Café Selecto -->
              <div class="bg-amber-50 p-6 rounded-lg border border-amber-200">
                <h3 class="text-lg font-semibold text-amber-800 mb-3">☕ Promociones de Café Selecto</h3>
                <ul class="space-y-2 text-amber-700">
                  <li>• Válidas solo en tiendas Tambo seleccionadas</li>
                  <li>• Stock mínimo de promoción: 1,000 unidades</li>
                  <li>• Ofertas sujetas a disponibilidad en cada local</li>
                  <li>• Imágenes referenciales</li>
                </ul>
              </div>

              <!-- Tiendas 24 horas -->
              <div class="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
                <h3 class="text-lg font-semibold text-indigo-800 mb-3">🕐 Términos Tiendas 24 Horas</h3>
                <ul class="space-y-2 text-indigo-700">
                  <li>• Venta de bebidas alcohólicas: <strong>9am a 11pm</strong> (solo mayores de edad)</li>
                  <li>• Consulta tiendas 24h en: <a href="https://bit.ly/Tambo24Horas" class="text-blue-600 underline" target="_blank">bit.ly/Tambo24Horas</a></li>
                  <li>• Tambo se reserva el derecho de modificar horarios sin previo aviso</li>
                </ul>
              </div>

              <!-- Horario nocturno -->
              <div class="bg-purple-50 p-6 rounded-lg border border-purple-200">
                <h3 class="text-lg font-semibold text-purple-800 mb-3">🌙 Campaña Horario Nocturno</h3>
                <div class="space-y-2 text-purple-700">
                  <p><strong>Horario:</strong> Jueves a domingo, 10:30pm a 12:30am</p>
                  <p><strong>Cobertura:</strong> Solo distritos con servicio nocturno habilitado</p>
                  <p><strong>Activación:</strong> Automática durante el rango horario</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Sección 5: Contacto -->
          <section class="border-t pt-8">
            <h2 class="text-2xl font-bold text-[#a81b8d] mb-4">
              Información de Contacto
            </h2>
            <div class="bg-gray-50 p-6 rounded-lg">
              <p class="text-gray-700 mb-2">
                <strong>Tiendas Tambo S.A.C.</strong><br>
                RUC: 20563529378<br>
                Dirección: Av. Javier Prado N° 6210 Int. 1201<br>
                Urb. Rivera de Monterrico, La Molina, Lima
              </p>
              <p class="text-sm text-gray-600 mt-4">
                Para consultas sobre protección de datos personales:<br>
                📧 <a href="mailto:leydeprotecciondedatos&#64;lindcorp.pe" class="text-blue-600 underline">leydeprotecciondedatos&#64;lindcorp.pe</a>
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  `
})
export class LegalsComponent {
  constructor() {}
}