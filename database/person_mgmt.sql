PACKAGE PERSON_MGMT
AS
  /*******************************************************************************
  *
  * TASKER.USER_MGMT PACKAGE
  * @author Kerri Shotts
  * @version 0.1.0
  * @license MIT
  *
  * Provides person management functions to the Tasker app built for
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
  * CUSTOM TYPES
  *
  ******************************************************************************/
TYPE people_set IS TABLE OF tasker.person%ROWTYPE;
  /******************************************************************************
  *
  * FAUX CONSTANTS
  *
  ******************************************************************************/
  FUNCTION CAN_CREATE_PERSON RETURN VARCHAR2;
  FUNCTION CAN_MODIFY_PERSON RETURN VARCHAR2;

  /******************************************************************************
  *
  * PUBLIC METHODS
  *
  ******************************************************************************/
  FUNCTION create_person(
      p_from_user_id VARCHAR2,
      p_full_name    VARCHAR2,
      p_pref_name    VARCHAR2,
      p_as_user      VARCHAR2 DEFAULT NULL)
    RETURN INTEGER;

  PROCEDURE assign_administrator(
      p_administrator_id NUMBER,
      p_to_person        NUMBER,
      p_as_user          VARCHAR2 DEFAULT NULL );

  FUNCTION get_people_administered_by(
      p_administrator_id NUMBER )
    RETURN people_set pipelined;

  FUNCTION get_person (
    p_person_id NUMBER
  ) RETURN people_set pipelined;

  FUNCTION get_person_id_by_user_id(
    p_user_id VARCHAR2
  )
  RETURN NUMBER;

END PERSON_MGMT;
/


PACKAGE BODY PERSON_MGMT
AS
  /*******************************************************************************
  *
  * TASKER.USER_MGMT PACKAGE
  * @author Kerri Shotts
  * @version 0.1.0
  * @license MIT
  *
  * Provides person management functions to the Tasker app built for
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
  * FAUX CONSTANTS
  *
  ******************************************************************************/
FUNCTION CAN_CREATE_PERSON RETURN VARCHAR2 AS
BEGIN
  RETURN 'CAN_CREATE_PERSON';
END CAN_CREATE_PERSON;

FUNCTION CAN_MODIFY_PERSON RETURN VARCHAR2 AS
BEGIN
  RETURN 'CAN_MODIFY_PERSON';
END CAN_MODIFY_PERSON;
/******************************************************************************
*
* PUBLIC METHODS
*
******************************************************************************/
/**
 * create_person
 *
 * creates a person from a user record.
 *
 * @param p_from_user_id:varchar2    user id to create person from
 * @param p_full_name:varchar2       full name
 * @param p_pref_name:varchar2       preferred name
 * @param p_as_user:varchar2         acting as user
 * @return integer                   new person ID
 *
 ******************************************************************************/
FUNCTION create_person(
    p_from_user_id VARCHAR2,
    p_full_name    VARCHAR2,
    p_pref_name    VARCHAR2,
    p_as_user      VARCHAR2 DEFAULT NULL)
  RETURN INTEGER
AS
  PRAGMA AUTONOMOUS_TRANSACTION;
  new_id INTEGER;
BEGIN
  IF tasker.security.can_user ( p_as_user, CAN_CREATE_PERSON() ) THEN
    INSERT
    INTO person (
        id, user_id, full_name, pref_name, change_date, change_user
      ) VALUES (
        person_seq.NEXTVAL, p_from_user_id, p_full_name, p_pref_name,
        sysdate, p_as_user
      )
    RETURNING id INTO new_id;
    COMMIT;
    RETURN new_id;
  ELSE
    tasker.utils.E_ACCESS_DENIED();
  END IF;
  RETURN new_id;
END create_person;

/**
 * assign_administrator
 *
 * @param p_administrator_id:number     administrator to assign
 * @param p_to_person:number            person to assign administrator to
 * @param p_as_user:varchar2            acting as user
 *
 ******************************************************************************/
PROCEDURE assign_administrator
  (
    p_administrator_id NUMBER,
    p_to_person        NUMBER,
    p_as_user          VARCHAR2 DEFAULT NULL
  )
AS
  PRAGMA AUTONOMOUS_TRANSACTION;
BEGIN
  IF tasker.security.can_user ( p_as_user, CAN_MODIFY_PERSON() ) THEN
    UPDATE person
    SET administrator_id = p_administrator_id,
      change_date        = sysdate,
      change_user        = p_as_user
    WHERE id             = p_to_person;
    COMMIT;
  ELSE
    tasker.utils.E_ACCESS_DENIED();
  END IF;
END assign_administrator;

/**
 * get_people_administered_by
 *
 * returns a table of people administered by the specific individual
 *
 * @param p_administrator_id:number      administrator id
 * @param p_as_user:varchar2             acting as user
 *
 ******************************************************************************/
FUNCTION get_people_administered_by(
    p_administrator_id NUMBER
  )
  RETURN people_set pipelined
AS
BEGIN
  FOR r IN
  ( SELECT * FROM tasker.person WHERE administrator_id = nvl(p_administrator_id,administrator_id) )
  LOOP
    pipe row (r);
  END LOOP;
END get_people_administered_by;

/**
 * return a person specified by the ID
 */
FUNCTION get_person(
    p_person_id NUMBER
  )
  RETURN people_set pipelined
AS
BEGIN
  FOR r IN
  ( SELECT * FROM tasker.person WHERE id = p_person_id )
  LOOP
    pipe row (r);
  END LOOP;
END get_person;

/**
 * return a person specified by the user ID
 */
FUNCTION get_person_id_by_user_id(
  p_user_id VARCHAR2
)
RETURN NUMBER
AS
  person TASKER.person%ROWTYPE;
BEGIN
  SELECT * INTO person FROM tasker.person WHERE user_id = p_user_id;
  RETURN person.id;
EXCEPTION WHEN OTHERS THEN
  RETURN NULL;
END get_person_id_by_user_id;

END PERSON_MGMT;
/

