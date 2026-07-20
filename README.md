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

## Manejo de Errores

para el manejo de errores se implemento una funcion llamada asyncHandler que lo que nos permite es evitar tener que escribir el bloque trycatch en cada controlador, esta funciona recibiendo como parametro una funcion que si se ejecuta y tiene algun error su metodo catch llama inmediatamente la funcion next() con pasandole por parametro el error generado

```bash
asyncHandler(fn){
   return (req,res,next) => {
      fn(req,res,next).catch((err)=>next(err))
      }
}
```

al hacer esto si hay algun error express se dirige directamente a nuestro middleware de manejo de errores llamado errorHandler el cual prepara una respuesta que pueda ser enviada al usuario con un codigo de error y mensaje descritivo de que fue lo que salio mal, para que este sistema funcione de manera optima los errores deben arrojarse desde nuestra clase AppError que nos permite crear un objeto de error personalizado para hacerlo compatible con el errorHandler

```bash
class AppError extends Error
{
  constructor(
    code = ERROR_CODES.INTERNAL_SERVER_ERROR,
    customMessage,
    details,
  ) {
    const errorDefinition =
      errorsDictionary[code] || errorsDictionary.INTERNAL_SERVER_ERROR;

    super(customMessage || errorDefinition.message);
    this.code = code;
    this.statusCode = errorDefinition.statusCode;
    this.details = details;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

```

esta clase centraliza los codigos de error y las respuestas utilizando ERROR_CODES que es un objeto donde se definen los errores posibles para poder controlarlos

```bash
exports.ERROR_CODES =
{
  VALIDATION_ERROR: "VALIDATION_ERROR",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  ORDER_NOT_FOUND: "ORDER_NOT_FOUND",
  DELIVERY_NOT_FOUND: "DELIVERY_NOT_FOUND",
  INVALID_ORDER_STATUS: "INVALID_ORDER_STATUS",
  INVALID_DELIVERY_STATUS: "INVALID_DELIVERY_STATUS",
  DRIVER_NOT_AVAILABLE: "DRIVER_NOT_AVAILABLE",
  INVALID_MOCK_AMOUNT: "INVALID_MOCK_AMOUNT",
  ROUTE_NOT_FOUND: "ROUTE_NOT_FOUND",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
  PRODUCT_NOT_FOUND: "PRODUCT_NOT_FOUND",
  COURIER_NOT_FOUND: "COURIER_NOT_FOUND",
  INVALID_MOCK_RESULTS: "INVALID_MOCK_RESULTS",
};
```

y un errors-dictionary que tiene como propiedades los error codes y cada uno cuenta con un statusCode y un message descriptivo de cada error

```bash

errorsDictionary =
{
  [ERROR_CODES.VALIDATION_ERROR]:
  {
    statusCode: 400,
    message: "los datos enviados no son validos",
  },
  [ERROR_CODES.USER_NOT_FOUND]:
  {
    statusCode: 404,
    message: "No se encontro el usuario solicitado",
  },
  [ERROR_CODES.ORDER_NOT_FOUND]:
  {
    statusCode: 404,
    message: "No se encontro el pedido solicitado",
  },
  [ERROR_CODES.DELIVERY_NOT_FOUND]:
  {
    statusCode: 404,
    message: "No se encontro la entrega solicitada",
  },
  [ERROR_CODES.INVALID_ORDER_STATUS]:
  {
    statusCode: 400,
    message: "El estado indicado no es valido para un pedido",
  },
}

```

si se quiere usar la clase personalizada AppError se debe llamar dentro de una funcion que este dentro de nuestro asyncHandler de la siguiente forma

```bash
asyncHandler(async function (req,res)=>
{
if(!req.body)
{
   throw new AppError(ERROR_CODES.VALIDATION_ERROR, "mensaje de error personalizado (opcional)")
}
})
```

si el error que se quiere arrojar no se encuentra dentro de ERROR_CODES debe agregarse y luego agregarlo a errors-dictionary, la funcion AppError siempre debe llamarse de esta forma y con estos parametros para que la centralizacion y manejo de errores funcione de forma correcta y mantenga la consistencia a lo largo de todo el codigo
