# PhoneGap Enterprise Code Bundle

> The book this repository is for is undergoing active development. As such, this repository is not to be considered stable.

This repository stores the code for the book entitled PhoneGap Enterprise published by Packt Publishing. You can purchase the book at [Pack's Site]. If you obtained this code package from Packt, you may wish to download the package from GitHub in order receive the most recent changes. The package is available at <https://github.com/kerrishotts/PhoneGap-Enterprise-Code-Bundle>.

Note: This book does not cover the basics of PhoneGap, rather it covers issues specific to the enterprise. If you need to learn about the basics of PhoneGap, you migh want to puchase Phonegap 3.x Mobile Application Develoment from [Packt](http://www.packtpub.com/phonegap-3-x-mobile-application-development-hotshot/book).

There are several directories in this code package -- they are described in further detail below:

 * `database`: files related to the database backend (Oracle 11gR2 XE)
 * `tasker-srv`: files related to the middle tier node.js web service (requires Node to run)
 * `digital-ocean`: files related to the setup of the database and application server using Digital Ocean
 * `raml`: files related to the API setup of the middle tier
 * `template`: PhoneGap / Cordova Template for YASMF
 * `ch5`: chapter 5 project: communication between PhoneGap and the backend
 * `ch6`: chapter 6 project: responding to application events / storage options
 * `ch7`: chapter 7 project: push notifications
 * `tasker`: chapter 8 project: final Tasker version with full presentation, push notifications, etc.

For each Cordova project (`ch5`- `ch7`, `tasker`) only the `www` and `config.xml` files are provided. You'll need
to create a new Cordova project and copy the relevant files from this repository into your project. You'll
also need to add the requisite plugins and platforms in order to generate a working sample.

To do so:

	cordova create my-ch5 com.example.ch5 TaskerCH5 --copy-from code/package/ch5
	cd my-ch5
	cordova platform add ios android
	cordova plugin add ... # as specified below for each project
	cordova prepare
	cordova run ios # emulate, etc., on ios or android

> You should also check out [notes.md](./notes.md) within this repository -- there are important issues and discussions of which you should be aware.

## Plugins required for each project

### For chapter 5 (`ch5`):

	cordova plugin add https://github.com/EddyVerbruggen/SSLCertificateChecker-PhoneGap-Plugin.git

### For Chapter 6 (`ch6`):

	cordova plugin add https://github.com/EddyVerbruggen/SSLCertificateChecker-PhoneGap-Plugin.git
	cordova plugin add org.apache.cordova.globalization
	cordova plugin add org.apache.cordova.device
	cordova plugin add org.apache.cordova.network-information
	cordova plugin add com.photokandy.localstorage
	cordova plugin add https://github.com/brodysoft/Cordova-SQLitePlugin
	cordova plugin add com.shazron.cordova.plugin.keychainutil

### For Chapter 7 (`ch7`):

	cordova plugin add https://github.com/EddyVerbruggen/SSLCertificateChecker-PhoneGap-Plugin.git
	cordova plugin add org.apache.cordova.globalization
	cordova plugin add org.apache.cordova.device
	cordova plugin add org.apache.cordova.network-information
	cordova plugin add com.photokandy.localstorage
	cordova plugin add https://github.com/brodysoft/Cordova-SQLitePlugin
	cordova plugin add com.shazron.cordova.plugin.keychainutil
	cordova plugin add https://github.com/boxcar/PushPlugin

> *Note*:
>
> You'll need the Boxcar SDK, but we did have to modify the Boxcar.js file
> supplied in the SDK in order to fix a few bugs. It's possible Boxcar will
> have updated their SDK to fix these issues, but if not, you'll want to use
> the `/boxcar/Boxcar.js` file in this package instead.

#### Additional iOS Configuration

You'll need to open the project in Xcode at least once so that you can download the
Push Notification entitlements you defined in the chapter. Open Xcode, navigate into
the project's `platforms\ios` directory, and there should be an `.xcodeproj` file. Open
it, and then open *Xcode* > *Preferences* > *Accounts*. Select your Apple Developer
account, and then click *View Details*. Once you do, a new screen should appear with a
refresh button near the bottom-left. Click that and wait. After the process is complete
you should have your push notification entitlements in the second list box (you may
need to scroll to see them). Close out of the dialogs, and then proceed to build the
project. After this point you can build the project using the Cordova CLI.


#### Additional Android Configuration

As per Boxcar's documentation:

> On android Storage API used by SDK needs to be enabled manaully in one of config files.
> To do that XML file `platform/android/res/xml/config.xml` must have additional clause
>
>     <plugin name="Storage" value="org.apache.cordova.Storage" />
>
> directly in `<widget>` element.


### For Chapter 8 (`tasker`):

	cordova plugin add https://github.com/EddyVerbruggen/SSLCertificateChecker-PhoneGap-Plugin.git
	cordova plugin add org.apache.cordova.globalization
	cordova plugin add org.apache.cordova.network-information
	cordova plugin add com.photokandy.localstorage
	cordova plugin add https://github.com/brodysoft/Cordova-SQLitePlugin
	cordova plugin add com.shazron.cordova.plugin.keychainutil

## [License](id:license)

The code herein is licensed under the MIT license. You are free to with it as you will, provided the requirements of said license are met.

```
Copyright (c) 2014 Packt Publishing
Permission is hereby granted, free of charge, to any person obtaining a copy of this
software and associated documentation files (the "Software"), to deal in the Software
without restriction, including without limitation the rights to use, copy, modify,
merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to the following
conditions:
The above copyright notice and this permission notice shall be included in all copies
or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
```
