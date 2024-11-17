class GeneticAlgorithm {
    constructor(cities, distances, populationSize, generations, mutationRate) {
      this.cities = cities;
      this.distances = distances;
      this.populationSize = populationSize;
      this.generations = generations;
      this.mutationRate = mutationRate;
      this.population = [];
    }
  
    // Calcula la distancia total de una ruta
    calculateDistance(route) {
      let total = 0;
      for (let i = 0; i < route.length - 1; i++) {
        total += this.distances[route[i]][route[i + 1]];
      }
      total += this.distances[route[route.length - 1]][route[0]]; // Regresa al inicio
      return total;
    }
  
    // Genera la población inicial
    generatePopulation() {
      for (let i = 0; i < this.populationSize; i++) {
        const route = this.cities.slice().sort(() => Math.random() - 0.5);
        this.population.push(route);
      }
    }
  
    // Selección por torneo
    selectParents(fitness) {
      const tournamentSize = 3;
      const selected = [];
      for (let i = 0; i < tournamentSize; i++) {
        const index = Math.floor(Math.random() * this.population.length);
        selected.push({ route: this.population[index], fitness: fitness[index] });
      }
      return selected.sort((a, b) => a.fitness - b.fitness)[0].route;
    }
  
    // Cruce (Order Crossover)
    crossover(parent1, parent2) {
      const start = Math.floor(Math.random() * parent1.length);
      const end = Math.floor(Math.random() * (parent1.length - start)) + start;
      const child = new Array(parent1.length).fill(null);
  
      // Copia un segmento del primer padre
      for (let i = start; i <= end; i++) {
        child[i] = parent1[i];
      }
  
      // Completa con elementos del segundo padre
      let currentIndex = 0;
      for (let city of parent2) {
        if (!child.includes(city)) {
          while (child[currentIndex] !== null) {
            currentIndex++;
          }
          child[currentIndex] = city;
        }
      }
      return child;
    }
  
    // Mutación (intercambio de dos ciudades)
    mutate(route) {
      const index1 = Math.floor(Math.random() * route.length);
      const index2 = Math.floor(Math.random() * route.length);
      [route[index1], route[index2]] = [route[index2], route[index1]];
    }
  
    // Ejecuta el algoritmo genético
    run() {
      this.generatePopulation();
  
      for (let gen = 0; gen < this.generations; gen++) {
        const fitness = this.population.map((route) => this.calculateDistance(route));
  
        // Nueva generación
        const newPopulation = [];
        for (let i = 0; i < this.populationSize; i++) {
          const parent1 = this.selectParents(fitness);
          const parent2 = this.selectParents(fitness);
          let child = this.crossover(parent1, parent2);
  
          if (Math.random() < this.mutationRate) {
            this.mutate(child);
          }
          newPopulation.push(child);
        }
        this.population = newPopulation;
  
        // Mejor solución de la generación
        const bestIndex = fitness.indexOf(Math.min(...fitness));
        console.log(
          `Generación ${gen + 1}: Mejor ruta: ${this.population[bestIndex]} - Distancia: ${fitness[bestIndex]}`
        );
      }
  
      // Solución final
      const finalFitness = this.population.map((route) => this.calculateDistance(route));
      const bestIndex = finalFitness.indexOf(Math.min(...finalFitness));
      console.log(
        `\nMejor solución encontrada: ${this.population[bestIndex]} - Distancia: ${finalFitness[bestIndex]}`
      );
    }
  }
  
  const cities = ["A", "B", "C", "D", "E"];
  const distances = {
    A: { B: 2, C: 9, D: 10, E: 7 },
    B: { A: 2, C: 6, D: 4, E: 8 },
    C: { A: 9, B: 6, D: 3, E: 5 },
    D: { A: 10, B: 4, C: 3, E: 1 },
    E: { A: 7, B: 8, C: 5, D: 1 },
  };
 
  const ga = new GeneticAlgorithm(cities, distances, 20, 50, 0.1); // Población de 20, 50 generaciones, tasa de mutación 10%
  ga.run();