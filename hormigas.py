import random
import numpy as np

# Definimos las ciudades y la distancia entre ellas (distancia euclidiana)
cities = [(0, 0), (1, 3), (4, 3), (6, 1), (7, 5)]  # Coordenadas de las ciudades

# Inicializamos la feromona en las aristas
pheromone = np.ones((len(cities), len(cities)))

# Número de hormigas y el número de iteraciones
n_ants = 10
n_iterations = 100

# Parámetros del algoritmo
alpha = 1  # Influencia de la feromona
beta = 2   # Influencia de la visibilidad (distancia)
rho = 0.1  # Tasa de evaporación de la feromona
Q = 100    # Cantidad de feromona depositada
distance_matrix = np.zeros((len(cities), len(cities)))

# Función para calcular la distancia euclidiana entre dos ciudades
def calculate_distance(city1, city2):
    return np.sqrt((city1[0] - city2[0]) ** 2 + (city1[1] - city2[1]) ** 2)

# Inicializamos la matriz de distancias
for i in range(len(cities)):
    for j in range(len(cities)):
        if i != j:
            distance_matrix[i][j] = calculate_distance(cities[i], cities[j])


# Función de selección de la siguiente ciudad
def select_next_city(visited, pheromone, distance_matrix):
    current_city = visited[-1]
    probabilities = []
    
    for city in range(len(cities)):
        if city not in visited:
            tau = pheromone[current_city][city] ** alpha
            eta = (1.0 / distance_matrix[current_city][city]) ** beta
            probabilities.append(tau * eta)
        else:
            probabilities.append(0)
    
    total = sum(probabilities)
    probabilities = [p / total for p in probabilities]
    return random.choices(range(len(cities)), probabilities)[0]

# Función para simular el recorrido de las hormigas
def run_aco():
    global pheromone  # Se indica que vamos a usar la variable global pheromone
    best_route = None
    best_distance = float('inf')
    
    for _ in range(n_iterations):
        all_routes = []
        all_lengths = []
        
        for _ in range(n_ants):
            visited = [0]  # Comenzamos en la ciudad 0
            for _ in range(len(cities) - 1):
                next_city = select_next_city(visited, pheromone, distance_matrix)  # Pasamos los parámetros correctamente
                visited.append(next_city)
            
            route_length = sum(distance_matrix[visited[i]][visited[i+1]] for i in range(len(visited)-1))
            all_routes.append(visited)
            all_lengths.append(route_length)
        
        # Actualizamos la feromona en función de las rutas de las hormigas
        pheromone *= (1 - rho)
        for i in range(len(all_routes)):
            for j in range(len(all_routes[i]) - 1):
                pheromone[all_routes[i][j]][all_routes[i][j+1]] += Q / all_lengths[i]
        
        # Encontramos la mejor ruta
        min_length = min(all_lengths)
        if min_length < best_distance:
            best_distance = min_length
            best_route = all_routes[all_lengths.index(min_length)]
    
    return best_route, best_distance

# Ejecutamos el ACO para resolver el TSP
best_route, best_distance = run_aco()
print("Mejor ruta:", best_route)
print("Distancia de la mejor ruta:", best_distance)
