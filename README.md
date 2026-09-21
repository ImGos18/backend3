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

La regla de negocio principal para las órdenes calcula el costo del envío como
`cost = weight * 10`. Este cálculo se realiza en `orders.service.js`.

## Arquitectura

La aplicación está organizada en capas:

- `src/routes/`: define los endpoints y conecta cada ruta con su controlador.
- `src/controller/`: recibe las solicitudes HTTP y prepara las respuestas.
- `src/services/`: contiene las validaciones y reglas de negocio.
- `src/repositories/`: concentra el acceso a MongoDB mediante los modelos.
- `src/models/`: define los modelos y esquemas principales de Mongoose.
- `src/middlewares/`: contiene el manejo global de errores y la carga de archivos.
- `src/config/`: centraliza las variables de entorno y la configuración del logger.
- `src/docs/`: contiene la configuración y los archivos YAML de Swagger.
- `src/errors/`: define los códigos, mensajes y la clase de errores de la aplicación.
- `tests/`: contiene los tests funcionales con Mocha, Chai y Supertest.

El flujo habitual de una solicitud es:

`route → controller → service → repository → model`

Los errores se envían al middleware global de errores, registrado al final de
`src/app.js`

## Como correrlo

Requisitos: Node.js 22.13.0 o superior y una instancia de MongoDB.

Tambien sirve una instalacion local de MongoDB o un cluster de MongoDB Atlas.
La conexion se configura mediante variables de entorno; no hay que modificar el
codigo fuente.

```bash
# 1. Instalar dependencias
npm install

# 2. Crear el archivo de entorno y completar sus valores
cp .env.example .env

# 3. Levantar el servidor
npm start

# este comando se utiliza para levantar un servidor de desarrollo usando concurrently para actualizar los archivos YAML de manera mas comoda actualizando la pagina cada vez que se realiza un cambio
npm run dev
```

El servidor queda escuchando en `http://localhost:8080`.

### Variables de entorno

El archivo [`.env.example`](./.env.example) documenta todas las variables. El
servidor valida las variables obligatorias al arrancar, mientras que el entorno
`test` utiliza valores seguros por defecto para `PORT` y `SECRET`.

| Variable         | Requerida en desarrollo | Uso                                                                                                                          |
| ---------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `PORT`           | Si                      | Puerto HTTP del servidor.                                                                                                    |
| `SECRET`         | Si                      | Secreto de la aplicacion. No usar el valor de ejemplo en produccion.                                                         |
| `MONGO_URI`      | Si                      | URI de MongoDB para desarrollo/produccion.                                                                                   |
| `MONGO_TEST_URI` | No                      | URI exclusiva para tests. Solo se utiliza cuando `NODE_ENV=test`; si falta, se usa `mongodb://127.0.0.1:27017/shipnow_test`. |
| `NODE_ENV`       | Si                      | Entorno: `development`, `test` o `production`.                                                                               |

## Testing funcional

La suite usa **Mocha** como runner, **Chai** para aserciones y **Supertest** para
probar los endpoints de Express sin abrir un puerto HTTP. Cubre health check,
usuarios, productos, couriers, ordenes, entregas, mocks, logger y cargas de
archivos.

`@faker-js/faker` genera los datos usados por los factories de testing y por
`mocks.controller.js`. Como ese controlador forma parte del codigo que carga la
aplicacion, Faker es una dependencia de produccion y queda instalado con
`npm install` (tambien es necesario para ejecutar los tests).

```bash
npm test
```

El comando ejecuta los archivos `tests/**/*.test.js` y utiliza
`tests/setup.js` para conectar y desconectar MongoDB durante las pruebas.

Los tests que acceden a datos requieren MongoDB. Se recomienda definir
`MONGO_TEST_URI` con una base exclusiva. Si `MONGO_TEST_URI` no está definida,
la suite utiliza `mongodb://127.0.0.1:27017/shipnow_test` por defecto. Los hooks
globales conectan antes de la suite, desconectan al finalizar y eliminan después
de cada caso solamente los documentos registrados por ese test.

La aplicacion Express vive en `src/app.js`; la conexion a MongoDB y el
`listen()` se ejecutan desde `src/server.js`. Esta separacion permite importar
la app en Supertest sin iniciar el servidor ni conectarse dos veces.

### Endpoints

| Metodo | Ruta                          | Descripcion                        |
| ------ | ----------------------------- | ---------------------------------- |
| GET    | `/api/health`                 | Health check basico                |
| POST   | `/api/users`                  | Crear cliente                      |
| GET    | `/api/users`                  | Listar clientes                    |
| GET    | `/api/users/:id`              | Obtener cliente por id             |
| POST   | `/api/users/:id/documents`    | Subir un documento para un usuario |
| POST   | `/api/products`               | Crear producto                     |
| GET    | `/api/products`               | Listar productos                   |
| GET    | `/api/products/:id`           | Obtener producto por id            |
| POST   | `/api/couriers`               | Crear repartidor                   |
| GET    | `/api/couriers`               | Listar repartidores                |
| GET    | `/api/couriers/:id`           | Obtener repartidor por id          |
| POST   | `/api/couriers/:id/documents` | Subir la licencia de un repartidor |
| POST   | `/api/orders`                 | Crear envio                        |
| GET    | `/api/orders`                 | Listar envios                      |
| GET    | `/api/orders/:id`             | Obtener envio por id               |
| PATCH  | `/api/orders/:id/status`      | Cambiar estado de un envio         |
| POST   | `/api/orders/:id/proof`       | Subir un comprobante de entrega    |
| POST   | `/api/deliveries`             | Crear entrega (order + courier)    |
| GET    | `/api/deliveries`             | Listar entregas                    |
| GET    | `/api/deliveries/:id`         | Obtener entrega                    |
| PATCH  | `/api/deliveries/:id/status`  | Cambiar estado de una entrega      |

### Carga de archivos

Los endpoints de carga reciben `multipart/form-data`, aceptan un solo archivo
de hasta 5MB y permiten PDF, JPEG, PNG, WEBP y TXT. Los archivos se almacenan
en `uploads/documents`, `uploads/licenses` o `uploads/proofs`; MongoDB conserva
solo sus metadatos. El contenido de `uploads/` esta excluido mediante
`.gitignore`.

| Entidad | Endpoint                      | Campo de archivo | Campo `type`     |
| ------- | ----------------------------- | ---------------- | ---------------- |
| Usuario | `/api/users/:id/documents`    | `document`       | `user_document`  |
| Courier | `/api/couriers/:id/documents` | `license`        | `driver_license` |
| Orden   | `/api/orders/:id/proof`       | `proof`          | `delivery_proof` |

Ejemplo:

```bash
curl -X POST http://localhost:8080/api/orders/ORDER_ID/proof \
  -F "type=delivery_proof" \
  -F "proof=@./comprobante.pdf"
```

Si la validacion, la busqueda de la entidad o el guardado de metadatos falla,
el archivo temporal se elimina y el error usa el formato general de la API.

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
| GET    | `/api/mocks/Couriers`   | crea couriers de prueba SIN guardarlos en la base de datos   |
| POST   | `/api/mocks/Couriers`   | crea couriers de prueba y los guarda en la base de datos     |

### Todos los endpoints de mocks requieren un cuerpo JSON con la propiedad `mockResults`, que indica la cantidad de registros que se generarán.

Ejemplo para generar cinco usuarios sin guardarlos:

```bash
curl -X GET http://localhost:8080/api/mocks/Users \
  -H "Content-Type: application/json" \
  -d '{"mockResults":5}'
```

Ejemplo para generar y guardar cinco productos:

```bash
curl -X POST http://localhost:8080/api/mocks/Products \
  -H "Content-Type: application/json" \
  -d '{"mockResults":5}'
```

`mockResults` debe ser un numero mayor que cero

## Probar con Postman

En la raíz del repositorio se encuentra una colección lista para importar:
[`ShipNow API v1.postman_collection.json`](./ShipNow%20API%20v1.postman_collection.json).

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

## logger de errores

para el loggin de errores se utilizan las liberias winston y winston-daily-rotate-file, los niveles de log son:

```bash
const loggerLevels =
{
  fatal: 0,
  error: 1,
  warning: 2,
  info: 3,
  http: 4,
  debug: 5,
};
```

para probar el correcto funcionamiento del modulo de loggin si se iniciar el servidor con `NODE_ENV = development` o `NODE_ENV = test` se realiza una peticion get al endpoint `/api/loggerTest` y la consola debe devolver un log de cada uno de los niveles:

```bash
DD-MM-YYYY HH:mm:ss [info]: Mensaje de prueba de info
DD-MM-YYYY HH:mm:ss [warning]: Mensaje de prueba de warning
DD-MM-YYYY HH:mm:ss [error]: Mensaje de prueba de error
DD-MM-YYYY HH:mm:ss [fatal]: Mensaje de prueba de fatal
```

Ademas de guardar un log para los errores de tipo `error` y `fatal` no se subiran al repositorio ningun archivo .log ni ningun archivo que este dentro de la carpeta /log

se puede probar que los logs esten funcionando correctamente ingresando al endpoint `/api/loggerTest` el cual solo esta disponible en `development` y `test`

## Documentacion web

para poder acceder a la documentacion web que se creo utilizando Swagger se puede ingresar al endpoint `/api/docs` donde se podra encontrar una documentacion interactiva de cada uno de los endpoints, se documentaron los modulos:

- couriers
- deliveries
- loggertest
- mocks
- orders
- products
- schemas
- users

## Ejecutar con Docker Compose

Requisitos: Docker Desktop iniciado y Docker Compose disponible.

Compose ejecuta dos servicios: la API y MongoDB. La API espera
a que MongoDB supere su healthcheck antes de iniciar.

### Variables de entorno

En una instalación nueva, copia `.env.example` a `.env`:

Si ya tienes `.env`, conserva ese archivo.

Configura `SECRET` con un valor propio. Compose carga ese archivo
y establece las siguientes variables para la API:

- `NODE_ENV=production`
- `PORT=8080`
- `MONGO_URI=mongodb://mongo:27017/shipnow`

Esta ejecución utiliza MongoDB dentro de Docker. No utiliza la
conexión remota que pueda existir en `.env`, ni modifica ese archivo.

### Construcción y ejecución

Desde la raíz del proyecto, valida la configuración:

```bash
docker compose config
```

Construye la imagen de la API:

```bash
docker compose build
```

Inicia ambos servicios en segundo plano:

```bash
docker compose up -d
```

El puerto 8080 debe estar disponible.

### Verificación

Consulta el estado de los servicios:

```bash
docker compose ps
```

MongoDB debe aparecer como `healthy` y la API debe estar en ejecución.

Comprueba el endpoint de salud: `http://localhost:8080/api/health`

La respuesta debe contener `status: "up"`.

Swagger está disponible en http://localhost:8080/api/docs.

### Detener los servicios

```bash
docker compose down
```

Los datos de MongoDB, los archivos subidos y los logs se conservan
en volúmenes de Docker.

## Verificación de Criterios

- **Documentación Swagger:** Navegar a `http://localhost:8080/api/docs` con el servidor corriendo.
- **Suite de Tests:** Ejecutar `npm test` para correr los tests de integración con Mocha/Chai/Supertest.
- **Docker:** Ejecutar `docker compose up --build -d`, comprobar MongoDB como `healthy` con `docker compose ps` y consultar `http://localhost:8080/api/health`.
- **Mocks:** Con `NODE_ENV=development`, enviar `GET /api/mocks/Users` con el cuerpo `{"mockResults":5}` para generar datos sin guardarlos, o utilizar `POST` para generarlos y almacenarlos, esta misma logica funciona tambien con `courier, orders, products, deliveries`
- **Subida de Archivos:** `POST /api/users/:id/documents` enviando campo `document` (PDF/JPEG, máx 5MB).
