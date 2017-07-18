# formatted-response

Formatted Response is a simple JavaScript Class to return formatted response to your application.

It's developed to work whith or without promise.

## Installation

`npm install formatted-response --save` or `yarn add formatted-response`

## Configuration

The default configuration of Formatted Response will return you a status code, a type and data
All you can modify is located in the [Default Configuration File](config/index.js)

Here a complete example :

```js
const formattedResponse = require('formatted-response');
let Response = new formattedResponse({
    debug: true,
    types: {
         ok: 'alert-success',
         ko: 'alert-danger',
         warn: 'alert-warning'
    },
    get: {
         ok: '.GET.SUCCESS',
         ko: '.GET.ERROR',
         warn: '.GET.WARNING'
    },
    ok: {
         status: 200,
         suffix: '.SUCCESS'
    },
    ko: {
         status: 400,
         suffix: '.ERROR'
    },
    warn: {
         status: 403,
         suffix: '.WARNING'
    },
    auth: {
         error: {
             status: 401,
             suffix: '.ERROR'
         },
        success: {
            status: 200,
            suffix: '.SUCCESS'
        }
    }
});

console.log(Response.success('MY.DATA', {myData: "My data !"}))
```

## Examples

```js
const fr = require('formatted-response');
let Response = new fr();

// return {status: 200, message: 'MY.DATA.OK', type: 'success', data: {myDate: "My data !"}}
Response.success('MY.DATA', {myData: "My data !"});

// return {status: 200, message: 'MY.DATA.GET.OK', data: {myDate: "My data !"}}
Response.get('MY.DATA', {myData: "My data !"});

// return {status: 400, message: 'MY.DATA.KO', type: 'error', error: "My Error !"}
Response.error('MY.DATA', new Error('My Error !'));

// return {status: 403, message: 'MY.DATA.WARN', type: 'warning', error: "My Error !"}
Response.warning('MY.DATA', new Error('My Error !'));

// return {status: 200, message: 'MY.DATA', type: 'my-type', data: {myDate: "My data !"}}
Response.response('MY.DATA', {myDate: "My data !"}, 'my-type', 200);
```