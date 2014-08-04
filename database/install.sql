-------------------------------------------------------------------------------
--
-- TASKER DATABASE INSTALL
--
-- The following script will create the TASKER tablespace, the attached schemas,
-- views, and stored procedures necessary to use the system. If desired, test
-- data will also be installed.
--
-- ** DO NOT RUN THIS ON A PRODUCTION DATABASE; ENSURE YOU ARE IN A DEVELOPMENT
-- ** ENVIRONMENT PRIOR TO INSTALLING.
--
-- Requires Oracle 11gR2 or later. Express Edition is sufficient.
--
-- YOU MAY ENCOUNTER ERRORS DURING INSTALLATION; THESE ARE NORMAL DURING DROP
-- COMMANDS. OTHER ERRORS SHOULD BE INVESTIGATED.
--
-------------------------------------------------------------------------------

PROMPT
PROMPT Tasker Installation
ACCEPT BASE_SCHEMA_NAME CHAR DEFAULT TASKER PROMPT "Base schema name [TASKER]: "
ACCEPT DATAFILE_PATH CHAR DEFAULT /u01/app/oracle/oradata/XE/ PROMPT "Datafile base path [/u01/app/oracle/oradata/XE/]: "
ACCEPT TABLESPACE_PATH CHAR DEFAULT &DATAFILE_PATH.&BASE_SCHEMA_NAME..dbf PROMPT "Tablespace path [&DATAFILE_PATH.&BASE_SCHEMA_NAME._TS.dbf]: "

PROMPT
PROMPT Creating tablespace...

create tablespace &BASE_SCHEMA_NAME._TS logging datafile '&TABLESPACE_PATH' size 64m autoextend on next 64m maxsize unlimited extent management local;

PROMPT
PROMPT User creation

ACCEPT TASKER_DATA_PASS CHAR PROMPT "&BASE_SCHEMA_NAME._DATA password: "
ACCEPT TASKER_API_PASS CHAR PROMPT "&BASE_SCHEMA_NAME._API password: "
ACCEPT TASKER_CLIENT_PASS CHAR PROMPT "&BASE_SCHEMA_NAME._CLIENT password: "
ACCEPT TASKER_ADMIN_PASS CHAR PROMPT "&BASE_SCHEMA_NAME._ADMIN password: "
ACCEPT TEMP_TS CHAR DEFAULT TEMP PROMPT "Temporary tablespace [TEMP]: "

PROMPT
PROMPT Creating users...

create user &BASE_SCHEMA_NAME._DATA identified by &TASKER_DATA_PASS
default tablespace &BASE_SCHEMA_NAME._TS temporary tablespace &TEMP_TS
account LOCK;
create user &BASE_SCHEMA_NAME._API identified by &TASKER_API_PASS
default tablespace &BASE_SCHEMA_NAME._TS temporary tablespace &TEMP_TS
account LOCK;
create user &BASE_SCHEMA_NAME._CLIENT identified by &TASKER_CLIENT_PASS
default tablespace &BASE_SCHEMA_NAME._TS temporary tablespace &TEMP_TS;
create user &BASE_SCHEMA_NAME._ADMIN identified by &TASKER_ADMIN_PASS
default tablespace &BASE_SCHEMA_NAME._TS temporary tablespace &TEMP_TS;

PROMPT
PROMPT Creating roles...

create role &BASE_SCHEMA_NAME._ADMIN;
create role &BASE_SCHEMA_NAME._CLIENT;
create role &BASE_SCHEMA_NAME._USER;

grant &BASE_SCHEMA_NAME._ADMIN to &BASE_SCHEMA_NAME._DATA;
grant &BASE_SCHEMA_NAME._ADMIN to &BASE_SCHEMA_NAME._ADMIN;
grant &BASE_SCHEMA_NAME._CLIENT to &BASE_SCHEMA_NAME._CLIENT;
grant &BASE_SCHEMA_NAME._USER to &BASE_SCHEMA_NAME._CLIENT;
grant &BASE_SCHEMA_NAME._USER to &BASE_SCHEMA_NAME._ADMIN;

PROMPT
PROMPT Creating Tables...

PROMPT
PROMPT Creating Stored Procedures...

PROMPT
PROMPT Creating Views...

PROMPT
PROMPT Creating logon triggers...

CREATE OR REPLACE TRIGGER &BASE_SCHEMA_NAME._LOGON_TRIG
AFTER LOGON ON DATABASE
DECLARE
  client_role VARCHAR2(32) := '&BASE_SCHEMA_NAME._CLIENT';
  user_role VARCHAR2(32) := '&BASE_SCHEMA_NAME._USER';
  has_client_role VARCHAR2(1) := 'N';
  has_user_role VARCHAR2(1) := 'N';
BEGIN
  -- does user have user role?
  BEGIN
    SELECT 'Y' INTO has_user_role
      FROM USER_ROLE_PRIVS
     WHERE USERNAME = user
       AND GRANTED_ROLE = user_role;
  EXCEPTION WHEN OTHERS THEN
    user_role := 'N';
  END;
  -- does user have client role?
  BEGIN
    SELECT 'Y' INTO has_client_role
      FROM USER_ROLE_PRIVS
     WHERE USERNAME = user
       AND GRANTED_ROLE = client_role;
  EXCEPTION WHEN OTHERS THEN
    client_role := 'N';
  END;
  -- set the default schema, but only if the user has a user or client
  -- role -- otherwise we want to leave things alone
  if has_user_role = 'Y' or has_client_role = 'Y' then
    execute immediate 'ALTER SESSION SET CURRENT_SCHEMA=''&BASE_SCHEMA_NAME._API''';
  end if;
END;
/

PROMPT
PROMPT Install Test Data ?

