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

# Prerequisites

The whole shebang depends on having [Node.js](https://nodejs.org/en/) installed... I'm running:

```bash
$ node -v
v12.18.4
```

## The concurrent-http-server is _required_ to run this demonstration

### See the GitHub [concurrent-http-server](https://github.com/krystalmonolith/concurrent-http-server) repository.

The concurrent-http-server project is a simple [Express](https://expressjs.com/) http server that returns a fixed set of 228 PNG images.

There are three primary REST endpoints and a PNG file BLOB retrieval endpoint.   

1. A REST endpoint that returns an array of strings enumerating the PNG filenames.
2. A REST endpoint that allows the server to delay the return of the BLOBs in the PNG BLOB endpoint up to one second to augment the visual aspect of the demonstration as well as show the advantages of concurrent retrieval over sequential retrieval. It accepts a number from 0-1000 milliseconds of delay.
3. A REST endpoint that that enables a random "503 Server Unavailable" failure in the PNG BLOB retrieval endpoint to allow experimenting with retries. It accepts a number from 0-100 representing the percentage of random failures. Set it to zero to disable random failures.      

<hr/>

# Cloning and Running the concurrent-http-server (Linux)

```bash
$ git clone https://github.com/krystalmonolith/concurrent-http-server.git
$ cd concurrent-http-server
$ npm install
$ npm start
```
If it is running correctly you should see:
```
$ npm start
concurrent-http-server listening at http://localhost:3000
```
<hr/>

# Cloning and running the concurrent-http Angular application

Once the concurrent-http-server Express server is running, the concurrent-http Angular application can be installed and run as follows:

```bash
$ git clone https://github.com/krystalmonolith/concurrent-http.git
$ cd concurrent-http
$ npm install
$ npm start
```

Generating the following output:

```
$ npm start

> concurrent-http@1.2.0 start
> ng serve

✔ Browser application bundle generation complete.

Initial Chunk Files | Names         |      Size
vendor.js           | vendor        |   4.02 MB
polyfills.js        | polyfills     | 128.51 kB
styles.css          | styles        |  77.82 kB
main.js             | main          |  55.92 kB
runtime.js          | runtime       |   6.63 kB

                    | Initial Total |   4.28 MB

Build at: 2021-09-01T19:33:41.631Z - Hash: 0dac07b335f7f4582e3d - Time: 9779ms

** Angular Live Development Server is listening on localhost:4200, open your browser on http://localhost:4200/ **


✔ Compiled successfully.
```
<hr/>

# Operational Description

As the above output says: Open the page at [http://localhost:4200/](http://localhost:4200/)

```
** Angular Live Development Server is listening on localhost:4200, open your browser on http://localhost:4200/ **
```

You should be presented a page that is initially blank with a title and three tabs: Click on any tab to initiate retries of the 228 PNG files from the server.

* When clicked the "RxJS concatAll()" tab demonstrates <strong>sequential</strong> retrieval of the 228 PNG files.
* When clicked the "RxJS mergeAll()" tab demonstrates <strong>concurrent</strong> retrieval of the 228 PNG files <strong>without any retries</strong>.
* When clicked the "RxJS mergeAll() with retry" tab demonstrates <strong>concurrent</strong> retrieval of the 228 PNG files <strong>with retries</strong>.

Above the images are two numeric spinners that control how the server responds:

* The "Server Random File %" spinner controls the percentage of the PNG file requests that fail with a "503 Service Unavailable" error. 
  * Set it to zero to disable random failures.
  * Set to a low number (1%-10%) to see some retrieval before a PNG file request failure occurs.
  * Set it higher to really screw up the PNG file requests.
  
* The "Server File Delay (msec)" spinner sets the delay the server introduces before responding to a PNG file request.
  * Set it to zero to disable the server PNG file request delay.
  * It defaults to 50 msec to best show the difference between sequential and concurrent retrievals.
  * Crank it up to 100 msec to see how much better concurrent retrieval handles long server computational delays.


<hr/>

# Source Code Description

![Module/Component/Service Relationship Diagram](https://github.com/krystalmonolith/concurrent-http/blob/master/graphviz/images/module-component-service-relationship.svg)

I started with an Angular CLI generated application with routing, then I added the Angular Material schematic.

### Components

Top level component `AppComponent` &lpar;[app.component.ts](https://github.com/krystalmonolith/concurrent-http/blob/master/src/app/app.component.ts) &amp; [app.component.html](https://github.com/krystalmonolith/concurrent-http/blob/master/src/app/app.component.html) &rpar; contains the Angular Material **&lt;mat-tab-group&gt;** component and the router outlet. When a **&lt;mat-tab&gt;** is clicked the router outlet displays one of:

* `ConcatComponent` &lpar; [concat.component.ts](https://github.com/krystalmonolith/concurrent-http/blob/master/src/app/components/concat/concat.component.ts) &amp; [concat.component.html](https://github.com/krystalmonolith/concurrent-http/blob/master/src/app/components/concat/concat.component.html) &rpar;
* `MergeComponent` &lpar; [merge.component.ts](https://github.com/krystalmonolith/concurrent-http/blob/master/src/app/components/merge/merge.component.ts) &amp; [merge.component.html](https://github.com/krystalmonolith/concurrent-http/blob/master/src/app/components/merge/merge.component.html) &rpar;
* `MergeRetryComponent` &lpar; [merge-retry.component.ts](https://github.com/krystalmonolith/concurrent-http/blob/master/src/app/components/merge-retry/merge-retry.component.ts) &amp; [merge-retry.component.html](https://github.com/krystalmonolith/concurrent-http/blob/master/src/app/components/merge-retry/merge-retry.component.html) &rpar;

`ConcatComponent`, `MergeComponent`,`MergeRetryComponent` are all composed of `ImageGridComponent` &lpar; [image-grid.component.ts](https://github.com/krystalmonolith/concurrent-http/blob/master/src/app/components/image-grid/image-grid.component.ts) &amp; [image-grid.component.html](https://github.com/krystalmonolith/concurrent-http/blob/master/src/app/components/image-grid/image-grid.component.html) &rpar; which uses an Angular Material **&lt;mat-grid-list&gt;** component to display the images.

`ImageGridComponent` is composed of a `ParameterFormComponent` &lpar; [parameter-form.component.ts](https://github.com/krystalmonolith/concurrent-http/blob/master/src/app/components/parameter-form/parameter-form.component.ts) &amp; [parameter-form.component.html](https://github.com/krystalmonolith/concurrent-http/blob/master/src/app/components/parameter-form/parameter-form.component.html) &rpar; and uses **&lt;mat-progress-bar&gt;** to display the retrieval progress.

### Image Retrieval Delegation

`ConcatComponent`, `MergeComponent`,`MergeRetryComponent` all contain delegate functions to perform the actual retrieval of the images via functions `ConcatComponent.loadImagesConcatAll`, `MergeComponent.loadImagesMergeAll`, and MergeRetryComponent.loadImagesMergeAllWithRetry respectively. These delegate functions are invoked as part of `ImageGridComponent.ngOnInit` invoking `ImageGridComponent.loadList`.

`ImageGridComponent.loadList` shown below uses `FileService.getFileList` service function to enumerate the file names of the image files, then passes the list of files to the `loadImageDelegate` to perform the actual image retrievals via the delegate functions noted above.

```
  loadList(): void {
    // Clear out the old images and error information.
    this.images = [];
    this.imageCount = 0;
    this.imagePercentage = 0;
    this.imageFetchError = undefined;
    this.imageFetchErrorFilename = undefined;
    this.elapsedTimeMsec = 0;

    // Fetch the list of files from FileService.
    this.fileService.getFileList()
      .subscribe(fileList => {
        // Call the image loading delegate function to attempt to load all the images in the 'fileList'.
        this.imageCount = fileList.length;
        this.loadStartTime = Date.now();
        this.loadImageDelegate!(fileList, this, this.pushImage).subscribe({
          error: err => {
            this.imageFetchError = `${err['status']} ${err['statusText']}`;
            this.imageFetchErrorFilename = err['url'];
          }
        });
      });
  }
```
### Sequential Image Retrieval Delegate using _concatAll_

Image retrieval delegate function `ConcatComponent.loadImagesConcatAll` shown below uses the RxJS `concatAll` operator to perform _sequential_ retrieval. It returns an 'outer' RxJS `Observable` that when subscribed uses the RXJS `from` function to create a stream of `Observable`... One `Observable` for each file name in the file list. 

The RxJS `Observable.pipe` function then takes each file name `Observable` and:
* First uses the RxJS `map` operator to transform the file name `Observable` into a PNG BLOB `ArrayBuffer` `Observable` via the `FileService.getFile` service function.
* Second uses the RxJS `concatAll` operator to _sequentially_ stream each PNG BLOB `ArrayBuffer` to the `pipe` function's subscriber.

The output of the `pipe` operator is then subscribed to push the PNG BLOB into the **&lt;mat-grid-list&gt;**, and chain any errors out the 'outer' `Observable` error handler, or log a message to the `Console` if everything 'completes' successfully.

(The `imagePusher` callback is responsible for encoding the PNG BLOB to BASE64 before inserting it into the array backing the **&lt;mat-grid-list&gt;**. See `ImageGridComponent.pushImage`) 


```
loadImagesConcatAll(fileList: Array<string>,
                      imageGridComponent: ImageGridComponent,
                      imagePusher: (imageGridComponent: ImageGridComponent, fileResponse: ArrayBuffer) => void): Observable<void> {
    return new Observable(subscriber => {
      from(fileList)
        .pipe(
          map((file: string) => this.fileService.getFile(file)),
          concatAll() // SEQUENTIAL !!!
        )
        .subscribe(
          (fileResponse: ArrayBuffer) => imagePusher(imageGridComponent, fileResponse),
          (err: any) => subscriber.error(err),
          () => console.log(`Image loading via concatAll() COMPLETE!`)
        );
    });
  }
}
```

### Concurrent Image Retrieval Delegate using _mergeAll_

Image retrieval delegate function `MergeComponent.loadImagesMergeAll` shown below uses the RxJS `mergeAll` operator to perform _concurrent_ retrieval.

```
  loadImagesMergeAll(fileList: Array<string>,
                     imageGridComponent: ImageGridComponent,
                     imagePusher: (imageGridComponent: ImageGridComponent, fileResponse: ArrayBuffer) => void): Observable<void> {
    return new Observable(subscriber => {
      from(fileList)
        .pipe(
          map((file: string) => this.fileService.getFile(file)),
          mergeAll(MergeComponent.CONCURRENT_GET_COUNT) // PARALLEL !!!
        )
        .subscribe(
          (fileResponse: ArrayBuffer) => imagePusher(imageGridComponent, fileResponse),
          (err: any) => subscriber.error(err),
          () => console.log(`Image loading via mergeAll() COMPLETE!`)
        );
    });
  }
```

`MergeComponent.loadImagesMergeAll` operates similarly to `ConcatComponent.loadImagesConcatAll` with two differences:

* It uses the RxJS `mergeAll` operator to _concurrently_ stream each PNG BLOB `ArrayBuffer` to the `pipe` function's subscriber.
* The RxJS `mergeAll` operator accepts the constant numeric parameter `MergeComponent.CONCURRENT_GET_COUNT` that limits the maximum number of concurrent retrievals to avoid overloading the server.

### Concurrent failure tolerant Image Retrieval Delegate using _mergeAll_ and _retry_

Image retrieval delegate function `MergeRetryComponent.loadImagesMergeAllWithRetry` shown below uses the RxJS `mergeAll` operator in conjunction with the RxJS `retry` operator to perform _concurrent_ retrieval that can tolerate network and server failures.

```
  loadImagesMergeAllWithRetry(fileList: Array<string>,
                              imageGridComponent: ImageGridComponent,
                              imagePusher: (imageGridComponent: ImageGridComponent, fileResponse: ArrayBuffer) => void): Observable<void> {
    return new Observable(subscriber => {
      from(fileList)
        .pipe(
          map((file: string) => this.fileService.getFile(file).pipe(retry(MergeRetryComponent.RETRY_COUNT))),
          mergeAll(MergeRetryComponent.CONCURRENT_GET_COUNT) // PARALLEL !!!
        )
        .subscribe(
          (fileResponse: ArrayBuffer) => imagePusher(imageGridComponent, fileResponse),
          (err: any) => subscriber.error(err),
          () => console.log(`Image loading via mergeAll() with retry() COMPLETE!`)
        );
    });
  }
```

`MergeRetryComponent.loadImagesMergeAllWithRetry` operates similarly to `MergeComponent.loadImagesMergeAll` with two differences:

* The retrieval of the PNG BLOB is automatically retried via the `pipe(retry(MergeRetryComponent.RETRY_COUNT))` appended to the `FileService.getFile` call inside the RxJS `map` operator.
* The RxJS `retry` operator accepts the constant numeric parameter `MergeComponent.RETRY_COUNT` that limits the maximum number of retrievals per PNG BLOB to avoid retrying forever.

(This is an example of a inner `pipe` within a `map` operator within an outer `pipe`... Moving the `retry` `pipe` to after the outer `pipe` and before the `subscribe` call retries _all_ the concurrent retrievals.)
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
