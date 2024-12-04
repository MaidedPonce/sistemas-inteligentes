class SistemaExperto {
  constructor() {
    this.historial = [] // Almacenar las rutas y su longitud
  }

  // Función recursiva de backtracking para encontrar la mejor ruta
  encontrarRutaRecursiva(
    ciudades,
    distancias,
    rutaActual,
    ciudadesRestantes,
    mejorRuta = null,
    mejorLongitud = Infinity
  ) {
    if (ciudadesRestantes.length === 0) {
      // Si no hay más ciudades, completamos el recorrido regresando al inicio
      rutaActual.push(rutaActual[0]) // Regresar a la ciudad inicial
      const longitudRuta = this.calcularLongitudRuta(rutaActual, distancias)
      if (longitudRuta < mejorLongitud) {
        mejorRuta = [...rutaActual] // Guardamos la mejor ruta
        mejorLongitud = longitudRuta
      }
      return { mejorRuta, mejorLongitud }
    }

    // Recursión para explorar cada ciudad restante
    for (let i = 0; i < ciudadesRestantes.length; i++) {
      const ciudad = ciudadesRestantes[i]
      const nuevaRuta = [...rutaActual, ciudad]
      const nuevasCiudadesRestantes = [
        ...ciudadesRestantes.slice(0, i),
        ...ciudadesRestantes.slice(i + 1),
      ]

      // Llamada recursiva para seguir explorando
      const resultado = this.encontrarRutaRecursiva(
        ciudades,
        distancias,
        nuevaRuta,
        nuevasCiudadesRestantes,
        mejorRuta,
        mejorLongitud
      )
      if (resultado.mejorLongitud < mejorLongitud) {
        mejorRuta = resultado.mejorRuta
        mejorLongitud = resultado.mejorLongitud
      }
    }

    return { mejorRuta, mejorLongitud }
  }

  // Calcula la longitud total de una ruta
  calcularLongitudRuta(ruta, distancias) {
    let longitud = 0
    for (let i = 0; i < ruta.length - 1; i++) {
      const ciudadActual = ruta[i]
      const ciudadSiguiente = ruta[i + 1]
      longitud += distancias[ciudadActual][ciudadSiguiente]
    }
    return longitud
  }

  // Verifica si la solución ya está en el historial
  buscarSolucionPrevia(ciudades) {
    return this.historial.find((solucion) => {
      return solucion.ruta.every((ciudad, index) => ciudad === ciudades[index])
    })
  }

  // Motor de inferencia: Evalúa cada ruta generada usando backtracking
  motorInferencia(ciudades, distancias) {
    const solucionPrevia = this.buscarSolucionPrevia(ciudades)
    if (solucionPrevia) {
      console.log(
        'Solución encontrada previamente:',
        solucionPrevia.ruta.join(' -> '),
        `Longitud: ${solucionPrevia.longitud}`
      )
      return
    }

    const { mejorRuta, mejorLongitud } = this.encontrarRutaRecursiva(
      ciudades,
      distancias,
      [ciudades[0]],
      ciudades.slice(1)
    )

    // Almacenamos la mejor ruta encontrada
    this.historial.push({
      ruta: mejorRuta,
      longitud: mejorLongitud,
    })
    console.log(
      'Ruta más corta:',
      mejorRuta.join(' -> '),
      `Longitud: ${mejorLongitud}`
    )
  }

  // Función recursiva para ejecutar la solución n veces
  ejecutarRecursivo(ciudades, distancias, veces, contador = 1) {
    if (contador > veces) return // Condición de salida

    console.log(`Ejecutando la corrida número ${contador}`)
    this.motorInferencia(ciudades, distancias)

    // Llamada recursiva
    this.ejecutarRecursivo(ciudades, distancias, veces, contador + 1)
  }

  // Permite ejecutar el sistema tantas veces como se desee
  ejecutarSistema(ciudades, distancias, veces = 1) {
    this.ejecutarRecursivo(ciudades, distancias, veces)
  }
}

// Distancias entre ciudades (ejemplo de distancias)
const distancias = {
  A: { B: 5, C: 10, D: 7, E: 6 },
  B: { A: 5, C: 8, D: 6, E: 4 },
  C: { A: 10, B: 8, D: 9, E: 3 },
  D: { A: 7, B: 6, C: 9, E: 2 },
  E: { A: 6, B: 4, C: 3, D: 2 },
}

// Crear instancia del sistema experto
const sistema = new SistemaExperto()

// Ejecutar el sistema para varias configuraciones de ciudades
const ciudades1 = ['A', 'B', 'C', 'D', 'E']
sistema.ejecutarSistema(ciudades1, distancias, 3) // Ejecuta el sistema 3 veces

// Ejecutar con otro conjunto de ciudades
const ciudades2 = ['A', 'C', 'D', 'B', 'E']
sistema.ejecutarSistema(ciudades2, distancias, 2) // Ejecuta el sistema 2 veces
