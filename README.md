# fractal-backend

Backend para la gestión de productos y pedidos, construido con Node.js, Express y MySQL.

---

## Descripción

Este backend expone una API REST para manejar productos, pedidos y la relación entre ellos.  
Se conecta a una base de datos MySQL llamada `fractal_db` que contiene las tablas:

- `products`: productos disponibles para venta.
- `orders`: pedidos realizados por usuarios.
- `order_products`: tabla intermedia que relaciona productos con pedidos, incluyendo cantidad y precio total.

---

## Base de datos

La base de datos `fractal_db` debe contener las siguientes tablas y relaciones:

```sql
-- Eliminamos si ya existen
DROP TABLE IF EXISTS order_products;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS products;

-- Tabla de productos
CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(255)
);

-- Tabla de pedidos
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL,
    order_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_products INT DEFAULT 0,
    final_price DECIMAL(10,2) DEFAULT 0.00,
    status ENUM('Pending', 'InProgress', 'Completed') DEFAULT 'Pending'
);

-- Tabla intermedia de productos por pedido
CREATE TABLE order_products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT,
    product_id BIGINT,
    qty INT,
    total_price DECIMAL(10,2),
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
```

## Tecnologías y librerías usadas

- Node.js
- Express
- MySQL
- dotenv (para manejo de variables de entorno)
- mysql2 o sequelize (según implementación)

## Instalación y configuración

1. Clonar el repositorio:

```bash
git clone https://github.com/PedroDiazBelleza/fractal-test-backend.git
cd fractal-backend
```

2. Instalar dependencias:
```bash
npm install
```

3. Crear archivo .env en la raíz con las variables para la conexión a MySQL:
```bash
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=fractal_db
DB_PORT=3306
```

4. Asegúrate que la base de datos fractal_db y las tablas estén creadas (usa el script SQL anterior).

##  Ejecución
Para correr el servidor en modo desarrollo:
```bash
npm run dev
```

El servidor correrá típicamente en http://localhost:3001 (o el puerto configurado).
## Endpoints principales (ejemplos)

### Orders (Pedidos)

- `GET /orders`  
  Obtiene la lista completa de pedidos.

- `GET /orders/:id`  
  Obtiene el detalle de un pedido específico por su ID.

- `POST /orders`  
  Crea un nuevo pedido (sin detalles de productos).

- `POST /orders/createDetails`  
  Crea los detalles de productos asociados a un pedido.

- `PUT /orders/:id`  
  Actualiza un pedido existente por ID.

- `PUT /orders/updateDetails`  
  Actualiza los detalles de productos asociados a un pedido.

- `PATCH /orders/changeStatus/:id`  
  Cambia el estado (`status`) de un pedido específico.

- `DELETE /orders/:id`  
  Elimina un pedido por su ID.

---

### Products (Productos)

- `GET /products`  
  Obtiene la lista completa de productos.

- `GET /products/:id`  
  Obtiene el detalle de un producto específico por su ID.

- `GET /products/findByOrderId/:id`  
  Obtiene la lista de productos asociados a un pedido específico.

- `POST /products`  
  Crea un nuevo producto.

- `PUT /products/:id`  
  Actualiza un producto existente por ID.

- `DELETE /products/:id`  
  Elimina un producto por su ID.


## Estructura general del proyecto

- `/controllers` — Contiene la lógica de negocio para cada entidad (productos, pedidos, etc.).
- `/database` — Configuración y conexión a la base de datos MySQL.
- `/routes` — Definición de rutas y endpoints de la API.
- `index.js` — Punto de entrada principal de la aplicación, donde se configura y arranca el servidor Express.

---

## Scripts útiles

- `npm run dev` — Ejecuta el servidor en modo desarrollo con hot-reload (usando nodemon).
- `npm start` — Ejecuta el servidor en modo producción.
