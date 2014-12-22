# Tasker Mobile APP

This app demonstrates various techniques described in Chapter 8 and the rest of the book:
 - Uses YASMF as the UI and utility framework
 - Uses view management
 - Uses notifications for navigation (route-like)
 - Uses a global data store (which talks to the back end)
 - Has persistent sessions (uses the iOS keychain if possible)
 - Checks for a secure connection using the SSLCertificateChecker plugin
 - Handles offline states by indicating to the user that they need a network connection
 - Basic HTML5 forms (uses a range control)
 - Dashboard shows two simple "charts" (if you can call them that) that indicates the percentage of tasks in various states. This is done with CSS styling.

## Known issues

So, like in all things, there are bugs. Here are the ones I know about, and I will endeavor to fix them over the upcoming days and weeks.

 * I tested on iOS mostly -- it's possible something will work strangely on Android. If I discover any such issues, I'll update the repo.
 * Can't edit title & description once saved (limitation of the API, really)
 * Uses `localStorage` on Android. This should live in internal storage, but as we all know, that's reasonably easy to access (with physical access to the device). That said, the keychain on iOS is accessible without about the same ease.
 * Comments aren't implemented in this version. Coming soon. That said, the app can auth, load and store data, so it shows the general process.
 * When creating a comment, the required fields aren't validated. Instead you'll get a Create Error. Will be fixed soon.
 * Lack of good error handling. As a demo app, this isn't a big deal, as error handling can become very complex (esp wrt to maintianing good user experience). That said, I will be adding some shortly.
 * Push notifications *not* supported. Boxcar released a new version of their SDK shortly before release, and I will be working to integrate that version into the app.

## Improvements

There's a lot that could be improved here -- and they are left as an exercise to the reader:

 * No offline capabilities
 * No caching of data
 * Inefficient data requests
 * Prettier forms and validation
 * More & better filters
 * Customizable filters

## Push Notifications

Unfortunately, push notifications are *not* supported in this version, although the text indicates it is. This feature is coming soon.

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

### Views

There are several views in the application, although these are more correctly named *view controllers*. They are as follows:

 - Login View (`www/js/views/login`): Displays the login interface. Uses data binding for username & password.
 - Dashboard (`www/js/views/dashboard`): The first view the user sees; this displays a graph indicating the overview of the user's tasks and tasks they have assigned to others.
 - Task List (`www/js/views/taskList`): Lists the tasks the user can see. Has a filter in place for tasks assigned to others or tasks assigned to the user.
 - Task View (`www/js/views/taskView`): Displays a single task. If the task is a new one, it acts as a "create task" view; and if it is an existing one, it acts as an "edit task" view.
 - Task Comments (`www/js/views/taskComments`): Displays the comments for a task.
 - Add Comment (`?`): Adds a comment to a task.

> **Note:** The *styling* for these views is handled in `css/style.css`. The templates for these views is in the `template.js` file that is in the same directory as the `view.js` file.


## Notifications

The app relies on notifications heavily to manage application state. Notifications are used to trigger navigation changes (akin to routes), and notifications
are also used to notify any interested parties about changes in network state, authentication, and more. Whenever the app uses `GLOBALS.events`, this is what
is happening.

The various notifications that are present in the system are as follows:

* Authentication-related - registered in `app.start`, but handlers attached in various places
    * `APP:needsLogin`: fired when the app notices that it needs an authenticated session.
    * `APP:needsLoginUI`: fired when the app requests the login user interface to become visible
    * `login:auth`: fired when the user attempts to authenticate with their username and password
    * `login:authCancel`: fired when the user cancels their authentication request
    * `login:response`: Fired when the server responds with an authentication respone
    * `login:good`: indicates a good login
    * `login:fail`: indicates a bad login
    * `login:dismiss`: dismisses any login user interface
    * `login:sessionLoaded`: fired when a session is loaded from local storage (or the keychain)
    * `login:logout": indicates that the user is logged out
    * `APP:logout": fired when the user requests a logout
* Blocking - registered and listenened for in `app.start`
    * `APP:block`: fired when the app needs to block user interaction for some reason (like logging in). This displays a spinner over the interface.
    * `APP:unblock`: fired when the app no longer needs to block user interaction
* Navigation-related - registered and listened for in `app.start`
    * `APP:NAV:back`: Fired whenever the user presses the back button in order to go back on the view stack.
    * `APP:NAV:viewTasks`: Fired whenever the app wants to view the user's tasks. First parameter must be either "my-tasks" or "other-tasks".
    * `APP:NAV:editTask`: Fired whenever the app wants to edit a specific task. The first parameter must be the task's ID.
    * `APP:NAV:createTask`: Fired whenever the app wants to create a new task.
    * `APP:NAV:viewComments`: Fired whenever the app wants to view comments for a task. First parameter must be the task's ID.
    * `APP:NAV:addComment`: Fired whenever the app wants to add a new comment. First parameter must be the task's ID.


## Globals

So, yes, globals are bad. Mostly. Some things are easier to have as globals, and you'll note that we've limited the information that is global to the application.
Configuration, session state (since there can only be one), the API (again, only one), etc., make sense as a global state, and so we use this to simply a few
things.



