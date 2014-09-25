CREATE OR REPLACE PACKAGE "TASKER"."USER_MGMT"
AS
  /*******************************************************************************
  *
  * TASKER.USER_MGMT PACKAGE
  * @author Kerri Shotts
  * @version 0.1.0
  * @license MIT
  *
  * Provides user management functions to the Tasker app built for
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
  FUNCTION CAN_CREATE_USER RETURN VARCHAR2;
  FUNCTION CAN_MODIFY_USER RETURN VARCHAR2;
  /******************************************************************************
  *
  * PUBLIC METHODS
  *
  ******************************************************************************/
  FUNCTION create_user(
      p_user_id  VARCHAR2,
      p_password VARCHAR2,
      p_as_user  VARCHAR2 DEFAULT NULL)
    RETURN VARCHAR2;
  PROCEDURE change_user_status(
      p_user_id VARCHAR2,
      p_status  VARCHAR2,
      p_as_user VARCHAR2 DEFAULT NULL);
  PROCEDURE change_user_password(
      p_user_id     VARCHAR2,
      p_oldPassword VARCHAR2,
      p_newPassword VARCHAR2,
      p_as_user     VARCHAR2 DEFAULT NULL);
  PROCEDURE unlock_user(
      p_user_id VARCHAR2,
      p_as_user VARCHAR2 DEFAULT NULL);
END USER_MGMT;
CREATE OR REPLACE PACKAGE BODY "TASKER"."USER_MGMT"
AS
  /*******************************************************************************
  *
  * TASKER.USER_MGMT PACKAGE
  * @author Kerri Shotts
  * @version 0.1.0
  * @license MIT
  *
  * Provides user management functions to the Tasker app built for
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
FUNCTION CAN_CREATE_USER RETURN VARCHAR2 AS
BEGIN
  RETURN 'CAN_CREATE_USER';
END CAN_CREATE_USER;

FUNCTION CAN_MODIFY_USER RETURN VARCHAR2 AS
BEGIN
  RETURN 'CAN_MODIFY_USER';
END CAN_MODIFY_USER;
/******************************************************************************
*
* PUBLIC METHODS
*
******************************************************************************/
/**
* create_user
*
* creates a user with the specified password. as_user should be the currently
* logged-in user
*
* @param p_user_id:varchar2   the user id to assign
* @param p_password:varchar2  the password to assign
* @param p_as_user:varchar2   the user to act as (this determined rights)
* @return varchar2            the ID of the created user
*
******************************************************************************/
FUNCTION create_user(
    p_user_id  VARCHAR2,
    p_password VARCHAR2,
    p_as_user  VARCHAR2 DEFAULT NULL)
  RETURN VARCHAR2
AS
PRAGMA AUTONOMOUS_TRANSACTION;
  new_salt VARCHAR2(4000);
  new_hash VARCHAR2(4000);
BEGIN
  -- generate a salt
  new_salt := tasker.security.gen_salt();
  -- and hash the password with it
  new_hash := tasker.security.gen_hash( p_password, new_salt );
  -- Verify the user has actual rights to create users
  IF tasker.security.can_user( p_as_user, CAN_CREATE_USER() ) THEN
    -- create the user
    INSERT
    INTO users (
        ID, password, salt, status, change_date, change_user, iter, len
      ) VALUES (
        p_user_id, new_hash, new_salt, 'A', sysdate, p_as_user,
        to_number( tasker.app_settings.get( 'DEFAULT_PWD_HASH_ITER', 4096 ) ),
        to_number( tasker.app_settings.get( 'PWD_HASH_LENGTH', 128 ) )
      );
      COMMIT;
  ELSE
    tasker.utils.E_ACCESS_DENIED();
  END IF;
  RETURN p_user_id;
END create_user;
/******************************************************************************
*
* change_user_status
*
* change a user from active to inactive and vice versa
*
* @param p_user_id:varchar2   user to change
* @param p_status:varchar2    (A)ctive / (I)nactive
* @param p_as_user:varchar2   acting as user
*
******************************************************************************/
PROCEDURE change_user_status
  (
    p_user_id VARCHAR2,
    p_status  VARCHAR2,
    p_as_user VARCHAR2 DEFAULT NULL
  )
AS
PRAGMA AUTONOMOUS_TRANSACTION;
BEGIN
  -- Verify the user has actual rights to modify users
  IF tasker.security.can_user( p_as_user, CAN_MODIFY_USER() ) THEN
    -- update the status
    UPDATE users
    SET status    = status,
      change_date = sysdate,
      change_user = p_as_user
    WHERE id      = p_user_id;
    COMMIT;
  ELSE
    tasker.utils.E_ACCESS_DENIED();
  END IF;
END change_user_status;
/**
* change_user_password
*
* Change the password for a given user. If as_user has administrative rights
* the oldPassword does not need to match; if the as_user is the user changing
* their password, the oldPassword does need to match. If the as_user is neither,
* access is denied.
*
* @param p_user_id:varchar2       user id to change password
* @param p_oldPassword:varchar2   old password
* @param p_newPassword:varchar2   new password
* @param p_as_user
*/
PROCEDURE change_user_password(
    p_user_id     VARCHAR2,
    p_oldPassword VARCHAR2,
    p_newPassword VARCHAR2,
    p_as_user     VARCHAR2 DEFAULT NULL )
AS
  PRAGMA AUTONOMOUS_TRANSACTION;
  new_salt VARCHAR2(4000);
  new_hash VARCHAR2(4000);
BEGIN
  new_salt := tasker.security.gen_salt();
  new_hash := tasker.security.gen_hash( p_newPassword, new_salt );
  IF tasker.security.can_user ( p_as_user, tasker.security.CAN_CHANGE_ANY_USER_PWD ) THEN
    UPDATE users
    SET password  = new_hash,
      salt        = new_salt,
      change_date = sysdate,
      change_user = p_as_user,
      iter = to_number( tasker.app_settings.get( 'DEFAULT_PWD_HASH_ITER', 4096 ) ),
      len =  to_number( tasker.app_settings.get( 'PWD_HASH_LENGTH', 128 ) )
    WHERE id      = p_user_id;
    COMMIT;
  ELSE
    IF p_user_id = p_as_user THEN
      IF tasker.security.verify_password( p_user_id, p_oldPassword ) = 'Y' THEN
        UPDATE users
        SET password  = new_hash,
          salt        = new_salt,
          change_date = sysdate,
          change_user = p_as_user,
      iter = to_number( tasker.app_settings.get( 'DEFAULT_PWD_HASH_ITER', 4096 ) ),
      len =  to_number( tasker.app_settings.get( 'PWD_HASH_LENGTH', 128 ) )
        WHERE id      = id;
        COMMIT;
      ELSE
    tasker.utils.E_ACCESS_DENIED();
      END IF;
    ELSE
    tasker.utils.E_ACCESS_DENIED();
    END IF;
  END IF;
END change_user_password;
/**
* unlock_user
*
* @param p_user_id:varchar2     user to unlock
* @param p_as_user:varchar2     as user
*
******************************************************************************/
PROCEDURE unlock_user(
    p_user_id VARCHAR2,
    p_as_user VARCHAR2 DEFAULT NULL )
AS
  PRAGMA AUTONOMOUS_TRANSACTION;
BEGIN
  IF tasker.security.can_user ( p_user_id, tasker.security.CAN_UNLOCK_USER() ) THEN
    UPDATE users SET failed_login_attempts = 0 WHERE id = p_user_id;
    COMMIT;
  ELSE
    tasker.utils.E_ACCESS_DENIED();
  END IF;
END unlock_user;
END USER_MGMT;

