// Importamos TensorFlow.js
const tf = require('@tensorflow/tfjs')

// Clase para representar el Problema del Agente Viajero (TSP)
class TravellingSalesman {
  constructor(cities) {
    this.cities = cities
    this.distances = this.calculateDistances(cities)
    this.model = this.createModel()
  }

  // Función para calcular la distancia Euclidiana entre dos ciudades
  calculateDistances(cities) {
    const distances = cities.map((city1) =>
      cities.map((city2) =>
        Math.sqrt(
          Math.pow(city2.x - city1.x, 2) + Math.pow(city2.y - city1.y, 2)
        )
      )
    )
    return distances
  }

  // Crear el modelo de la red neuronal
  createModel() {
    const model = tf.sequential()

    // Capa de entrada (tamaño de entrada: 2 * número de ciudades, ya que cada ciudad tiene coordenadas x, y)
    model.add(
      tf.layers.dense({
        units: 64,
        inputShape: [this.cities.length * 2], // Cada ciudad tiene 2 coordenadas (x, y)
        activation: 'relu',
      })
    )

    // Capa oculta
    model.add(
      tf.layers.dense({
        units: 64,
        activation: 'relu',
      })
    )

    // Capa de salida (tamaño igual al número de ciudades)
    model.add(
      tf.layers.dense({
        units: this.cities.length,
        activation: 'softmax', // Usamos softmax para seleccionar la ciudad más probable a visitar
      })
    )

    // Compilamos el modelo
    model.compile({
      optimizer: 'adam',
      loss: 'categoricalCrossentropy', // Para clasificación
      metrics: ['accuracy'],
    })

    return model
  }

  // Crear los datos de entrenamiento (entradas: coordenadas de ciudades, salidas: secuencias de visitas)
  createTrainingData() {
    const inputs = []
    const outputs = []

    for (let i = 0; i < 1000; i++) {
      // Las entradas son las coordenadas de las ciudades
      const input = this.cities.flatMap((city) => [city.x, city.y])
      inputs.push(input)

      // Las salidas son las secuencias (aquí usamos una secuencia aleatoria como ejemplo)
      const output = this.generateRandomSequence(this.cities.length)
      outputs.push(output)
    }

    return {
      inputs: tf.tensor2d(inputs),
      outputs: tf.tensor2d(outputs, [outputs.length, this.cities.length]),
    }
  }

  // Generar una secuencia aleatoria de ciudades
  generateRandomSequence(numCities) {
    const sequence = Array.from({ length: numCities }, (_, index) => index)
    for (let i = sequence.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[sequence[i], sequence[j]] = [sequence[j], sequence[i]]
    }
    return sequence
  }

  // Entrenar el modelo
  async trainModel() {
    const { inputs, outputs } = this.createTrainingData()
    await this.model.fit(inputs, outputs, {
      epochs: 100,
      batchSize: 32,
    })
    console.log('Modelo entrenado')
  }

  // Predecir la secuencia de visitas a las ciudades
  async predictRoute(inputCities) {
    const input = inputCities.flatMap((city) => [city.x, city.y])
    const inputTensor = tf.tensor2d([input])

    const prediction = this.model.predict(inputTensor)

    // Obtener las probabilidades y ordenarlas para crear una secuencia
    const probabilities = prediction.arraySync()[0]
    const sequence = probabilities
      .map((prob, idx) => ({ city: idx, prob }))
      .sort((a, b) => b.prob - a.prob) // Ordenar de mayor a menor probabilidad
      .map((item) => item.city) // Extraer solo los índices de las ciudades

    console.log('Secuencia predicha:', sequence)
  }
}

// Ejemplo de uso con 5 ciudades
const cities = [
  { x: 0, y: 0 }, // Ciudad 1
  { x: 1, y: 2 }, // Ciudad 2
  { x: 4, y: 4 }, // Ciudad 3
  { x: 6, y: 1 }, // Ciudad 4
  { x: 7, y: 7 }, // Ciudad 5
]

// Crear una instancia del TSP
const tsp = new TravellingSalesman(cities)

// Entrenar el modelo
tsp.trainModel().then(() => {
  // Predecir el recorrido más corto para las ciudades dadas
  tsp.predictRoute(cities)
})
