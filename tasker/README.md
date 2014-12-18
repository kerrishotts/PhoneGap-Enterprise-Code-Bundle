# Tasker Mobile APP

Unfortunately, the app is not complete;  there was not sufficient time before printing to get it in the desired state. That said, it still implements
communication with the backend in a secure manner, and displays several presentation techniques.

The app will be completed shortly.

## Files of Interest

 - Styles live in `www/css/style.css`
 - Other than `index.html`, there is *no* HTML file in the app.
 - `www/js/app.js` configures the RequireJS environment and kickstarts the app when Cordova is ready.
 - `www/js/app/main.js`, on the other hand, registers notifications and instantiates the dashboard view.
 - `www/js/app/config.js` has configuration settings that you'll find useful (baseURL and certificate fingerprints). Change as necessary.
 - `www/js/app/api` contains the API wrapper that communicates to the backend. All backend requests go through here.
 - `www/js/app/lib/store` contains the store -- this can be backed by the backend or by a mock (the latter is a stub). The store uses the api to communicate to the backend.
 - `www/js/models` contains the various data models used by the app
 - `www/js/templates` contains the various templates used to generate the application's views
 - `www/js/views` contains the various views used in the app.

## Notifications

The app relies on notifications heavily to manage application state. Notifications are used to trigger navigation changes (akin to routes), and notifications
are also used to notify any interested parties about changes in network state, authentication, and more. Whenever the app uses `GLOBALS.events`, this is what
is happening.

## Globals

So, yes, globals are bad. Mostly. Somethings are easier to have as globals, and you'll note that we've limited the information that is global to the application.
Configuration, session state (since there can only be one), the API (again, only one), etc., make sense as a global state, and so we use this to simply a few
things.

## Data Binding

When changing task information, data binding is used to ensure consistency between the visual state and the underlying state.

## Push Notifications

Unfortunately, push notifications are *not* supported in this version, although the text indicates it is. This feature is coming soon.

## Improvements

There's a lot that could be improved here -- and they are left as an exercise to the reader:

 * No offline capabilities
 * No caching of data
 * Inefficient data requests
 * Prettier forms and validation
