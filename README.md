# PhoneGap Enterprise Code Bundle

> The book this repository is for is undergoing active development. As such, this repository 
> should not to be considered stable.

This repository stores the code for the book entitled *PhoneGap Enterprise* published by Packt Publishing. You can 
purchase the book at [Pack's Site](http://www.packtpub.com/phonegap-enterprise/book). If you obtained this code package 
from Packt, you may wish to download the package from GitHub in order receive the most recent changes. The package is 
available at <https://github.com/kerrishotts/PhoneGap-Enterprise-Code-Bundle>.

> Note: This book does not cover the basics of PhoneGap, rather it covers issues specific to the enterprise. If you 
> need to learn about the basics of PhoneGap, you may want to purchase PhoneGap 3.x Mobile Application Development Hotshot 
> from [Packt Publishing](http://www.packtpub.com/phonegap-3-x-mobile-application-development-hotshot/book).

There are several directories in this code package -- they are described in further detail below:

- `database`: files related to the database backend (Oracle 11gR2 XE)
- `tasker-srv`: files related to the middle tier node.js web service (requires Node to run)
- `digital-ocean`: files related to the setup of the database and application server using Digital Ocean
- `ch5`: chapter 5 project: communication between PhoneGap and the backend
- `ch6`: chapter 6 project: responding to application events / storage options
- `ch7`: chapter 7 project: push notifications
- `tasker`: chapter 8 project: final Tasker version with full presentation, push notifications, etc.

## Cordova / PhoneGap Requirements

In order to build the mobile projects in this package, you'll need to install Cordova / PhoneGap. We won't go over how
to install Cordova in this document -- you can refer to Chapter 1 of 
[PhoneGap 3.x Mobile Application Development Hotshot](http://www.packtpub.com/phonegap-3-x-mobile-application-development-hotshot/book),
or you can refer to <http://cordova.apache.org/docs/en/edge/guide_cli_index.md.html#The%20Command-Line%20Interface>.

To build/run the code supplied for the book, the following software is required (divided by platform where appropriate):

### For iOS 
|   Windows    |    Linux    |      OS X      |
|--------------|-------------|----------------|
|              |             |IDE: Xcode 5.1+ |
|     N/A      |      N/A    |OS: OS X 10.8.4+|
|              |             |SDK: iOS 6+     |

### For Android
|   Windows     |    Linux    |      OS X      |
|---------------|-------------|----------------|
|IDE: Eclipse 3.6.2 or higher or Android Studio|||
|OS: XP or newer|Any modern distro supporting: GNU C library 2.7+, if 64-bit, must beable to run 32-bit apps. Ubunutu must be 8.04+| OS X 10.5.8+ |
|Java*: JDK 6 or higher                        |||

\*	A JRE is not sufficient. 

### For all platforms
|   Windows    |    Linux    |      OS X      |
|--------------|-------------|----------------|
|Apache Cordova / Adobe PhoneGap 3.6+         |||
|ANT 1.8+                                     |||


## About each chapter and project

### [Chapter 1: PhoneGap Enterprise Mobility](ch1)

There is no code for this chapter.

### [Chapter 2: Building the Data Store and Business Logic](ch2)

This chapter focuses on building the data store and business logic. The code for this chapter is located in `/database`.
Several scripts are contained within that will create a suitable data store. Sample data is also provided so that you
can test your app later on.

For this chapter, you'll need an Oracle Database 11gR2 instance -- XE, Standard One, Standard, or Enterprise will do.
XE is free and somewhat limited in enterprise features, but it works just fine as a development instance or even a
small production server. You'll need to install the database server first, and then run the scripts in the specified
order to recreate the system.

For instructions on how to install the data store and business logic, see the `README.md` file located within the
`/database` folder.

### [Chapter 3: Securing PhoneGap Apps](ch3)

There is no code for this chapter.

### [Chapter 4: Building the Middle Tier](ch4)

In chapter 4, we cover building a simple web server using Node.js. This server provides a RESTful-like interface
between the database and app clients. This server can be installed on the same server as the database, or it can be
installed on a separate server.

In order to install the middle tier, you'll need to install Node.js and copy the files from the `tasker-srv` directory
to a working location on the web server. You'll need to install all the requisite packages that the server depends
upon (`npm install`). In order to do so, you'll need to install the Oracle Instant Client on your machine so that the
server can communicate with your Oracle database. You'll also need to generate an SSL certificate for your server
as explained in Chapter 3.

Installation instructions are available in the `README.md` file in the `tasker-srv` directory.

### [Chapter 5: Communicating between the Mobile and Middle Tier](ch5)

This project focuses on communicating with the API designed in chapter 4. The app itself is *not* a complete Cordova
app -- it is designed solely to show how to send `XMLHttpRequest`s and parse the API responses. When running the app,
you should only expect to see raw API responses from the App requests to the API.

The project as delivered in this code package is *not* a complete Cordova project. You'll need to execute the following
commands in order to create a working Cordova Project:

```
$ cordova create com.packtpub.pgech5 TaskerCH5 my-ch5 --copy-from /path/to/code/package/ch5
$ cd my-ch5
$ cordova platform add ios android
$ cordova plugin add https://github.com/EddyVerbruggen/SSLCertificateChecker-PhoneGap-Plugin.git
$ cordova prepare
```

By default, the app will attempt to communicate with `pge-as.photokandy.com`, which is the host I used for testing. For
your own testing, you'll want to redirect this to your web server. You should alter the hostname contained within the
code in `my-ch5/www/js/app/main.js` to point to your web server instead (lines 121 and 131). If you don't, you'll inadvertently contact
my server... which is probably not your intent.

You'll also need to modify the certificate fingerprint in `main.js` (line 128) to match the fingerprint of any certificates you may have created. Otherwise, the app will generate an error when it is run.

To actually build and run the project:

```
$ cordova run android # or ios; if emulating use emulate instead of run
```

### [Chapter 6: Application Events and Storage](ch6)

This project focuses on handling application and network events such as `pause`, `resume`, `online`, and `offline`. It
also discusses a third-party SQLite plugin.

The project as delivered in this code package is *not* a complete Cordova project. You'll need to execute the following
commands in order to create a working Cordova Project:

```
$ cordova create com.packtpub.pgech6 TaskerCH6 my-ch6 --copy-from /path/to/code/package/ch6
$ cd my-ch6
$ cordova platform add ios android
$ cordova plugin add https://github.com/EddyVerbruggen/SSLCertificateChecker-PhoneGap-Plugin.git
$ cordova plugin add org.apache.cordova.globalization
$ cordova plugin add org.apache.cordova.device
$ cordova plugin add org.apache.cordova.network-information
$ cordova plugin add com.photokandy.localstorage
$ cordova plugin add https://github.com/brodysoft/Cordova-SQLitePlugin
$ cordova plugin add com.shazron.cordova.plugin.keychainutil
$ cordova prepare
```

As with Chapter 5, this project does not implement a complete application, but is simply a demo app showing some of the
technologies discussed in the chapter.

As with Chapter 5, be sure to update `main.js` to point to your server and update the certificate fingerprint prior to building and running.

### [Chapter 7: Push Notifications](ch7)

This chapter focuses on sending and receiving push notifications with Cordova. It is not a complete project; it displays
a very simple `alert` upon receipt of a push notification. In order to send push notifications, you'll need to follow
the directions present in Chapter 7 in order to set up a <boxcar.io> account. In order to send an example push,
see `ch7/sendPush.py`.

The project as delivered in this code package is *not* a complete Cordova project. You'll need to execute the following
commands in order to create a working Cordova Project:

```
$ cordova create com.packtpub.pgech7 TaskerCH7 my-ch7 --copy-from /path/to/code/package/ch7
$ cd my-ch7
$ cordova platform add ios android
cordova plugin add https://github.com/EddyVerbruggen/SSLCertificateChecker-PhoneGap-Plugin.git
cordova plugin add org.apache.cordova.globalization
cordova plugin add org.apache.cordova.device
cordova plugin add org.apache.cordova.network-information
cordova plugin add com.photokandy.localstorage
cordova plugin add https://github.com/brodysoft/Cordova-SQLitePlugin
cordova plugin add com.shazron.cordova.plugin.keychainutil
cordova plugin add https://github.com/boxcar/PushPlugin
$ cordova prepare
```

> *Note*:
>
> You'll need the Boxcar SDK, but we did have to modify the Boxcar.js file supplied in the SDK in order to fix a few 
> bugs. It's possible Boxcar will have updated their SDK to fix these issues, but if not, you'll want to use the 
> `/boxcar/Boxcar.js` file in this package instead.

#### Additional iOS Configuration

You'll need to open the project in Xcode at least once so that you can download the Push Notification entitlements 
you defined in the chapter. Open Xcode, navigate into the project's `platforms\ios` directory, and there should be an 
`.xcodeproj` file. Open it, and then open *Xcode* > *Preferences* > *Accounts*. Select your Apple Developer account,
and then click *View Details*. Once you do, a new screen should appear with a refresh button near the bottom-left. 
Click that and wait. After the process is complete you should have your push notification entitlements in the bottom 
list box (you may need to scroll to see them). Close out of the dialogs, and then proceed to build the project. After 
this point you can build the project using the Cordova CLI.

#### Additional Android Configuration

As per Boxcar's documentation:

> On Android, the Storage API used by SDK needs to be enabled manually in one of config files. To do that, the XML file 
> `platform/android/res/xml/config.xml` must have additional clause
>
> ```
> <plugin name="Storage" value="org.apache.cordova.Storage" />
> ```
>
> directly in the `<widget>` element.

### [Chapter 8: Presentation Techniques](ch8)

This chapter focuses on the varied components that go into a final Cordova app. This app is the final project, and
represents a complete implementation of the Tasker app. 

The project as delivered in this code package is *not* a complete Cordova project. You'll need to execute the following
commands in order to create a working Cordova Project:

```
$ cordova create com.packtpub.tasker Tasker my-tasker --copy-from /path/to/code/package/tasker
$ cd my-tasker
$ cordova platform add ios android
$ cordova plugin add https://github.com/EddyVerbruggen/SSLCertificateChecker-PhoneGap-Plugin.git
$ cordova plugin add org.apache.cordova.globalization
$ cordova plugin add org.apache.cordova.device
$ cordova plugin add org.apache.cordova.network-information
$ cordova plugin add com.photokandy.localstorage
$ cordova plugin add https://github.com/brodysoft/Cordova-SQLitePlugin
$ cordova plugin add com.shazron.cordova.plugin.keychainutil
$ cordova plugin add https://github.com/boxcar/PushPlugin
$ cordova prepare
```

> Be sure to follow the BoxCar integration steps from Chapter 7, and modify the hostname and SSL certificate fingerprints in `www/js/app/config.js`.

Be sure to update `config.js` to point to your server and update the certificate fingerprint prior to building and running.

[License](id:license)
---------------------

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
