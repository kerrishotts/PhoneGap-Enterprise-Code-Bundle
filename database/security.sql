PACKAGE SECURITY
AS
  /*******************************************************************************
  *
  * TASKER.SECURITY PACKAGE
  * @author Kerri Shotts
  * @version 0.1.0
  * @license MIT
  *
  * Provides security functions to the Tasker app built for PhoneGap Enterprise,
  * published by Packt Publishing.
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
  /** faux constants **/
  FUNCTION CAN_CHANGE_ANY_USER_PWD RETURN VARCHAR2;
  FUNCTION CAN_UNLOCK_USER RETURN VARCHAR2;

  /** methods **/
  FUNCTION authenticate_user(
      p_user_id   VARCHAR2, p_candidate VARCHAR2,
      p_session_id OUT NUMBER, p_next_token OUT VARCHAR2,
      p_hmac_secret OUT VARCHAR2, p_person_id OUT NUMBER ) RETURN VARCHAR2;

  FUNCTION verify_token(
      p_session_id NUMBER, p_token      VARCHAR2,
      p_auth_user OUT VARCHAR2, p_next_token OUT VARCHAR2,
      p_hmac_token OUT VARCHAR2, p_person_id OUT NUMBER)
    RETURN VARCHAR2;

  FUNCTION verify_password(
      p_user_id   VARCHAR2, p_candidate VARCHAR2 ) RETURN VARCHAR2;

  FUNCTION can_user(
      p_user_id   VARCHAR2 DEFAULT NULL, p_privilege VARCHAR2 ) RETURN BOOLEAN;

  FUNCTION can_user_sql(
      p_user_id   VARCHAR2 DEFAULT NULL, p_privilege VARCHAR2 ) RETURN VARCHAR2;

  FUNCTION gen_hash(
      p_password   VARCHAR2, p_salt       VARCHAR2,
      p_iterations INTEGER DEFAULT NULL,
      p_length     INTEGER DEFAULT NULL )
    RETURN VARCHAR2;

  FUNCTION gen_salt RETURN VARCHAR2;

  PROCEDURE end_session( p_session_id NUMBER );
END SECURITY;
/

PACKAGE BODY SECURITY
AS
  /*******************************************************************************
  *
  * TASKER.SECURITY PACKAGE
  * @author Kerri Shotts
  * @version 0.1.0
  * @license MIT
  *
  * Provides security functions to the Tasker app built for PhoneGap Enterprise,
  * published by Packt Publishing.
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
FUNCTION CAN_CHANGE_ANY_USER_PWD RETURN VARCHAR2 AS
BEGIN
  RETURN 'CAN_CHANGE_ANY_USER_PWD';
END;
FUNCTION CAN_UNLOCK_USER RETURN VARCHAR2 AS
BEGIN
  RETURN 'CAN_UNLOCK_USER';
END;

/******************************************************************************
*
* PRIVATE METHODS
*
******************************************************************************/

/**
* pbkdf2
* from: http://mikepargeter.wordpress.com/2012/11/26/pbkdf2-in-oracle/
*
* @private
* @param p_password:varchar2  the password to hash
* @param p_salt:varchar2      the salt to use
* @param p_count:integer      how many times to iterate the hash
* @param p_key_length:integer how long the key should be
* @return varchar2            the hash, in hexadecimal format
*
******************************************************************************/
FUNCTION pbkdf2(
    p_password IN VARCHAR2,
    p_salt IN VARCHAR2,
    p_count IN INTEGER,
    p_key_length IN INTEGER )
  RETURN VARCHAR2
IS
  l_block_count INTEGER;
  l_last RAW( 32767 );
  l_xorsum RAW( 32767 );
  l_result RAW( 32767 );
BEGIN
  l_block_count := ceil( p_key_length / 20 ); -- 20 bytes for SHA1.
  FOR i IN 1..l_block_count
  LOOP
    l_last := utl_raw.concat( utl_raw.cast_to_raw( p_salt ),
    utl_raw.cast_from_binary_integer( i, utl_raw.big_endian ) );
    l_xorsum := NULL;
    FOR j IN 1..p_count
    LOOP
      l_last := dbms_crypto.mac( l_last, dbms_crypto.hmac_sh1, utl_raw.cast_to_raw(
      p_password ) );
      IF l_xorsum IS NULL THEN
        l_xorsum := l_last;
      ELSE
        l_xorsum := utl_raw.bit_xor( l_xorsum, l_last );
      END IF;
    END LOOP;
    l_result := utl_raw.concat( l_result, l_xorsum );
  END LOOP;
  RETURN rawtohex( utl_raw.substr( l_result, 1, p_key_length ) );
END pbkdf2;

/******************************************************************************
 *
 * update_failed_login_for_user
 *
 * Updates the failed login count for a specific user by adding one
 *
 * @private
 * @autonomous
 * @param p_user_id:varchar2 user to update
 *
 ******************************************************************************/
PROCEDURE update_failed_login_for_user(
    p_user_id VARCHAR2 )
AS
  PRAGMA AUTONOMOUS_TRANSACTION;
BEGIN
   UPDATE tasker.users
  SET failed_login_attempts = failed_login_attempts + 1
    WHERE id = p_user_id;
  COMMIT;
END update_failed_login_for_user;

/******************************************************************************
 *
 *    PUBLIC METHODS
 *
 ******************************************************************************/

 /**
 * verify_password
 *
 * Verifies that the candidate password is valid for the specific user. Returns
 * TRUE if valid; FALSE if not. If more than MAX_FAILED_LOGINS[10] is passed,
 * the authentication attempt always fails until the number is reset.
 *
 * @param p_user_id:varchar2      the user to test against
 * @param p_candidate:varchar2    the candidate password to test
 * @return boolean                TRUE if valid; FALSE if not
 *
 ******************************************************************************/
FUNCTION verify_password(
    p_user_id   VARCHAR2,
    p_candidate VARCHAR2 )
  RETURN VARCHAR2
AS
  salt                  VARCHAR2( 4000 );
  stored_hash           VARCHAR2( 4000 );
  hash                  VARCHAR2( 4000 );
  failed_login_attempts INTEGER;
  iter                  NUMBER;
  LEN                   NUMBER;
BEGIN
  -- get the stored salt and password for the user; false if no such user
  BEGIN
     SELECT password, salt, failed_login_attempts, iter, LEN
       INTO stored_hash, salt, failed_login_attempts, iter, LEN
       FROM TASKER.users
      WHERE id = p_user_id;
  EXCEPTION
  WHEN NO_DATA_FOUND THEN
    RETURN 'N';
  WHEN OTHERS THEN
    RAISE;
  END;
  -- if the # of failed login attempts is greater than allowed, fail out anyway
  IF failed_login_attempts > to_number( tasker.app_settings.get( 'MAX_FAILED_LOGINS', 10 ) ) THEN
    RETURN 'N';
  END IF;
  -- hash the candidate
  hash := gen_hash( p_candidate, salt, iter, LEN );
  -- return if they match or not
  IF hash = stored_hash THEN
    RETURN 'Y';
  ELSE
    update_failed_login_for_user( p_user_id );
    RETURN 'N';
  END IF;
END verify_password;

/**
 * get_username
 *
 * returns the username authenticated with authenticate_user below
 */
FUNCTION get_username
  RETURN VARCHAR2
AS
  user_id VARCHAR2(32);
BEGIN
  SELECT sys_context('Tasker_Ctx', 'as_user')
    INTO user_id
    FROM DUAL;
  RETURN user_id;
END;

/******************************************************************************
 *
 * can_user
 *
 * determines if a user has rights for a specific action.
 *
 * @param p_user_id:varchar2     the user to check
 * @param p_privilege:varchar2   the action to check
 * @return boolean               true if the user can perform the action
 *
 ******************************************************************************/
FUNCTION can_user(
    p_user_id VARCHAR2 DEFAULT NULL,
    p_privilege VARCHAR2 )
  RETURN BOOLEAN
AS
  i_user_id VARCHAR2(32);
  has_granted_privilege BOOLEAN := FALSE;
BEGIN
  i_user_id := get_username();
  IF p_user_id IS NOT NULL THEN
    i_user_id := p_user_id;
  END IF;
  FOR r IN ( SELECT role_id FROM user_roles WHERE user_id = i_user_id ) LOOP
    FOR p IN
    (
       SELECT privilege, granted
         FROM roles
        WHERE id = r.role_id
        AND privilege = p_privilege
    ) LOOP
      IF p.granted = 'Y' THEN
        has_granted_privilege := TRUE;
      END IF;
    END LOOP;
  END LOOP;
  RETURN has_granted_privilege;
END can_user;

/**
 * equivalent to can_user, but returns Y/N instead of TRUE/FALSE,
 * which works better in SQL statements
 */
FUNCTION can_user_sql(
    p_user_id VARCHAR2 DEFAULT NULL,
    p_privilege VARCHAR2 )
  RETURN VARCHAR2
AS
BEGIN
  IF can_user( p_user_id, p_privilege ) THEN
    RETURN 'Y';
  ELSE
    RETURN 'N';
  END IF;
END;

/**
 * gen_salt
 *
 * Returns PWD_SALT_LENGTH random bytes suitable for a salt
 * 48 by default if no setting exists for PWD_SALT_LENGTH
 *
 * @returns VARCHAR2
 *
 ******************************************************************************/
FUNCTION gen_salt
  RETURN VARCHAR2
AS
BEGIN
  RETURN UTL_RAW.CAST_TO_VARCHAR2( UTL_ENCODE.BASE64_ENCODE( SYS.dbms_crypto.randombytes(
  to_number( tasker.app_settings.get( 'PWD_SALT_LENGTH', 48 ) ) ) ) );
END gen_salt;

/**
* gen_hash
*
* Hashes a password and salt using PBKDF2. Iterates the number of times specified
* by DEFAULT_PWD_HASH_ITER (default 4096) and generates hashs of length PWD_HASH_LENGTH
* (default 128)
*
* @param p_password:varchar2  the password to hash
* @param p_salt:varchar2      the salt to use (use gen_salt)
* @return varchar2            the hash
*
******************************************************************************/
FUNCTION gen_hash(
    p_password   VARCHAR2,
    p_salt       VARCHAR2,
    p_iterations INTEGER DEFAULT NULL,
    p_length     INTEGER DEFAULT NULL )
  RETURN VARCHAR2
AS
  iterations INTEGER := p_iterations;
  LEN        INTEGER := p_length;
BEGIN
  IF iterations IS NULL THEN
    iterations := to_number( tasker.app_settings.get( 'DEFAULT_PWD_HASH_ITER', 4096 ) );
  END IF;
  IF LEN IS NULL THEN
    LEN := to_number( tasker.app_settings.get( 'PWD_HASH_LENGTH', 128 ) );
  END IF;
  RETURN pbkdf2( p_password, p_salt, iterations, LEN );
END gen_hash;

/**
 * Make a portion of the token. Each part has a length of TOKEN_PART_LENGTH (default 128)
 */
FUNCTION make_token_part
  RETURN VARCHAR2
AS
BEGIN
  RETURN hextoraw( SYS.dbms_crypto.randombytes(
                   to_number( tasker.app_settings.get( 'TOKEN_PART_LENGTH', 128 ) ) ) );
END;

/**
 * Make the token that we can send back to the client
 *
 * Tokens are of the form  pepper || token-part
 * The client receives this, but the database stores pepper || hashed-token-part
 * based on a hash with the HMAC_SECRET and the pepper. This is to ensure that
 * a compromise of the database doesn't reveal the original tokens.
 *
 */

PROCEDURE make_token(
    p_secret VARCHAR2,
    p_client_token OUT VARCHAR2,
    p_db_token OUT VARCHAR2)
AS
  token_1      VARCHAR2( 1998 );
  token_2      VARCHAR2( 1998 );
  token_1_hash VARCHAR2( 1998 );
  dups         NUMBER := 0;
BEGIN
  token_1 := make_token_part( ); -- only client sees this
  token_2 := make_token_part( ); -- both client & db see this
  -- the database, however, stores a hash of token_1

  -- use hmac_token (p_secret) to hash token_1 twice
  token_1_hash := gen_hash( token_1, p_secret,
                            to_number( tasker.app_settings.get( 'TOKEN_HASH_ITER', 256 ) ),
                            to_number( tasker.app_settings.get( 'TOKEN_PART_LENGTH' , 128 ) ) );
  token_1_hash := gen_hash( token_1_hash, p_secret,
                            to_number( tasker.app_settings.get( 'TOKEN_HASH_ITER', 256 ) ),
                            to_number( tasker.app_settings.get( 'TOKEN_PART_LENGTH' , 128 ) ) );
  -- use token_2 as a pepper to hash
  token_1_hash := gen_hash( token_1_hash, token_2,
                              to_number( tasker.app_settings.get( 'TOKEN_HASH_ITER', 256 ) ),
                              to_number( tasker.app_settings.get( 'TOKEN_PART_LENGTH', 128 ) ) );

  -- construct the client and database token. Client sees the original token; database
  -- sees a hashed variation.
  p_client_token := token_2 || token_1;
  p_db_token := token_2 || token_1_hash;
END;

/**
 * is_user_connected
 *
 * Indicates if the user has an unexpired session. Doesn't really indicate connectivity,
 * just if a user has a session they could pick up and use.
 */
FUNCTION is_user_connected(
    p_user_id VARCHAR2 )
  RETURN BOOLEAN
AS
  current_session sessions%ROWTYPE;
BEGIN
  BEGIN
     SELECT *
       INTO current_session
       FROM tasker.sessions
      WHERE user_id = p_user_id
      AND sysdate < expiry;
  EXCEPTION
  WHEN NO_DATA_FOUND THEN
    RETURN FALSE;
  WHEN OTHERS THEN
    RAISE;
  END;
  RETURN TRUE;
END;

/**
 * Authenticates a user with the supplied user id and candidate password. Returns
 * the Y if successful and N if not. If Successful, the session id, next client
 * token, and hmac secret are also returned via out parameters
 */
FUNCTION authenticate_user(
    p_user_id   VARCHAR2,
    p_candidate VARCHAR2,
    p_session_id OUT NUMBER,
    p_next_token OUT VARCHAR2,
    p_hmac_secret OUT VARCHAR2,
    p_person_id OUT NUMBER)
  RETURN VARCHAR2
AS
  PRAGMA AUTONOMOUS_TRANSACTION;
  client_token VARCHAR2( 4000 );
  db_token     VARCHAR2( 4000 );
  dev_token    VARCHAR2( 4000 );
  dups         NUMBER := 0;
  session_id   INTEGER := 0;
  hmac_secret VARCHAR2( 4000 );
BEGIN
  IF verify_password( p_user_id, p_candidate ) = 'Y' THEN
    -- we're in!

    -- make the hmac secret
    hmac_secret := make_token_part( );
    p_hmac_secret := hmac_secret;

    -- make the token, based on the hmac secret in part
    make_token( hmac_secret, client_token, db_token);

    -- generate a session id
    session_id := sessions_seq.nextval( );

    -- insert the session information
     INSERT
       INTO sessions
      (
        id, user_id, token, expiry, hmac_secret
      )
      VALUES
      (
        session_id, p_user_id, db_token,
        sysdate + to_number( tasker.app_settings.get( 'TOKEN_EXPIRY' ) ), hmac_secret
      );
    COMMIT;
  ELSE
    -- couldn't authenticate; fail
    tasker.utils.E_ACCESS_DENIED( );
    RETURN 'N';
  END IF;

  -- return the necessary information back out the OUTparams
  p_session_id := session_id;
  p_next_token := client_token;
  p_person_id := tasker.PERSON_MGMT.get_person_id_by_user_id(p_user_id);

  -- also, set up the session context
  TASKER.SESSION_CONTEXT.set_session_id ( p_session_id );
  TASKER.SESSION_CONTEXT.set_ctx ( 'as_user', p_user_id );
  RETURN 'Y';
END;

/**
 * Ends the specified session
 */
PROCEDURE end_session ( p_session_id NUMBER )
AS
  PRAGMA AUTONOMOUS_TRANSACTION;
BEGIN
   DELETE FROM tasker.sessions WHERE id = p_session_id;
   TASKER.SESSION_CONTEXT.close_session ( p_session_id );
  COMMIT;
END;

/**
 * Verifies a candidate token and determines if the session
 * is still active or not. Returns 'Y' if the token was valid, or 'N'
 * if it wasn't. If the token was valid, it is *invalidated* and a new
 * token is returned in the OUT parameter. The user id of the user is
 * returned in an out param also.
 */
FUNCTION verify_token(
    p_session_id NUMBER,
    p_token      VARCHAR2,
    p_auth_user OUT VARCHAR2,
    p_next_token OUT VARCHAR2,
    p_hmac_token OUT VARCHAR2,
    p_person_id OUT NUMBER)
  RETURN VARCHAR2
AS
  PRAGMA AUTONOMOUS_TRANSACTION;
  current_session sessions%ROWTYPE;
  candidate_salt       VARCHAR2( 4000 );
  candidate_token      VARCHAR2( 4000 );
  candidate_token_hash VARCHAR2( 4000 );
  token_part_length    NUMBER := 0;
  db_token             VARCHAR2( 4000 );
  client_token         VARCHAR2( 4000 );
BEGIN
  -- token are of the form salt||token
  -- token part lengths are determined by TOKEN_PART_LENGTH
  token_part_length := to_number( tasker.app_settings.get( 'TOKEN_PART_LENGTH', 128 ) ) * 2;
  IF length( p_token ) >=( token_part_length * 2 ) THEN
    candidate_salt := substr( p_token, 1, token_part_length );
    candidate_token := substr( p_token,
                               length( p_token ) - token_part_length + 1, length ( p_token ) );
    -- get the corresponding session, if it exists
    BEGIN
       SELECT *
         INTO current_session
         FROM sessions
        WHERE id = p_session_id
        AND sysdate < expiry;
    EXCEPTION
    WHEN NO_DATA_FOUND THEN
      RETURN 'N';
    WHEN OTHERS THEN
      RAISE;
    END;
    -- with the session info, hash the candidate again
    candidate_token_hash := gen_hash( candidate_token, current_session.hmac_secret, to_number(
    tasker.app_settings.get( 'TOKEN_HASH_ITER', 256 ) ), to_number(
    tasker.app_settings.get( 'TOKEN_PART_LENGTH', 128 ) ) );
    candidate_token_hash := gen_hash( candidate_token_hash, current_session.hmac_secret, to_number(
    tasker.app_settings.get( 'TOKEN_HASH_ITER', 256 ) ), to_number(
    tasker.app_settings.get( 'TOKEN_PART_LENGTH', 128 ) ) );
    -- next, hash the token with the "pepper" from the token
    candidate_token_hash := gen_hash( candidate_token_hash, candidate_salt, to_number(
    tasker.app_settings.get( 'TOKEN_HASH_ITER', 256 ) ), to_number(
    tasker.app_settings.get( 'TOKEN_PART_LENGTH', 128 ) ) );
    -- check if we have a match
    IF current_session.token = candidate_salt || candidate_token_hash THEN
      -- set the user that matches
      p_auth_user := current_session.user_id;
      -- determine if we should generate a new token, or reuse the existing token
      if tasker.app_settings.get ( 'AUTH_TOKEN_MODE', 'REGEN_EVERY' ) = 'REGEN_EVERY' then
        -- generate the next token
        make_token ( current_session.hmac_secret, client_token, db_token);
        p_next_token := client_token;
        UPDATE sessions
        SET token = db_token,
            expiry = sysdate + to_number( tasker.app_settings.get( 'TOKEN_EXPIRY' ) )
          WHERE id = p_session_id;
        COMMIT;
      else
        p_next_token := null;
        UPDATE sessions
        SET  expiry = sysdate + to_number( tasker.app_settings.get( 'TOKEN_EXPIRY' ) )
          WHERE id = p_session_id;
        COMMIT;
      end if;
      p_hmac_token := current_session.hmac_secret;
      p_person_id := tasker.PERSON_MGMT.get_person_id_by_user_id(p_auth_user);

      -- restore the session context
      TASKER.SESSION_CONTEXT.set_session_id ( p_session_id );
      TASKER.SESSION_CONTEXT.set_ctx ( 'as_user', p_auth_user );

      -- and indicate verification
      RETURN 'Y';
    END IF;
  END IF;
  RETURN 'N';
END;
END SECURITY;
/
