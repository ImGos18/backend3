# ShipNow

API de demostracion de una plataforma de **logistica / envios**, construida con
**Node.js + Express + MongoDB (Mongoose)**.

## Que hace ShipNow

Gestiona cinco entidades:

- **Order** (envio/pedido): `customerName`, `customer` (ref a User), `address`, `weight`, `cost` (calculado), `status`, `priority`, `items` (array de `{ name, quantity, price }`), `courierId`.
- **User** (cliente): `name`, `email`, `role` (admin / customer / driver).
- **Courier** (repartidor): `name`, `zone`, `available`.
- **Product** (producto): `name`, `price`, `stock`, `status` (available / out_of_stock).
- **Delivery** (entrega): `orderId` (ref a Order), `courierId` (ref a Courier), `status` (assigned / in_transit / delivered), `assignedAt`.

Regla de negocio principal (hoy embebida en la ruta de orders):
`cost = weight * 10`. Al crear un envio tambien se dispara una notificacion falsa.
Al consultar una entrega por id (`GET /api/deliveries/:id`) se llama inline a un
"proveedor externo" de tracking falso (`src/services/trackingProvider.js`).

## Como correrlo

Requisitos: Node.js y una instancia de MongoDB corriendo en `localhost:27017`.

Para levantar MongoDB rapido con Docker:

```bash
docker run -d -p 27017:27017 --name shipnow-mongo mongo
```

Tambien sirve una instalacion local de MongoDB o un cluster de MongoDB Atlas
(en ese caso ajusta la URI hardcodeada en `src/db.js` y `src/seed.js`).

```bash
# 1. Instalar dependencias
npm install

# 2. (Opcional) Cargar datos de ejemplo relacionados
npm run seed

# 3. Levantar el servidor
npm start
# o
npm run dev
```

El servidor queda escuchando en `http://localhost:8080`.

### Endpoints

| Metodo | Ruta                         | Descripcion                     |
| ------ | ---------------------------- | ------------------------------- |
| GET    | `/`                          | Health check basico             |
| POST   | `/api/users`                 | Crear cliente                   |
| GET    | `/api/users`                 | Listar clientes                 |
| GET    | `/api/users/:id`             | Obtener cliente por id          |
| POST   | `/api/products`              | Crear producto                  |
| GET    | `/api/products`              | Listar productos                |
| GET    | `/api/products/:id`          | Obtener producto por id         |
| POST   | `/api/couriers`              | Crear repartidor                |
| GET    | `/api/couriers`              | Listar repartidores             |
| GET    | `/api/couriers/:id`          | Obtener repartidor por id       |
| POST   | `/api/orders`                | Crear envio                     |
| GET    | `/api/orders`                | Listar envios                   |
| GET    | `/api/orders/:id`            | Obtener envio por id            |
| PATCH  | `/api/orders/:id/status`     | Cambiar estado de un envio      |
| POST   | `/api/deliveries`            | Crear entrega (order + courier) |
| GET    | `/api/deliveries`            | Listar entregas                 |
| GET    | `/api/deliveries/:id`        | Obtener entrega + tracking      |
| PATCH  | `/api/deliveries/:id/status` | Cambiar estado de una entrega   |

### Endpoints para cargar datos de prueba (solo disponible en entorno development)

> #### Estos endpoints solo funcionaran cuando en las variables de entorno tengas `NODE_ENV = development`

| Metodo | Ruta                    | Descripcion                                                  |
| ------ | ----------------------- | ------------------------------------------------------------ |
| GET    | `/api/mocks/Users`      | crea usuarios de prueba SIN guardarlos en la base de datos   |
| POST   | `/api/mocks/Users`      | crea usuarios de prueba y los guarda en la base de datos     |
| GET    | `/api/mocks/Products`   | crea productos de prueba SIN guardarlos en la base de datos  |
| POST   | `/api/mocks/Products`   | crea productos de prueba y los guarda en la base de datos    |
| GET    | `/api/mocks/Orders`     | crea ordenes de prueba SIN guardarlos en la base de datos    |
| POST   | `/api/mocks/Orders`     | crea ordenes de prueba y las guarda en la base de datos      |
| GET    | `/api/mocks/Deliveries` | crea deliveries de prueba SIN guardarlos en la base de datos |
| POST   | `/api/mocks/Deliveries` | crea deliveries de prueba y los guarda en la base de datos   |

### la cantidad de resultados generados por estos endpoints para hacer testing dependen de un objeto en el archivo index.js ubicado en la carpeta `constants` llamado `DEV_TESTING_VALUES.mockResults`, si se cambia el numero alli eso cambiara cuantos resultados arroja cada endpoint de mocking

Ejemplo de creacion de envio:

```bash
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -d '{"customerName":"Ana Lopez","address":"Calle Falsa 123","weight":5}'
```

## Probar con Postman

En la carpeta `postman/` hay una coleccion lista para importar:
`postman/ShipNow.postman_collection.json`.

1. Abre Postman -> **Import** -> selecciona el archivo.
2. La coleccion trae una variable `{{baseUrl}}` que por defecto apunta a
   `http://localhost:8080`. Si cambias el puerto, edita esa variable.
3. Hay una carpeta por entidad (Users, Products, Couriers, Orders, Deliveries)
   con un request por endpoint. Los POST/PATCH incluyen un body JSON de ejemplo.
4. Para los requests que usan `:id` (o refs como `customer`, `orderId`,
   `courierId`), copia los ids reales de la respuesta de un GET/POST previo.
