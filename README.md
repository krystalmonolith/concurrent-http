# ConcurrentHttp
### A demonstration of different [RxJS](https://rxjs.dev/) methods for retrieving [BLOBs](https://en.wikipedia.org/wiki/Binary_large_object) (PNG files) via the Angular [HttpClient](https://angular.io/api/common/http/HttpClient) API.

<strong>_Sequential_</strong> retrieval is demonstrated using the RxJS [concatAll](https://rxjs.dev/api/operators/concatAll) operator. _Sequential_ means the retrieval of one BLOB does not commence until the retrieval of the previous BLOB has fully completed.

<strong>_Concurrent_</strong> retrieval is demonstrated using the RxJS [mergeAll](https://rxjs.dev/api/operators/mergeAll) operator. _Concurrent_ means the retrieval of many BLOBs can overlap and does not necessarily wait for the previous BLOB to complete. 
Concurrent retrieval can overload the server that is sending the BLOBs by asking for too many at once... The mergeAll operator accepts a parameter that sets a maximum limit on the number of concurrent retrievals active at any given time.

Computer networks are unreliable: Even with the 'reliable' TCP/IP protocol a request to a server can fail to complete for many reasons. This demonstration shows how the RxJS [retry](https://rxjs.dev/api/operators/retry) operator can be used in conjunction with the RxJS mergeAll operator to reattempt failed BLOB retrievals. For a more detailed discussion of retry tactics see [Angular University's "RxJs Error Handling: Complete Practical Guide"](https://blog.angular-university.io/rxjs-error-handling/).

### Important Caveat: This demonstration shows a difficult and overly complex method to load image PNG files into an Angular application. This is intentional for this demonstration so that the handling of BLOBs can be demonstrated. 

Normally you would use **&lt;img>** HTML tag as shown here in [this stackoverflow question](https://stackoverflow.com/questions/42793292/how-to-load-image-and-other-assets-in-angular-an-project) to display PNG image files.

_My original use case for concurrent retrieval was to load GZip'ed BLOBs of latitude/longitude coordinates that described the polygon outlines of geographical features._ YMMV!

<hr/>

# The concurrent-http-server is required to run this demonstration...

### See the GitHub [concurrent-http-server](https://github.com/krystalmonolith/concurrent-http-server) repository.

The concurrent-http-server project is a simple [Express](https://expressjs.com/) http server that returns a fixed set of 228 PNG images.

There are three primary REST endpoints and a PNG file BLOB retrieval endpoint.   

1. A REST endpoint that returns an array of strings enumerating the PNG filenames.
2. A REST endpoint that allows the server to delay the return of the BLOBs in the PNG BLOB endpoint up to one second to augment the visual aspect of the demonstration as well as show the advantages of concurrent retrieval over sequential retrieval. It accepts a number from 0-1000 milliseconds of delay.
3. A REST endpoint that that enables a random "503 Server Unavailable" failure in the PNG BLOB retrieval endpoint to allow experimenting with retries. It accepts a number from 0-100 representing the percentage of random failures. Set it to zero to disable random failures.      

## Cloning and Running the concurrent-http-server (Linux)

```bash
$ git clone https://github.com/krystalmonolith/concurrent-http-server.git
$ cd concurrent-http-server
$ npm install
$ npm start
```
If it is running correctly you should see:
```
concurrent-http-server listening at http://localhost:3000
```
<hr/>

# Angular Instructions

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 12.2.1.

#### *Hint:* The Angular CLI is installed using the [npm](https://www.npmjs.com/) utility which is _indirectly_ related to the [Node.js](https://nodejs.org/en/) project, i.e. when you install Node.js the npm utility is also installed. 

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
