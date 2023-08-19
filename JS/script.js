//Mostrar desglose de cuotas solicitud actual
function mostrarCuotas(cuotas, nombre) {
  const resultado = document.querySelector("#resultado");
  resultado.innerHTML = `<h2>Hola, ${nombre}!</h2>`;
  resultado.innerHTML += `<h3>Desglose de cuotas:</h3>`;

  cuotas.forEach((cuotaData) => {
    resultado.innerHTML += `<p>Mes ${cuotaData.mes}: Cuota: $${cuotaData.cuota}, Interés: $${cuotaData.interes}, Amortización: $${cuotaData.amortizacion}, Saldo Restante: $${cuotaData.saldoRestante}</p>`;
  });
}

//Mostrar solicitudes anteriores
function mostrarSolicitudesAnteriores(solicitudes) {
  const solicitudesAnteriores = document.querySelector("#solicitudesAnteriores");
  solicitudesAnteriores.innerHTML = `<h3>Solicitudes anteriores:</h3>`;

  solicitudes.forEach((solicitud, index) => {
    solicitudesAnteriores.innerHTML += `<div class="solicitud-anterior">
      <p><strong>Solicitud ${index + 1}:</strong></p>
      <p><strong>Nombre:</strong> ${solicitud.nombre}</p>
      <p><strong>Monto Inicial:</strong> $${solicitud.montoInicial}</p>
      <p><strong>Años:</strong> ${solicitud.anhos}</p>
      <p><strong>Tipo de Crédito:</strong> ${solicitud.tipo}</p>
      <p><strong>Cuota Mensual:</strong> $${solicitud.cuotaMensual.toFixed(2)}</p>
      <hr>
    </div>`;
  });
}

//calcular cuotas y mostrar desglose
function calcularCuotas() {
  const nombre = document.querySelector("#nombre").value;
  const montoInicial = parseFloat(document.querySelector("#monto").value);
  const anhos = parseInt(document.querySelector("#anhos").value);
  const tipo = document.querySelector("#tipo").value;
  const tasaAnual = tipo === "hipotecario" ? 0.05 : 0.15;
  const tasaMensual = tasaAnual / 12;
  const totalCuotas = anhos * 12;
  let cuotaMensual = (montoInicial * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -totalCuotas));

  const cuotasArray = [];
  let totalPagar = 0;
  let montoRestante = montoInicial;

  for (let i = 1; i <= totalCuotas; i++) {
    const interesMensual = montoRestante * tasaMensual;
    const amortizacionMensual = cuotaMensual - interesMensual;
    montoRestante -= amortizacionMensual;
    totalPagar += cuotaMensual;

    cuotasArray.push({
      mes: i,
      cuota: cuotaMensual.toFixed(2),
      interes: interesMensual.toFixed(2),
      amortizacion: amortizacionMensual.toFixed(2),
      saldoRestante: montoRestante.toFixed(2),
    });
  }

  // Almacenar en el local Storage
  const solicitudesAnteriores = JSON.parse(localStorage.getItem("solicitudesData")) || [];

  // Agregar solicitud actual al historial
  const solicitudActual = {
    nombre: nombre,
    montoInicial: montoInicial,
    anhos: anhos,
    tipo: tipo,
    cuotaMensual: cuotaMensual,
  };
  solicitudesAnteriores.push(solicitudActual);

  // Datos al local Storage
  localStorage.setItem("solicitudesData", JSON.stringify(solicitudesAnteriores));

  // Mostrar resultados
  mostrarCuotas(cuotasArray, nombre);
  mostrarSolicitudesAnteriores(solicitudesAnteriores);

  // Limpiar campos
  document.querySelector("#nombre").value = "";
  document.querySelector("#monto").value = "";
  document.querySelector("#anhos").value = "";
  document.querySelector("#tipo").value = "hipotecario";
}

// Verificar si hay datos guardados en el almacenamiento local y mostrar  solicitudes anteriores
window.addEventListener("DOMContentLoaded", () => {
  const solicitudesData = localStorage.getItem("solicitudesData");
  if (solicitudesData) {
    const solicitudesAnteriores = JSON.parse(solicitudesData);
    mostrarSolicitudesAnteriores(solicitudesAnteriores);
  }
});

const boton = document.getElementById("boton")
boton.addEventListener("click", () => {
  Toastify({
    text: "Préstamo solicitado",
    duration: 3000
  }).showToast();
});