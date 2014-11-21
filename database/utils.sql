CREATE OR REPLACE PACKAGE "TASKER"."UTILS"
AS
  /*******************************************************************************
  *
  * TASKER.UTILS PACKAGE
  * @author Kerri Shotts
  * @version 0.1.0
  * @license MIT
  *
  * Provides utility functions to the Tasker app built for
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
  * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
  * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
  * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
  * OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
  * OTHER DEALINGS IN THE SOFTWARE.
  *
  ******************************************************************************/
  /******************************************************************************
  *
  * PUBLIC METHODS
  *
  ******************************************************************************/
  PROCEDURE E_ACCESS_DENIED;
  PROCEDURE E_NOT_FOUND;
  FUNCTION get_user_id_from_person_id(
      p_person_id INTEGER )
    RETURN VARCHAR2;
  FUNCTION get_person_id_from_user_id(
      p_user_id VARCHAR2 )
    RETURN INTEGER;
END UTILS;
/

CREATE OR REPLACE PACKAGE BODY "TASKER"."UTILS"
AS
  /*******************************************************************************
  *
  * TASKER.UTILS PACKAGE
  * @author Kerri Shotts
  * @version 0.1.0
  * @license MIT
  *
  * Provides utility functions to the Tasker app built for
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
  * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
  * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
  * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
  * OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
  * OTHER DEALINGS IN THE SOFTWARE.
  *
  ******************************************************************************/
  /******************************************************************************
  *
  * PUBLIC METHODS
  *
  ******************************************************************************/
PROCEDURE E_ACCESS_DENIED
AS
BEGIN
  raise_application_error ( -20403, 'Forbidden.' );
END E_ACCESS_DENIED;
PROCEDURE E_NOT_FOUND
AS
BEGIN
  raise_application_error ( -20404, 'No data found.' );
END E_NOT_FOUND;
/**
* get_user_id_from_person_id
*
* returns the user_id given a person's id
*
* @param p_person_id:integer   the person ID
* @return varchar2             the user ID
*/
FUNCTION get_user_id_from_person_id(
    p_person_id INTEGER )
  RETURN VARCHAR2
AS
  return_id VARCHAR2(32) := NULL;
BEGIN
  SELECT user_id INTO return_id FROM tasker.person WHERE id = p_person_id;
  IF return_id IS NULL THEN
    E_NOT_FOUND();
  END IF;
  RETURN return_id;
END get_user_id_from_person_id;
/**
* get_person_id_from_user_id
*
* returns the person_id given a person's user_id
*
* @param p_user_id:varchar2  the user id
* @return integer            the person id
*/
FUNCTION get_person_id_from_user_id(
    p_user_id VARCHAR2 )
  RETURN INTEGER
AS
  return_id INTEGER;
BEGIN
  SELECT id INTO return_id FROM tasker.person WHERE user_id = p_user_id;
  IF return_id IS NULL THEN
    E_NOT_FOUND();
  END IF;
  RETURN return_id;
END get_person_id_from_user_id;
END UTILS;
/

