/******************************************************************************
*
* Tasker Server (PhoneGap Enterprise Book)
* ----------------------------------------
*
* @author Kerri Shotts
* @version 0.1.0
* @license MIT
*
* Copyright (c) 2014 Packt Publishing
* Permission is hereby granted, free of charge, to any person obtaining a copy of this
* software and associated documentation files (the "Software"), to deal in the Software
* without restriction, including without limitation the rights to use, copy, modify,
* merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
* permit persons to whom the Software is furnished to do so, subject to the following
* conditions:
* The above copyright notice and this permission notice shall be included in all copies
* or substantial portions of the Software.
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
* INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
* PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
* LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
* OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
*
******************************************************************************/

var Errors = {};

function makeError ( message, code, overrideMessage ) {
	var theMessage = message;
	if (typeof optionalMessage !== "undefined") { theMessage = overrideMessage; }
	var err = new Error ( theMessage);
	err.status = code;
	return err;
}

Errors.HTTP_Unauthorized = function ( message ) { return makeError ( "Unauthorized",          401, message ); };
Errors.HTTP_Forbidden    = function ( message ) { return makeError ( "Forbidden",             403, message ); };
Errors.HTTP_NotFound     = function ( message ) { return makeError ( "Not Found",             404, message ); };
Errors.HTTP_Server_Error = function ( message ) { return makeError ( "Internal Server Error", 500, message ); };

module.exports = Errors;
