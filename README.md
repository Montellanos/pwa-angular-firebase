# Codelab Progressive WEB APP 
# Mobile Bootcamp Santa Cruz

Los requisitos de software para este codelab son los siguientes
  - Node.js >=6 (https://nodejs.org/es/)
  - Angular cli (npm install -g @angular-cli)
  - Google Chorme =>54 
  - Ligthouse Extensión para Chorme (https://goo.gl/HqjUDK)
  - Firebase tools (npm install -g firebase-tools)
  - Git para windows (https://git-scm.com/download/win)
  - Visual Studio Code (https://code.visualstudio.com/) u otro editor de texto
  - Ganas de aprender :-)

### Instalación

Todos los comandos a ejecutar se realizan en la Git Bash 
Crear un nuevo proyecto de angular, se asigna un nombre arbitrario (pwa-angular-firebase) puede reemplazar por el que deseen, esto crea la estructura del proyecto e instala las dependencias necesarias, hay que tenerle paciencia, incluido la creacion de rutas
```sh
$ ng new pwa-angular-firebase --routing
```
Para poder levantar el servidor una vez termine el comando anterior
```sh
$ cd pwa-angular-firebase
$ ng serve
```
Con esto tenemos levantado nuestro servidor, podemos verificar ingresando desde el navegador a http://localhost:4200/

# PRIMERA PARTE

### Creando el instalador de PWA
Para poder crear el instalador de nuestra aplicación requerimos los siguientes recursos graficos, que son el icono de nuestra aplicación, los mismo deben ser en un formato especifico y con dimensiones especificas, se detalla a continuación:
| Nombre | Tipo | Dimensiones (pixeles) 
| ------ | ------ | ------ 
| android-chrome-36x36 | image/png | 36x36 
| android-chrome-48x48 | image/png | 48x48 
| android-chrome-72x72 | image/png | 72x72 
| android-chrome-96x96 | image/png | 96x96 
| android-chrome-144x144 | image/png | 144x144 
| android-chrome-192x192 | image/png | 192x192 
| android-chrome-512x512 | image/png | 512x512 
| ios-safari-152x152 | image/png | 152x152 
Se recomiendan iconos cuadrados con bordes redondeados, esto debido a que en el iphone todos los iconos se formatean y si es redondo por ejemplo se pone una sombra negra por detras
**Todos estos archivos deben estar ubicados en la carpeta de recursos de angular, crear la carpeta llamada icons**, la ruta en este caso seria
**pwa-angular-firebase/src/assets/icons**
### Desarrollo
**Creando el instalador para android**
Crear un archivo manifest.json en la raiz del proyecto 
**angular pwa-angular-firebase/src**
Este archivo debe contener el siguiente codigo:
```code
{
    "name": "Mi Primer PWA", 
    "short_name": "PWA", 
    "theme_color": "#FFFFFF",
    "background_color": "#FFFFFF",
    "start_url": "./index.html",
    "scope": "/",
    "display": "standalone",
    "orientation": "portrait",
    "icons": [{
            "src": "./assets/icons/android-chrome-36x36.png",
            "sizes": "36x36",
            "type": "image/png"
        },
        {
            "src": "./assets/icons/android-chrome-48x48.png",
            "sizes": "48x48",
            "type": "image/png"
        },
        {
            "src": "./assets/icons/android-chrome-72x72.png",
            "sizes": "72x72",
            "type": "image/png"
        },
        {
            "src": "./assets/icons/android-chrome-96x96.png",
            "sizes": "96x96",
            "type": "image/png"
        },
        {
            "src": "./assets/icons/android-chrome-144x144.png",
            "sizes": "144x144",
            "type": "image/png"
        },
        {
            "src": "./assets/icons/android-chrome-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "./assets/icons/android-chrome-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ]
}
```
Una vez teniendo todo el archivo manifest.json listo, procedemos a importar el archivo desde la pagina principal de la aplicación (index.html), procedemos a agregar la siguiente linea en el codigo
```code
<head>
    ...
    <link rel="manifest" href="./manifest.json">
    ...
</head>
```
Como paso final debemos modificar el archivo **.angular-cli.json**, esto se hace para que se pueda consumir recursos desde la raíz, procedemos a autorizar el archivo manifest.json
```code
.....
"assets": [
    "assets",
    "favicon.ico",
    "manifest.json"  //<--agregamos el archivo
],
...        
```
Con esto ya tenemos el instalador de aplicación para los dispositivos que corren sobre android :-)

**Creando el instalador par ios**
Para poder crear el instalador para safari debemos de agregar lineas al archivo principal de la aplicación (index.html)
```code
<head>
    ....
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="application-name" content="Mi Primer PWA">
    <meta name="apple-mobile-web-app-title" content="PWA">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="msapplication-starturl" content="index.html">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="msapplication-navbutton-color" content="#FFFFFF">
    <link rel="icon" type="image/png" sizes="152x152" href="./assets/icons/ios-safari-152x152.png">
    <link rel="apple-touch-icon" type="image/png" sizes="152x152" href="./assets/icons/ios-safari-152x152.png">
</head>
```
Con esto tenemos listo el instalador para IOS :-)
#### Service Worker (Funcionamiento Offline)
Uno de los funcionamientos más resaltables de las pwa´s es su funcionamiento offline, pero esto debemos programarlo para que funcione. Lo dividiremos por pasos para su mayor comprensión.
**Paso 1**
Crear el archivo de los services worker para programar las funciones que necesitamos (sw.js), esto debe hacerse en la raiz del proyecto angular, debe contener el siguiente codigo
**angular pwa-angular-firebase/src**

```code
const precacheFiles = [
    './',
    'index.html'
];
var CACHE_NAME = 'v1';
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache) {
            return cache.addAll(precacheFiles);
        })
    );
});
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
        .then(function(response) {
            if (response) {
                return response;
            }
            return fetch(event.request);
        })
    );
});
self.addEventListener('activate', function(event) {
    var cacheWhitelist = ['v1'];
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
```
Autorizamos el uso del archivo sw.js modificando el archivo **.angular-cli.json**.
```code
.....
"assets": [
    "assets",
    "favicon.ico",
    "manifest.json",
    "sw.js" //<--agregamos el archivo
],
...        
```
**Paso 2**
Instalamos el service worker para que este disponible, comprobando que el navegador lo soporte, para eso modificamos el archivo **index.html** del proyecto de angular. Agregamos el siguiente codigo como si importaramos un script normal
```code
.....
<script>
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').then(
            function(registration) {}).catch(function(err) {});
    }
</script>
.....
```
Con esto verificamos si el navegador soporta los service worker, si soporta instala el mismo. :-)

**CON ESTO YA TENEMOS NUESTRA PWA LISTA PARA INSTALARSE**

# SEGUNDA PARTE

**Desplegando la app con firebase**
SIGA LOS PASOS DEL INSTRUCTOR..... :-P

Gracias y bienvenidos al mundo de las PWA`S

License
----

MIT


**Hazlo simple: tan simple como sea posible, pero no más.** 
**Albert Einstein**
