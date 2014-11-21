CREATE OR REPLACE PACKAGE "TASKER"."APP_SETTINGS"
AS
  /*******************************************************************************
  *
  * TASKER.APP_SETTINGS PACKAGE
  * @author Kerri Shotts
  * @version 0.1.0
  * @license MIT
  *
  * Provides get/set methods for settings to the Tasker app built for
  * PhoneGap Enterprise, published by Packt Publishing.
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
  * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
  PARTICULAR
  * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
  * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
  TORT
  * OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
  * OTHER DEALINGS IN THE SOFTWARE.
  *
  ******************************************************************************/
  FUNCTION get(
      setting_id VARCHAR2,
      def        VARCHAR2 DEFAULT NULL )
    RETURN VARCHAR2;
  PROCEDURE SET(
      setting_id VARCHAR2,
      v          VARCHAR2 );
END APP_SETTINGS;
/
CREATE OR REPLACE PACKAGE BODY "TASKER"."APP_SETTINGS"
AS
  /*******************************************************************************
  *
  * TASKER.APP_SETTINGS PACKAGE
  * @author Kerri Shotts
  * @version 0.1.0
  * @license MIT
  *
  * Provides get/set methods for settings to the Tasker app built for
  * PhoneGap Enterprise, published by Packt Publishing.
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
  * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
  PARTICULAR
  * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
  * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
  TORT
  * OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
  * OTHER DEALINGS IN THE SOFTWARE.
  *
  ******************************************************************************/
  /******************************************************************************
  *
  * PUBLIC METHODS
  *
  ******************************************************************************/
FUNCTION get(
    setting_id VARCHAR2,
    def        VARCHAR2 DEFAULT NULL )
  RETURN VARCHAR2
AS
  v VARCHAR2( 255 );
BEGIN
   SELECT value INTO v FROM tasker.settings WHERE id = setting_id;
  RETURN v;
EXCEPTION
WHEN no_data_found THEN
  RETURN def;
END get;
PROCEDURE SET(
    setting_id VARCHAR2,
    v          VARCHAR2 )
AS
  pragma autonomous_transaction;
  oldv VARCHAR2( 255 );
BEGIN
  oldv := get( setting_id );
   UPDATE tasker.settings SET value = v WHERE id = setting_id;
  COMMIT;
EXCEPTION
WHEN OTHERS THEN
   INSERT INTO tasker.settings
    ( id, value
    ) VALUES
    ( setting_id, v
    );
  COMMIT;
END SET;
END APP_SETTINGS;
/
