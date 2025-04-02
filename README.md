# Active Records Management API

## Descripción

Esta API procesa un conjunto de objetos que representan personas, les añade una fecha de ejecución y muestra los registros activos ordenados por una propiedad específica.

## Características

- Agrega una fecha de ejecución a cada objeto en el conjunto de datos.
- Filtra los registros activos en función de su estado.
- Ordena los registros activos según una propiedad especificada por el usuario.
- Documentación de API integrada con Swagger.

## Instalación

1. Clona este repositorio:
   ```sh
   git clone https://github.com/axelljt/challange2025.git

2. Navega al directorio del proyecto:
   ```sh
   cd challange2025

3. Instala las dependencias necesarias:
   ```sh
   npm install

## Ejecución de la aplicación

1. Compila el proyecto si estás utilizando TypeScript:
   ```sh
   npx tsc
2. utiliza ts-node directamente para ejecutar el archivo TypeScript:
   ```sh
   ts-node server.ts

3. Accede a la documentación de la API en Swagger desde tu navegador:
   ```sh
   http://localhost:3000/api-docs/

## Endpoints Principales
   GET /active-records

   Descripción: Recupera los registros activos ordenados por una propiedad específica.

   Query Parameters:

   sortProperty (string): Propiedad por la que se quiere ordenar los registros (e.g., Name, FavoriteMovie, FavoriteFood, ExecutionDate).  

## Ejemplos
   * http://localhost:3000/active-records?sortProperty=Name

## Respuestas
   * 200 OK: Devuelve la lista de registros activos ordenados.

   * 400 Bad Request: Falta el parámetro sortProperty.

   * 404 Not Found: No hay registros activos.

## Autor
   * Axell Jose Tejada Calderon Email: axelljt@gmail.com   