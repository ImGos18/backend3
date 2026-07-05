# Pree entrega 1

para esta preentrega se crearon algunas validaciones que estaban por hacer como la de validar si el usuario tenia un rol valido al momento de crearse, asi como tambien se creo la funcion para llenar una base de datos de usuarios con mocks

# instalacion

copia este repositorio con git clone y utiliza el comando npm install para instalar dependencias, luego debes crear fuera de la carpeta src un archivo con variables de entorno llamado .env.example que debe contener las siguientes variables para que el programa arranque

- **PORT**: es el puerto en el que correra el servidor
- **SECRET**: es el secreto para mas adelante firmar los json web token
- **MONGO_URI**: sera el link de conexion a mongo Atlas, sin este el programa no levantara porque no lograra establecer conexion con la db
- **NODE_ENV**: nos indicara en que entorno nos encontramos, si desarrollo o produccion

todas estas variables son necesarias ya que si falta alguna de ellas el programa no levantara.

para iniciar el programa utiliza `npm run start`

## logica

el proyecto esta distribuido de esta forma porque al ser modular lo vuelve escalable y mucho mas mantenible, al tener separada la logica de userService y userRepositori para delegar funciones a cada capa donde corresponde, mientras el userRepository se encarga de crear el usuario, el userService se encarga de validar campos y ver que todo este bien antes de ser creado, en este caso solo valida el rol del usuario
