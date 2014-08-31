# Boxcar SDK Modifications

The original `boxcar.js` file is Copyright (C) 2014 ProcessOne. Due to several bugs and
feature shortcomings, we have modified the file accordingly. Hopefully these features
have made it into Boxcar's official SDK, but if not, you'll need to use the file contained
within this directory instead.

## Changes

The following changes have been made:

- Code formatting cleaned up
- Code issues and warnings cleaned up (missing semicolons, implicit blocks on if/then, etc.)
- Comments have been added to the public (and some private) methods to assist with coding
- Database is now at v2.0 in order to make the `sound` field optional and to allow a new
  field for storage of `json` data. This latter field stores the complete object including
  any custom data fields. **NOTE:** There's no code here to handle upgrading an existing
  database -- you'll need to do that yourself. Either `DROP TABLE pushes` or `ALTER TABLE`
  to match the code. For applications that have never used Boxcar before, this is not
  an issue.
- Notification callbacks receive the new `json` field which contains the entire notification
  object. Use `JSON.parse` to parse it into an object before accessing its properties.
- Fixed several bugs, including issues with reversed error/success callbacks (on
  transactions). Cleaned up some equality checks and undefined checks.
- Added additional query fields to `getReceivedMessages`.
- Fixed bug where passing the device's UUID to `registerDevice` would fail.

## License

Original code Copyright (C) 2014 ProcessOne. Changes by Kerri Shotts are under the original
license. You need to have a Boxcar account and download the SDK in order to have a license
to utilize the enclosed `Boxcar.js` file.
