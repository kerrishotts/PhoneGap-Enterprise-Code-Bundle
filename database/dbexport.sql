--------------------------------------------------------
--  File created - Thursday-July-24-2014   
--------------------------------------------------------
-- Unable to render TYPE DDL for object TASKER.SYS_PLSQL_20044_62_1 with DBMS_METADATA attempting internal generator.
CREATE TYPE          SYS_PLSQL_20044_62_1 as object ("ID" NUMBER,
"TITLE" VARCHAR2(4000),
"DESCRIPTION" VARCHAR2(4000),
"PCT_COMPLETE" NUMBER,
"STATUS" VARCHAR2(1),
"OWNER" NUMBER,
"ASSIGNED_TO" NUMBER,
"CHANGE_DATE" DATE,
"CHANGE_USER" VARCHAR2(32));
-- Unable to render TYPE DDL for object TASKER.SYS_PLSQL_20044_DUMMY_1 with DBMS_METADATA attempting internal generator.
CREATE TYPE          SYS_PLSQL_20044_DUMMY_1 as table of number;
-- Unable to render TYPE DDL for object TASKER.SYS_PLSQL_20046_44_1 with DBMS_METADATA attempting internal generator.
CREATE TYPE          SYS_PLSQL_20046_44_1 as object ("ID" NUMBER,
"TASK" NUMBER,
"COMMENTS" VARCHAR2(4000),
"CHANGE_DATE" DATE,
"CHANGE_USER" VARCHAR2(32),
"AUTHOR" VARCHAR2(32));
-- Unable to render TYPE DDL for object TASKER.SYS_PLSQL_20046_DUMMY_1 with DBMS_METADATA attempting internal generator.
CREATE TYPE          SYS_PLSQL_20046_DUMMY_1 as table of number;
-- Unable to render TYPE DDL for object TASKER.SYS_PLSQL_22237_21_1 with DBMS_METADATA attempting internal generator.
CREATE TYPE          SYS_PLSQL_22237_21_1 as table of "TASKER"."SYS_PLSQL_20046_44_1";
-- Unable to render TYPE DDL for object TASKER.SYS_PLSQL_22237_9_1 with DBMS_METADATA attempting internal generator.
CREATE TYPE          SYS_PLSQL_22237_9_1 as table of "TASKER"."SYS_PLSQL_20044_62_1";
-- Unable to render TYPE DDL for object TASKER.SYS_PLSQL_22237_DUMMY_1 with DBMS_METADATA attempting internal generator.
CREATE TYPE          SYS_PLSQL_22237_DUMMY_1 as table of number;
-- Unable to render TYPE DDL for object TASKER.SYS_PLSQL_22246_9_1 with DBMS_METADATA attempting internal generator.
CREATE TYPE          SYS_PLSQL_22246_9_1 as table of "TASKER"."SYS_PLSQL_20041_65_1";
-- Unable to render TYPE DDL for object TASKER.SYS_PLSQL_22246_DUMMY_1 with DBMS_METADATA attempting internal generator.
CREATE TYPE          SYS_PLSQL_22246_DUMMY_1 as table of number;
--------------------------------------------------------
--  DDL for Sequence PERSON_SEQ
--------------------------------------------------------

   CREATE SEQUENCE  "TASKER"."PERSON_SEQ"  MINVALUE 1 MAXVALUE 9999999999999999999999999999 INCREMENT BY 1 START WITH 4 NOCACHE  NOORDER  NOCYCLE ;
--------------------------------------------------------
--  DDL for Sequence SESSIONS_SEQ
--------------------------------------------------------

   CREATE SEQUENCE  "TASKER"."SESSIONS_SEQ"  MINVALUE 1 MAXVALUE 9999999999999999999999999999 INCREMENT BY 1 START WITH 1000 NOCACHE  NOORDER  NOCYCLE ;
--------------------------------------------------------
--  DDL for Sequence TASK_COMMENT_SEQ
--------------------------------------------------------

   CREATE SEQUENCE  "TASKER"."TASK_COMMENT_SEQ"  MINVALUE 1 MAXVALUE 9999999999999999999999999999 INCREMENT BY 1 START WITH 1 NOCACHE  NOORDER  NOCYCLE ;
--------------------------------------------------------
--  DDL for Sequence TASK_SEQ
--------------------------------------------------------

   CREATE SEQUENCE  "TASKER"."TASK_SEQ"  MINVALUE 1 MAXVALUE 9999999999999999999999999999 INCREMENT BY 1 START WITH 3 NOCACHE  NOORDER  NOCYCLE ;
--------------------------------------------------------
--  DDL for Table PERSON
--------------------------------------------------------

  CREATE TABLE "TASKER"."PERSON" 
   (	"ID" NUMBER, 
	"USER_ID" VARCHAR2(32 BYTE), 
	"FIRST_NAME" VARCHAR2(255 BYTE), 
	"MIDDLE_NAME" VARCHAR2(255 BYTE), 
	"LAST_NAME" VARCHAR2(255 BYTE), 
	"ADMINISTRATOR_ID" NUMBER, 
	"CHANGE_DATE" DATE, 
	"CHANGE_USER" VARCHAR2(32 BYTE), 
	"AVATAR" BLOB
   ) SEGMENT CREATION IMMEDIATE 
  PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255 NOCOMPRESS LOGGING
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1 BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TASKER" 
 LOB ("AVATAR") STORE AS BASICFILE (
  TABLESPACE "TASKER" ENABLE STORAGE IN ROW CHUNK 8192 RETENTION 
  NOCACHE LOGGING 
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1 BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)) ;

   COMMENT ON COLUMN "TASKER"."PERSON"."ID" IS 'Internal ID';
   COMMENT ON COLUMN "TASKER"."PERSON"."USER_ID" IS 'Authorization ID';
   COMMENT ON COLUMN "TASKER"."PERSON"."ADMINISTRATOR_ID" IS 'Link to Administrator';
   COMMENT ON COLUMN "TASKER"."PERSON"."AVATAR" IS 'Raw image data for photo';
--------------------------------------------------------
--  DDL for Table ROLES
--------------------------------------------------------

  CREATE TABLE "TASKER"."ROLES" 
   (	"ID" VARCHAR2(32 BYTE), 
	"PRIVILEGE" VARCHAR2(255 BYTE), 
	"GRANTED" VARCHAR2(1 BYTE)
   ) SEGMENT CREATION IMMEDIATE 
  PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255 NOCOMPRESS LOGGING
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1 BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TASKER" ;
--------------------------------------------------------
--  DDL for Table SESSIONS
--------------------------------------------------------

  CREATE TABLE "TASKER"."SESSIONS" 
   (	"ID" NUMBER, 
	"USER_ID" VARCHAR2(32 BYTE), 
	"TOKEN" VARCHAR2(4000 BYTE), 
	"EXPIRY" DATE
   ) SEGMENT CREATION IMMEDIATE 
  PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255 NOCOMPRESS LOGGING
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1 BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TASKER" ;
--------------------------------------------------------
--  DDL for Table SETTINGS
--------------------------------------------------------

  CREATE TABLE "TASKER"."SETTINGS" 
   (	"ID" VARCHAR2(255 BYTE), 
	"VALUE" VARCHAR2(255 BYTE)
   ) SEGMENT CREATION IMMEDIATE 
  PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255 NOCOMPRESS LOGGING
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1 BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TASKER" ;
--------------------------------------------------------
--  DDL for Table TASK
--------------------------------------------------------

  CREATE TABLE "TASKER"."TASK" 
   (	"ID" NUMBER, 
	"TITLE" VARCHAR2(4000 BYTE), 
	"DESCRIPTION" VARCHAR2(4000 BYTE), 
	"PCT_COMPLETE" NUMBER, 
	"STATUS" VARCHAR2(1 BYTE), 
	"OWNER" NUMBER, 
	"ASSIGNED_TO" NUMBER, 
	"CHANGE_DATE" DATE, 
	"CHANGE_USER" VARCHAR2(32 BYTE)
   ) SEGMENT CREATION IMMEDIATE 
  PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255 NOCOMPRESS LOGGING
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1 BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TASKER" ;

   COMMENT ON COLUMN "TASKER"."TASK"."ID" IS 'Internal Task ID';
   COMMENT ON COLUMN "TASKER"."TASK"."PCT_COMPLETE" IS 'Percentage complete (0-100)';
   COMMENT ON COLUMN "TASKER"."TASK"."STATUS" IS '(C)omplete, (I)n-Progress, On-(H)old, (X) Deleted';
--------------------------------------------------------
--  DDL for Table TASK_COMMENTS
--------------------------------------------------------

  CREATE TABLE "TASKER"."TASK_COMMENTS" 
   (	"ID" NUMBER, 
	"TASK" NUMBER, 
	"COMMENTS" VARCHAR2(4000 BYTE), 
	"CHANGE_DATE" DATE, 
	"CHANGE_USER" VARCHAR2(32 BYTE), 
	"AUTHOR" VARCHAR2(32 BYTE)
   ) SEGMENT CREATION IMMEDIATE 
  PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255 NOCOMPRESS LOGGING
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1 BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TASKER" ;
--------------------------------------------------------
--  DDL for Table USERS
--------------------------------------------------------

  CREATE TABLE "TASKER"."USERS" 
   (	"ID" VARCHAR2(32 BYTE), 
	"EXTERNAL_AUTH_SYS" NUMBER, 
	"EXTERNAL_AUTH_ID" VARCHAR2(255 BYTE), 
	"PASSWORD" VARCHAR2(256 BYTE), 
	"SALT" VARCHAR2(256 BYTE), 
	"STATUS" VARCHAR2(1 BYTE), 
	"CHANGE_DATE" DATE, 
	"CHANGE_USER" VARCHAR2(32 BYTE), 
	"FAILED_LOGIN_ATTEMPTS" NUMBER(*,0)
   ) SEGMENT CREATION IMMEDIATE 
  PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255 NOCOMPRESS LOGGING
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1 BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TASKER" ;

   COMMENT ON COLUMN "TASKER"."USERS"."ID" IS 'Internal User ID';
   COMMENT ON COLUMN "TASKER"."USERS"."EXTERNAL_AUTH_SYS" IS 'External Authorization System';
   COMMENT ON COLUMN "TASKER"."USERS"."EXTERNAL_AUTH_ID" IS 'External Authorization ID';
   COMMENT ON COLUMN "TASKER"."USERS"."PASSWORD" IS 'Password hash';
   COMMENT ON COLUMN "TASKER"."USERS"."SALT" IS 'Salt';
   COMMENT ON COLUMN "TASKER"."USERS"."STATUS" IS '(A)ctive / (I)nactive';
--------------------------------------------------------
--  DDL for Table USER_ROLES
--------------------------------------------------------

  CREATE TABLE "TASKER"."USER_ROLES" 
   (	"USER_ID" VARCHAR2(32 BYTE), 
	"ROLE_ID" VARCHAR2(255 BYTE), 
	"CHANGE_DATE" DATE, 
	"CHANGE_USER" VARCHAR2(32 BYTE)
   ) SEGMENT CREATION IMMEDIATE 
  PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255 NOCOMPRESS LOGGING
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1 BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TASKER" ;
REM INSERTING into TASKER.PERSON
SET DEFINE OFF;
Insert into TASKER.PERSON (ID,USER_ID,FIRST_NAME,MIDDLE_NAME,LAST_NAME,ADMINISTRATOR_ID,CHANGE_DATE,CHANGE_USER) values (2,'JDOE','John',null,'Doe',null,to_date('07/24/2014 01:15:20','MM/DD/YYYY HH24:MI:SS'),'SYSADMIN');
Insert into TASKER.PERSON (ID,USER_ID,FIRST_NAME,MIDDLE_NAME,LAST_NAME,ADMINISTRATOR_ID,CHANGE_DATE,CHANGE_USER) values (3,'BSMITH','Bob','A','Smith',2,to_date('07/24/2014 01:17:48','MM/DD/YYYY HH24:MI:SS'),'SYSADMIN');
REM INSERTING into TASKER.ROLES
SET DEFINE OFF;
Insert into TASKER.ROLES (ID,PRIVILEGE,GRANTED) values ('SYSADMIN','CAN_CHANGE_ANY_USER_PWD','Y');
Insert into TASKER.ROLES (ID,PRIVILEGE,GRANTED) values ('HELPDESK','CAN_CHANGE_ANY_USER_PWD','Y');
Insert into TASKER.ROLES (ID,PRIVILEGE,GRANTED) values ('SYSADMIN','CAN_MODIFY_USER','Y');
Insert into TASKER.ROLES (ID,PRIVILEGE,GRANTED) values ('SYSADMIN','CAN_CREATE_USER','Y');
Insert into TASKER.ROLES (ID,PRIVILEGE,GRANTED) values ('SYSADMIN','CAN_MODIFY_ANY_TASK','Y');
Insert into TASKER.ROLES (ID,PRIVILEGE,GRANTED) values ('SYSADMIN','CAN_ASSIGN_ANY_TASK_TO_ANYONE','Y');
Insert into TASKER.ROLES (ID,PRIVILEGE,GRANTED) values ('SYSADMIN','CAN_SEE_ANY_TASK','Y');
Insert into TASKER.ROLES (ID,PRIVILEGE,GRANTED) values ('SYSADMIN','CAN_COMMENT_ON_ANY_TASK','Y');
Insert into TASKER.ROLES (ID,PRIVILEGE,GRANTED) values ('SYSADMIN','CAN_REASSIGN_ANY_TASK','Y');
Insert into TASKER.ROLES (ID,PRIVILEGE,GRANTED) values ('SYSADMIN','CAN_CREATE_OWN_TASK','Y');
Insert into TASKER.ROLES (ID,PRIVILEGE,GRANTED) values ('SYSADMIN','CAN_MODIFY_OWN_TASK','Y');
Insert into TASKER.ROLES (ID,PRIVILEGE,GRANTED) values ('SYSADMIN','CAN_COMMENT_ON_OWN_TASK','Y');
Insert into TASKER.ROLES (ID,PRIVILEGE,GRANTED) values ('SYSADMIN','CAN_COMMENT_ON_ASSIGNED_TASK','Y');
Insert into TASKER.ROLES (ID,PRIVILEGE,GRANTED) values ('USER','CAN_CREATE_OWN_TASK','Y');
Insert into TASKER.ROLES (ID,PRIVILEGE,GRANTED) values ('USER','CAN_MODIFY_OWN_TASK','Y');
Insert into TASKER.ROLES (ID,PRIVILEGE,GRANTED) values ('USER','CAN_COMMENT_ON_OWN_TASK','Y');
Insert into TASKER.ROLES (ID,PRIVILEGE,GRANTED) values ('USER','CAN_COMMENT_ON_ASSIGNED_TASK','Y');
Insert into TASKER.ROLES (ID,PRIVILEGE,GRANTED) values ('USER','CAN_UPD_PROGRESS_ON_ASGND_TASK','Y');
Insert into TASKER.ROLES (ID,PRIVILEGE,GRANTED) values ('USER','CAN_UPD_STATUS_ON_ASGND_TASK','Y');
Insert into TASKER.ROLES (ID,PRIVILEGE,GRANTED) values ('SYSADMIN','CAN_UPD_PROGRESS_ON_ASGND_TASK','Y');
Insert into TASKER.ROLES (ID,PRIVILEGE,GRANTED) values ('SYSADMIN','CAN_UPD_STATUS_ON_ASGND_TASK','Y');
Insert into TASKER.ROLES (ID,PRIVILEGE,GRANTED) values ('HELPDESK','CAN_UNLOCK_USER','Y');
Insert into TASKER.ROLES (ID,PRIVILEGE,GRANTED) values ('SYSADMIN','CAN_UNLOCK_USER','Y');
Insert into TASKER.ROLES (ID,PRIVILEGE,GRANTED) values ('SYSADMIN','CAN_CREATE_PERSON','Y');
Insert into TASKER.ROLES (ID,PRIVILEGE,GRANTED) values ('SYSADMIN','CAN_MODIFY_PERSON','Y');
REM INSERTING into TASKER.SESSIONS
SET DEFINE OFF;
REM INSERTING into TASKER.SETTINGS
SET DEFINE OFF;
Insert into TASKER.SETTINGS (ID,VALUE) values ('MAX_FAILED_LOGINS','10');
Insert into TASKER.SETTINGS (ID,VALUE) values ('TOKEN_EXPIRY','7');
REM INSERTING into TASKER.TASK
SET DEFINE OFF;
Insert into TASKER.TASK (ID,TITLE,DESCRIPTION,PCT_COMPLETE,STATUS,OWNER,ASSIGNED_TO,CHANGE_DATE,CHANGE_USER) values (2,'Push new version of website','Shouldn''t take too long. Let me know if you have problems',0,'I',2,3,to_date('07/24/2014 01:24:30','MM/DD/YYYY HH24:MI:SS'),'JDOE');
REM INSERTING into TASKER.TASK_COMMENTS
SET DEFINE OFF;
REM INSERTING into TASKER.USERS
SET DEFINE OFF;
Insert into TASKER.USERS (ID,EXTERNAL_AUTH_SYS,EXTERNAL_AUTH_ID,PASSWORD,SALT,STATUS,CHANGE_DATE,CHANGE_USER,FAILED_LOGIN_ATTEMPTS) values ('BSMITH',null,null,'896604A5C1128AE80247246FAEFE458669A122272709EC655F5160A47F337208E8CE82C5EE67FB76B4FAEFF239827998C25A521CE86BCCC8F49AE7B13125A8C49778BFBAB25AE499AD67BA7960B5023659EFEF3BAA377EAE7EB15FEB2B079B99DC54E0D7DB1BE048A30A1B9FA3A07013F55E6F571706B0B830879C63C8C678CB','CIbPQLkGaWCUufBnvx0/RfPM3W6CNySLOMBBBtvCq0zGnenxEF66r6eJRKWrwl8u
','A',to_date('07/24/2014 01:08:02','MM/DD/YYYY HH24:MI:SS'),'SYSADMIN',null);
Insert into TASKER.USERS (ID,EXTERNAL_AUTH_SYS,EXTERNAL_AUTH_ID,PASSWORD,SALT,STATUS,CHANGE_DATE,CHANGE_USER,FAILED_LOGIN_ATTEMPTS) values ('JDOE',null,null,'27372FC47ED9FF98A615249C20F661A26C289573A3F0F3C2FCC3073D22E261B8C873CEEFC49625906097C72188A059EA28BAF64FE541CDCE8BC45670285919A6AD5FF41AB461E6B845743C4046BBB5FD21C714D93EEC726B336211CE7F402BCA9EF85D775133DCE6A2605BE784AC7B86458B8B44FE7127E445651015B2DA8C25','U5tFM2Ns/0AeXj7usqlZR5OAvFlrUbxEGphjPcpUxDQwmE6xOgFvyKpS32TrBymj
','A',to_date('07/24/2014 01:12:57','MM/DD/YYYY HH24:MI:SS'),'SYSADMIN',null);
Insert into TASKER.USERS (ID,EXTERNAL_AUTH_SYS,EXTERNAL_AUTH_ID,PASSWORD,SALT,STATUS,CHANGE_DATE,CHANGE_USER,FAILED_LOGIN_ATTEMPTS) values ('SYSADMIN',null,null,'9B81DC653084F94A57CB620E4F295D1FFB53B65B2F7AAB3AEC139B258EF9D4AFF208A07A04526C8B45162757C50D501B3220E84E44BABF6D65B482469079A027506422D077770D3FCD1DD8F1AB62069E5CC7724E80495F8E8E11199F06DD24D711FD475E1F15F9F96513EF3938E266864A921841FF844E57E6C5909DAFBD80F1','r943lWQcU8gCPCHIbWh0XycldB1jCvPH7wj1CAHAbdT9TMYUIY4nXFcAa/gPJV5N
','A',to_date('07/24/2014 01:10:30','MM/DD/YYYY HH24:MI:SS'),'SYSADMIN',null);
REM INSERTING into TASKER.USER_ROLES
SET DEFINE OFF;
Insert into TASKER.USER_ROLES (USER_ID,ROLE_ID,CHANGE_DATE,CHANGE_USER) values ('SYSADMIN','SYSADMIN',to_date('07/16/2014 23:34:16','MM/DD/YYYY HH24:MI:SS'),'SYSADMIN');
Insert into TASKER.USER_ROLES (USER_ID,ROLE_ID,CHANGE_DATE,CHANGE_USER) values ('BSMITH','USER',to_date('07/24/2014 05:20:39','MM/DD/YYYY HH24:MI:SS'),'SYSADMIN');
Insert into TASKER.USER_ROLES (USER_ID,ROLE_ID,CHANGE_DATE,CHANGE_USER) values ('JDOE','USER',to_date('07/24/2014 05:20:55','MM/DD/YYYY HH24:MI:SS'),'SYSADMIN');
--------------------------------------------------------
--  DDL for Index PERSON_PK
--------------------------------------------------------

  CREATE UNIQUE INDEX "TASKER"."PERSON_PK" ON "TASKER"."PERSON" ("ID") 
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS 
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1 BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TASKER" ;
--------------------------------------------------------
--  DDL for Index PERSON_UKUSERID1
--------------------------------------------------------

  CREATE UNIQUE INDEX "TASKER"."PERSON_UKUSERID1" ON "TASKER"."PERSON" ("USER_ID") 
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS 
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1 BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TASKER" ;
--------------------------------------------------------
--  DDL for Index ROLES_PK
--------------------------------------------------------

  CREATE UNIQUE INDEX "TASKER"."ROLES_PK" ON "TASKER"."ROLES" ("ID", "PRIVILEGE") 
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS 
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1 BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TASKER" ;
--------------------------------------------------------
--  DDL for Index SETTINGS_PK
--------------------------------------------------------

  CREATE UNIQUE INDEX "TASKER"."SETTINGS_PK" ON "TASKER"."SETTINGS" ("ID") 
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS 
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1 BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TASKER" ;
--------------------------------------------------------
--  DDL for Index TASK_PK
--------------------------------------------------------

  CREATE UNIQUE INDEX "TASKER"."TASK_PK" ON "TASKER"."TASK" ("ID") 
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS 
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1 BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TASKER" ;
--------------------------------------------------------
--  DDL for Index USERS_PK
--------------------------------------------------------

  CREATE UNIQUE INDEX "TASKER"."USERS_PK" ON "TASKER"."USERS" ("ID") 
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS 
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1 BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TASKER" ;
--------------------------------------------------------
--  DDL for Index USER_ROLES_PK
--------------------------------------------------------

  CREATE UNIQUE INDEX "TASKER"."USER_ROLES_PK" ON "TASKER"."USER_ROLES" ("USER_ID", "ROLE_ID") 
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS 
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1 BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TASKER" ;
--------------------------------------------------------
--  Constraints for Table PERSON
--------------------------------------------------------

  ALTER TABLE "TASKER"."PERSON" ADD CONSTRAINT "PERSON_UKUSERID1" UNIQUE ("USER_ID")
  USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS 
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1 BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TASKER"  ENABLE;
  ALTER TABLE "TASKER"."PERSON" ADD CONSTRAINT "PERSON_PK" PRIMARY KEY ("ID")
  USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS 
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1 BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TASKER"  ENABLE;
  ALTER TABLE "TASKER"."PERSON" MODIFY ("CHANGE_USER" NOT NULL ENABLE);
  ALTER TABLE "TASKER"."PERSON" MODIFY ("CHANGE_DATE" NOT NULL ENABLE);
  ALTER TABLE "TASKER"."PERSON" MODIFY ("FIRST_NAME" NOT NULL ENABLE);
  ALTER TABLE "TASKER"."PERSON" MODIFY ("USER_ID" NOT NULL ENABLE);
  ALTER TABLE "TASKER"."PERSON" MODIFY ("ID" NOT NULL ENABLE);
--------------------------------------------------------
--  Constraints for Table ROLES
--------------------------------------------------------

  ALTER TABLE "TASKER"."ROLES" ADD CONSTRAINT "ROLES_PK" PRIMARY KEY ("ID", "PRIVILEGE")
  USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS 
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1 BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TASKER"  ENABLE;
  ALTER TABLE "TASKER"."ROLES" MODIFY ("GRANTED" NOT NULL ENABLE);
  ALTER TABLE "TASKER"."ROLES" MODIFY ("PRIVILEGE" NOT NULL ENABLE);
  ALTER TABLE "TASKER"."ROLES" MODIFY ("ID" NOT NULL ENABLE);
--------------------------------------------------------
--  Constraints for Table SESSIONS
--------------------------------------------------------

  ALTER TABLE "TASKER"."SESSIONS" MODIFY ("EXPIRY" NOT NULL ENABLE);
  ALTER TABLE "TASKER"."SESSIONS" MODIFY ("TOKEN" NOT NULL ENABLE);
  ALTER TABLE "TASKER"."SESSIONS" MODIFY ("USER_ID" NOT NULL ENABLE);
  ALTER TABLE "TASKER"."SESSIONS" MODIFY ("ID" NOT NULL ENABLE);
--------------------------------------------------------
--  Constraints for Table SETTINGS
--------------------------------------------------------

  ALTER TABLE "TASKER"."SETTINGS" ADD CONSTRAINT "SETTINGS_PK" PRIMARY KEY ("ID")
  USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS 
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1 BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TASKER"  ENABLE;
  ALTER TABLE "TASKER"."SETTINGS" MODIFY ("ID" NOT NULL ENABLE);
--------------------------------------------------------
--  Constraints for Table TASK
--------------------------------------------------------

  ALTER TABLE "TASKER"."TASK" ADD CONSTRAINT "TASK_CHKSTATUS1" CHECK (STATUS IN ('I', 'C', 'H', 'X')) ENABLE;
  ALTER TABLE "TASKER"."TASK" ADD CONSTRAINT "TASK_PK" PRIMARY KEY ("ID")
  USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS 
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1 BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TASKER"  ENABLE;
  ALTER TABLE "TASKER"."TASK" MODIFY ("CHANGE_USER" NOT NULL ENABLE);
  ALTER TABLE "TASKER"."TASK" MODIFY ("CHANGE_DATE" NOT NULL ENABLE);
  ALTER TABLE "TASKER"."TASK" MODIFY ("OWNER" NOT NULL ENABLE);
  ALTER TABLE "TASKER"."TASK" MODIFY ("STATUS" NOT NULL ENABLE);
  ALTER TABLE "TASKER"."TASK" MODIFY ("PCT_COMPLETE" NOT NULL ENABLE);
  ALTER TABLE "TASKER"."TASK" MODIFY ("TITLE" NOT NULL ENABLE);
  ALTER TABLE "TASKER"."TASK" MODIFY ("ID" NOT NULL ENABLE);
--------------------------------------------------------
--  Constraints for Table TASK_COMMENTS
--------------------------------------------------------

  ALTER TABLE "TASKER"."TASK_COMMENTS" MODIFY ("CHANGE_USER" NOT NULL ENABLE);
  ALTER TABLE "TASKER"."TASK_COMMENTS" MODIFY ("CHANGE_DATE" NOT NULL ENABLE);
  ALTER TABLE "TASKER"."TASK_COMMENTS" MODIFY ("COMMENTS" NOT NULL ENABLE);
  ALTER TABLE "TASKER"."TASK_COMMENTS" MODIFY ("TASK" NOT NULL ENABLE);
  ALTER TABLE "TASKER"."TASK_COMMENTS" MODIFY ("ID" NOT NULL ENABLE);
--------------------------------------------------------
--  Constraints for Table USERS
--------------------------------------------------------

  ALTER TABLE "TASKER"."USERS" ADD CONSTRAINT "USERS_CHKSTATUS1" CHECK (STATUS IN ('A', 'I')) ENABLE;
  ALTER TABLE "TASKER"."USERS" ADD CONSTRAINT "USERS_CHKEXTVSINT1" CHECK ((EXTERNAL_AUTH_ID IS NOT NULL AND EXTERNAL_AUTH_SYS IS NOT NULL AND PASSWORD IS NULL AND SALT IS NULL) OR (EXTERNAL_AUTH_ID IS NULL AND EXTERNAL_AUTH_SYS IS NULL AND PASSWORD IS NOT NULL AND SALT IS NOT NULL)) ENABLE;
  ALTER TABLE "TASKER"."USERS" ADD CONSTRAINT "USERS_PK" PRIMARY KEY ("ID")
  USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS 
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1 BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TASKER"  ENABLE;
  ALTER TABLE "TASKER"."USERS" MODIFY ("STATUS" NOT NULL ENABLE);
  ALTER TABLE "TASKER"."USERS" MODIFY ("ID" NOT NULL ENABLE);
--------------------------------------------------------
--  Constraints for Table USER_ROLES
--------------------------------------------------------

  ALTER TABLE "TASKER"."USER_ROLES" ADD CONSTRAINT "USER_ROLES_PK" PRIMARY KEY ("USER_ID", "ROLE_ID")
  USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS 
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1 BUFFER_POOL DEFAULT FLASH_CACHE DEFAULT CELL_FLASH_CACHE DEFAULT)
  TABLESPACE "TASKER"  ENABLE;
  ALTER TABLE "TASKER"."USER_ROLES" MODIFY ("CHANGE_DATE" NOT NULL ENABLE);
  ALTER TABLE "TASKER"."USER_ROLES" MODIFY ("ROLE_ID" NOT NULL ENABLE);
  ALTER TABLE "TASKER"."USER_ROLES" MODIFY ("USER_ID" NOT NULL ENABLE);
--------------------------------------------------------
--  DDL for Trigger BI_PERSON_SEQ
--------------------------------------------------------

  CREATE OR REPLACE TRIGGER "TASKER"."BI_PERSON_SEQ" 
BEFORE INSERT ON PERSON 
REFERENCING OLD AS OLD NEW AS NEW
FOR EACH ROW 
BEGIN
  IF :new.ID IS NULL THEN
    :new.ID := PERSON_SEQ.nextval();
  END IF;
END;
/
ALTER TRIGGER "TASKER"."BI_PERSON_SEQ" ENABLE;
--------------------------------------------------------
--  DDL for Trigger BI_TASK_COMMENTS_SEQ
--------------------------------------------------------

  CREATE OR REPLACE TRIGGER "TASKER"."BI_TASK_COMMENTS_SEQ" 
BEFORE INSERT ON TASK_COMMENTS 
REFERENCING OLD AS OLD NEW AS NEW
FOR EACH ROW 
BEGIN
  IF :new.ID IS NULL THEN
    :new.ID := TASK_COMMENT_SEQ.nextval();
  END IF;
END;
/
ALTER TRIGGER "TASKER"."BI_TASK_COMMENTS_SEQ" ENABLE;
--------------------------------------------------------
--  DDL for Trigger BI_TASK_SEQ
--------------------------------------------------------

  CREATE OR REPLACE TRIGGER "TASKER"."BI_TASK_SEQ" 
BEFORE INSERT ON TASK 
REFERENCING OLD AS OLD NEW AS NEW
FOR EACH ROW 
BEGIN
  IF :new.ID IS NULL THEN
    :new.ID := TASK_SEQ.nextval();
  END IF;
END;
/
ALTER TRIGGER "TASKER"."BI_TASK_SEQ" ENABLE;
--------------------------------------------------------
--  DDL for Function PBKDF2
--------------------------------------------------------

  CREATE OR REPLACE FUNCTION "TASKER"."PBKDF2" 
( p_password   IN VARCHAR2
, p_salt       IN VARCHAR2
, p_count      IN INTEGER
, p_key_length IN INTEGER
)
  RETURN VARCHAR2
IS
  l_block_count INTEGER;
  l_last        RAW(32767);
  l_xorsum      RAW(32767);
  l_result      RAW(32767);
BEGIN
  l_block_count := ceil(p_key_length / 20);  -- 20 bytes for SHA1.

  FOR i IN 1..l_block_count
  LOOP
    l_last := utl_raw.concat(utl_raw.cast_to_raw(p_salt), utl_raw.cast_from_binary_integer(i, utl_raw.big_endian));

    l_xorsum := NULL;

    FOR j IN 1..p_count
    LOOP
      l_last := dbms_crypto.mac(l_last, dbms_crypto.hmac_sh1, utl_raw.cast_to_raw(p_password));

      IF l_xorsum IS NULL
      THEN
        l_xorsum := l_last;
      ELSE
        l_xorsum := utl_raw.bit_xor(l_xorsum, l_last);
      END IF;

    END LOOP;

    l_result := utl_raw.concat(l_result, l_xorsum);

  END LOOP;

  RETURN rawtohex(utl_raw.substr(l_result, 1, p_key_length));

END pbkdf2;

/
--------------------------------------------------------
--  DDL for Package APP_SETTINGS
--------------------------------------------------------

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
  * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
  * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
  * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
  * OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
  * OTHER DEALINGS IN THE SOFTWARE.
  *
  ******************************************************************************/
  FUNCTION get(
      setting_id VARCHAR2 )
    RETURN VARCHAR2;
  PROCEDURE SET(
      setting_id VARCHAR2,
      v          VARCHAR2 );
END APP_SETTINGS;

/
--------------------------------------------------------
--  DDL for Package PERSON_MGMT
--------------------------------------------------------

  CREATE OR REPLACE PACKAGE "TASKER"."PERSON_MGMT" 
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
type people_set
IS
  TABLE OF tasker.person%rowtype;
  /******************************************************************************
  *
  * FAUX CONSTANTS
  *
  ******************************************************************************/
  FUNCTION CAN_CREATE_PERSON
    RETURN VARCHAR2;
  FUNCTION CAN_MODIFY_PERSON
    RETURN VARCHAR2;
  /******************************************************************************
  *
  * PUBLIC METHODS
  *
  ******************************************************************************/
  FUNCTION create_person(
      p_from_user_id VARCHAR2,
      p_first_name   VARCHAR2,
      p_middle_name  VARCHAR2,
      p_last_name    VARCHAR2,
      p_as_user      VARCHAR2)
    RETURN INTEGER;
  PROCEDURE assign_administrator(
      p_administrator_id NUMBER,
      p_to_person        NUMBER,
      p_as_user          VARCHAR2 );
  PROCEDURE update_avatar_for_person(
      p_person_id NUMBER,
      p_avatar BLOB,
      p_as_user VARCHAR2 );
  FUNCTION get_people_administered_by(
      p_administrator_id NUMBER )
    RETURN people_set pipelined;
END PERSON_MGMT;

/
--------------------------------------------------------
--  DDL for Package SECURITY
--------------------------------------------------------

  CREATE OR REPLACE PACKAGE "TASKER"."SECURITY" 
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
  /** faux constants **/
  FUNCTION CAN_CHANGE_ANY_USER_PWD
    RETURN VARCHAR2;
  FUNCTION CAN_UNLOCK_USER
    RETURN VARCHAR2;
  /** methods **/
  FUNCTION authenticate_user(
      p_user_id   VARCHAR2,
      p_candidate VARCHAR2,
      p_session_id OUT NUMBER )
    RETURN VARCHAR2;
  FUNCTION verify_token(
      p_token VARCHAR2,
      p_auth_user OUT VARCHAR2,
      p_session_id OUT NUMBER )
    RETURN BOOLEAN;
  FUNCTION get_next_token(
      p_token VARCHAR2 )
    RETURN VARCHAR2;
  FUNCTION verify_password(
      p_user_id   VARCHAR2,
      p_candidate VARCHAR2 )
    RETURN BOOLEAN;
  FUNCTION can_user(
      p_user_id   VARCHAR2,
      p_privilege VARCHAR2 )
    RETURN BOOLEAN;
  FUNCTION gen_hash(
      p_password VARCHAR2,
      p_salt     VARCHAR2 )
    RETURN VARCHAR2;
  FUNCTION gen_salt
    RETURN VARCHAR2;
END SECURITY;

/
--------------------------------------------------------
--  DDL for Package TASK_MGMT
--------------------------------------------------------

  CREATE OR REPLACE PACKAGE "TASKER"."TASK_MGMT" 
AS
  /*******************************************************************************
  *
  * TASKER.TASK_MGMT PACKAGE
  * @author Kerri Shotts
  * @version 0.1.0
  * @license MIT
  *
  * Provides task management functions to the Tasker app built for
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
type task_set
IS
  TABLE OF tasker.task%rowtype;
type task_comment_set
IS
  TABLE OF tasker.task_comments%rowtype;
  /******************************************************************************
  *
  * FAUX CONSTANTS
  *
  ******************************************************************************/
  FUNCTION CAN_MODIFY_ANY_TASK
    RETURN VARCHAR2;
  FUNCTION CAN_ASSIGN_ANY_TASK_TO_ANYONE
    RETURN VARCHAR2;
  FUNCTION CAN_SEE_ANY_TASK
    RETURN VARCHAR2;
  FUNCTION CAN_COMMENT_ON_ANY_TASK
    RETURN VARCHAR2;
  FUNCTION CAN_REASSIGN_ANY_TASK
    RETURN VARCHAR2;
  FUNCTION CAN_CREATE_OWN_TASK
    RETURN VARCHAR2;
  FUNCTION CAN_CREATE_ANY_TASK
    RETURN VARCHAR2;
  FUNCTION CAN_MODIFY_OWN_TASK
    RETURN VARCHAR2;
  FUNCTION CAN_COMMENT_ON_OWN_TASK
    RETURN VARCHAR2;
  FUNCTION CAN_COMMENT_ON_ASSIGNED_TASK
    RETURN VARCHAR2;
  FUNCTION CAN_UPD_PROGRESS_ON_ASGND_TASK
    RETURN VARCHAR2;
  FUNCTION CAN_UPD_STATUS_ON_ASGND_TASK
    RETURN VARCHAR2;
  /******************************************************************************
  *
  * PUBLIC METHODS
  *
  ******************************************************************************/
  FUNCTION create_task(
      p_title       VARCHAR2,
      p_description VARCHAR2,
      p_owned_by    NUMBER,
      p_as_user     VARCHAR2 )
    RETURN INTEGER;
  PROCEDURE update_task_percentage(
      p_id         NUMBER,
      p_percentage NUMBER,
      p_as_user    VARCHAR2 );
  PROCEDURE update_task_status(
      p_id      NUMBER,
      p_status  VARCHAR2,
      p_as_user VARCHAR2 );
  FUNCTION get_task(
      p_task_id NUMBER,
      p_as_user VARCHAR2 )
    RETURN task_set pipelined;
  FUNCTION get_tasks(
      p_assigned_to          NUMBER DEFAULT NULL,
      p_owned_by             NUMBER DEFAULT NULL,
      p_with_status          VARCHAR2 DEFAULT NULL,
      p_with_completion_low  NUMBER DEFAULT 0,
      p_with_completion_high NUMBER DEFAULT 100,
      p_as_user              VARCHAR2 )
    RETURN task_set pipelined;
  FUNCTION create_task_comment(
      p_task_id NUMBER,
      p_comment VARCHAR2,
      p_as_user VARCHAR2 )
    RETURN INTEGER;
  FUNCTION get_comments_for_task(
      p_task_id NUMBER,
      p_as_user VARCHAR2 )
    RETURN task_comment_set pipelined;
END TASK_MGMT;

/
--------------------------------------------------------
--  DDL for Package USER_MGMT
--------------------------------------------------------

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
  FUNCTION CAN_CREATE_USER
    RETURN VARCHAR2;
  FUNCTION CAN_MODIFY_USER
    RETURN VARCHAR2;
  /******************************************************************************
  *
  * PUBLIC METHODS
  *
  ******************************************************************************/
  FUNCTION create_user(
      p_user_id  VARCHAR2,
      p_password VARCHAR2,
      p_as_user  VARCHAR2 )
    RETURN VARCHAR2;
  PROCEDURE change_user_status(
      p_user_id VARCHAR2,
      p_status  VARCHAR2,
      p_as_user VARCHAR2 );
  PROCEDURE change_user_password(
      p_user_id     VARCHAR2,
      p_oldPassword VARCHAR2,
      p_newPassword VARCHAR2,
      p_as_user     VARCHAR2);
  PROCEDURE unlock_user(
      p_user_id VARCHAR2,
      p_as_user VARCHAR2 );
END USER_MGMT;

/
--------------------------------------------------------
--  DDL for Package UTILS
--------------------------------------------------------

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
--------------------------------------------------------
--  DDL for Package Body APP_SETTINGS
--------------------------------------------------------

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
FUNCTION get(
    setting_id VARCHAR2 )
  RETURN VARCHAR2
AS
  v VARCHAR2(255);
BEGIN
  SELECT value INTO v FROM tasker.settings WHERE id = setting_id;
  RETURN v;
END get;
PROCEDURE SET(
    setting_id VARCHAR2,
    v          VARCHAR2 )
AS
  pragma autonomous_transaction;
  oldv VARCHAR2(255);
BEGIN
  oldv := get (setting_id);
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
--------------------------------------------------------
--  DDL for Package Body PERSON_MGMT
--------------------------------------------------------

  CREATE OR REPLACE PACKAGE BODY "TASKER"."PERSON_MGMT" 
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
FUNCTION CAN_CREATE_PERSON
  RETURN VARCHAR2
AS
BEGIN
  RETURN 'CAN_CREATE_PERSON';
END CAN_CREATE_PERSON;
FUNCTION CAN_MODIFY_PERSON
  RETURN VARCHAR2
AS
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
* @param p_first_name:varchar2      first name
* @param p_middle_name:varchar2     middle name
* @param p_last_name:varchar2       last name
* @param p_as_user:varchar2         acting as user
* @return integer                   new person ID
*
******************************************************************************/
FUNCTION create_person(
    p_from_user_id VARCHAR2,
    p_first_name   VARCHAR2,
    p_middle_name  VARCHAR2,
    p_last_name    VARCHAR2,
    p_as_user      VARCHAR2)
  RETURN INTEGER
AS
  pragma autonomous_transaction;
  new_id INTEGER;
BEGIN
  IF tasker.security.can_user ( p_as_user, CAN_CREATE_PERSON() ) THEN
    INSERT
    INTO person
      (
        id,
        user_id,
        first_name,
        middle_name,
        last_name,
        change_date,
        change_user
      )
      VALUES
      (
        person_seq.nextval,
        p_from_user_id,
        p_first_name,
        p_middle_name,
        p_last_name,
        sysdate,
        p_as_user
      )
    RETURNING id
    INTO new_id;
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
    p_as_user          VARCHAR2
  )
AS
  pragma autonomous_transaction;
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
* update_avatar_for_person
*
* Update the avatar for a specific individual
*
* @param p_person_id:number           person to change
* @param p_avatar:blob                avatar (JPG)
* @param p_as_user:varchar2           acting as user
*
******************************************************************************/
PROCEDURE update_avatar_for_person(
    p_person_id NUMBER,
    p_avatar BLOB,
    p_as_user VARCHAR2 )
AS
  pragma autonomous_transaction;
BEGIN
  IF tasker.security.can_user ( p_as_user, CAN_MODIFY_PERSON() ) THEN
    UPDATE person
    SET avatar    = p_avatar,
      change_date = sysdate,
      change_user = p_as_user
    WHERE id      = p_person_id;
    COMMIT;
  ELSE
    tasker.utils.E_ACCESS_DENIED();
  END IF;
END update_avatar_for_person;
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
    p_administrator_id NUMBER --, p_as_user varchar2
  )
  RETURN people_set pipelined
AS
  --as_user_person_id integer;
BEGIN
  --as_user_person_id := tasker.utils.get_person_id_from_user_id ( p_as_user );
  FOR r IN
  ( SELECT * FROM tasker.person WHERE administrator_id = p_administrator_id
  )
  LOOP
    pipe row (r);
  END LOOP;
END get_people_administered_by;
END PERSON_MGMT;

/
--------------------------------------------------------
--  DDL for Package Body SECURITY
--------------------------------------------------------

  CREATE OR REPLACE PACKAGE BODY "TASKER"."SECURITY" 
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
FUNCTION CAN_CHANGE_ANY_USER_PWD
  RETURN VARCHAR2
AS
BEGIN
  RETURN 'CAN_CHANGE_ANY_USER_PWD';
END;
FUNCTION CAN_UNLOCK_USER
  RETURN VARCHAR2
AS
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
    p_password   IN VARCHAR2 ,
    p_salt       IN VARCHAR2 ,
    p_count      IN INTEGER ,
    p_key_length IN INTEGER )
  RETURN VARCHAR2
IS
  l_block_count INTEGER;
  l_last RAW(32767);
  l_xorsum RAW(32767);
  l_result RAW(32767);
BEGIN
  l_block_count := ceil(p_key_length / 20); -- 20 bytes for SHA1.
  FOR i                             IN 1..l_block_count
  LOOP
    l_last   := utl_raw.concat(utl_raw.cast_to_raw(p_salt), utl_raw.cast_from_binary_integer(i, utl_raw.big_endian));
    l_xorsum := NULL;
    FOR j IN 1..p_count
    LOOP
      l_last      := dbms_crypto.mac(l_last, dbms_crypto.hmac_sh1, utl_raw.cast_to_raw(p_password));
      IF l_xorsum IS NULL THEN
        l_xorsum  := l_last;
      ELSE
        l_xorsum := utl_raw.bit_xor(l_xorsum, l_last);
      END IF;
    END LOOP;
    l_result := utl_raw.concat(l_result, l_xorsum);
  END LOOP;
  RETURN rawtohex(utl_raw.substr(l_result, 1, p_key_length));
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
  pragma autonomous_transaction;
BEGIN
  UPDATE tasker.users
  SET failed_login_attempts = failed_login_attempts + 1
  WHERE id                  = p_user_id;
  COMMIT;
END update_failed_login_for_user;
/******************************************************************************
*
* PUBLIC METHODS
*
******************************************************************************/
/**
* verify_password
*
* Verifies that the candidate password is valid for the specific user. Returns
* TRUE if valid; FALSE if not.
*
* @param p_user_id:varchar2      the user to test against
* @param p_candidate:varchar2    the candidate password to test
* @return boolean              TRUE if valid; FALSE if not
*
******************************************************************************/
FUNCTION verify_password(
    p_user_id   VARCHAR2,
    p_candidate VARCHAR2 )
  RETURN BOOLEAN
AS
  salt                  VARCHAR2(4000);
  stored_hash           VARCHAR2(4000);
  hash                  VARCHAR2(4000);
  failed_login_attempts INTEGER;
BEGIN
  -- get the stored salt and password for the user; false if no such user
  BEGIN
    SELECT password,
      salt,
      failed_login_attempts
    INTO stored_hash,
      salt,
      failed_login_attempts
    FROM TASKER.users
    WHERE id = p_user_id;
  EXCEPTION
  WHEN NO_DATA_FOUND THEN
    RETURN false;
  WHEN OTHERS THEN
    raise;
  END;
  -- if the # of failed login attempts is greater than allowed, fail out anyway
  IF failed_login_attempts > to_number(tasker.app_settings.get ('MAX_FAILED_LOGINS')) THEN
    RETURN false;
  END IF;
  -- hash the candidate
  hash := gen_hash ( p_candidate, salt );
  -- return if they match or not
  IF hash = stored_hash THEN
    RETURN true;
  ELSE
    update_failed_login_for_user ( p_user_id );
    RETURN false;
  END IF;
END verify_password;
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
    p_user_id   VARCHAR2,
    p_privilege VARCHAR2 )
  RETURN BOOLEAN
AS
  has_granted_privilege BOOLEAN := false;
BEGIN
  FOR r IN
  (SELECT role_id FROM user_roles WHERE user_id = p_user_id
  )
  LOOP
    FOR p IN
    (SELECT privilege,
      granted
    FROM roles
    WHERE id      = r.role_id
    AND privilege = p_privilege
    )
    LOOP
      IF p.granted             = 'Y' THEN
        has_granted_privilege := true;
      END IF;
    END LOOP;
  END LOOP;
  RETURN has_granted_privilege;
END can_user;
/**
* gen_salt
*
* Returns 48 random bytes suitable for a salt
*
* @returns VARCHAR2
*
******************************************************************************/
FUNCTION gen_salt
  RETURN VARCHAR2
AS
BEGIN
  RETURN UTL_RAW.CAST_TO_VARCHAR2(UTL_ENCODE.BASE64_ENCODE(SYS.dbms_crypto.randombytes(48)));
END gen_salt;
/**
* gen_hash
*
* Hashes a password and salt using PBKDF2
*
* @param p_password:varchar2  the password to hash
* @param p_salt:varchar2      the salt to use (use gen_salt)
* @return varchar2            the hash
*
******************************************************************************/
FUNCTION gen_hash(
    p_password VARCHAR2,
    p_salt     VARCHAR2 )
  RETURN VARCHAR2
AS
BEGIN
  RETURN pbkdf2(p_password, p_salt, 4096, 128);
END gen_hash;

function make_token_part return varchar2 as
begin
  return HEXTORAW(SYS.dbms_crypto.randombytes(128));
end;

procedure make_unique_token ( p_client_token out varchar2, p_db_token out varchar2 ) as
  token_1 varchar2(1998);
  token_2 varchar2(1998);
  token_1_hash varchar2(1998);
  dups number := 0;
begin
  /*
   * Notes: tokens are of the form: salt.token
   * Tokens in the database are stored using salt.token-hash
   * the idea here being that we don't want to continuously send the username
   * over the wire; this creates an easy attack surface.
   */
  LOOP
    token_1 := make_token_part();
    token_2 := make_token_part();
    token_1_hash := gen_hash ( token_1, token_2 );
    p_client_token := token_2 || '.' || token_1;
    p_db_token := token_2 || '.' || token_1_hash;
    -- make sure no one else has this token (unlikely)
    begin
      select count(*) into dups
        from sessions
       where token = p_db_token;
    exception 
      when NO_DATA_FOUND then
        dups := 0;
      when others then
        p_client_token := null;
        p_db_token := null;
        raise;
    end;   
    -- if we don't have a dup, exit
    EXIT WHEN DUPS = 0;
    -- if we do, go around again
  END LOOP;    
end;

function is_user_connected (p_user_id varchar2) return boolean as
  current_session sessions%rowtype;
begin
  begin
    select * into current_session
      from tasker.sessions
     where user_id = p_user_id
       and sysdate < expiry;
  exception 
    when NO_DATA_FOUND then
      return false;
    when others then
      raise;
  end;
  return true;
end;

function authenticate_user ( 
  p_user_id varchar2, p_candidate varchar2, p_session_id out number ) return varchar2 as
  client_token varchar2(4000);
  db_token varchar2(4000);
  dups number := 0;
  session_id integer := 0;
begin
  if verify_password ( p_user_id, p_candidate ) then
  
    make_unique_token ( client_token, db_token );
    
    session_id := sessions_seq.nextval();
    insert into sessions ( id, user_id, token, expiry )
                  values ( session_id, p_user_id, db_token, sysdate + to_number(tasker.app_settings.get('TOKEN_EXPIRY')) );
    
  else
    tasker.utils.E_ACCESS_DENIED();
  end if;
  return client_token;
end;

function verify_token ( 
  p_token varchar2, p_auth_user out varchar2, p_session_id out number ) return boolean as
  current_session sessions%ROWTYPE;
  candidate_salt varchar2(4000);
  candidate_token varchar2(4000);
  candidate_token_hash varchar2(4000);
  dot_index number := 0;
begin
  -- token are of the form salt.token
  dot_index := instr(p_token, '.');
  if dot_index > 0 then
    candidate_salt := substr(p_token, 1, dot_index - 1);
    candidate_token := substr(p_token, dot_index+1, length(p_token));
    -- next, hash the token
    candidate_token_hash := gen_hash ( candidate_token, candidate_salt );
    -- get the corresponding session, if it exists
    begin
      select * into current_session
        from sessions
       where token = candidate_token_hash
         and sysdate < expiry;
    exception
      when NO_DATA_FOUND then
        return false;
      when others then
        raise;
    end;
    -- set the user that matches
    p_auth_user := current_session.user_id;
    p_session_id := current_session.id;
    -- shorten the token's expiry
    update sessions
       set expiry = sysdate+ (5/1440)
     where id = p_session_id;
    -- and indicate verification
    return true;
  end if;
  return false;
end;

function get_next_token ( p_token varchar2 ) return varchar2 as
  client_token varchar2(4000);
  db_token varchar2(4000);
  auth_user varchar2(32);
  session_id number;
begin
  if verify_token ( p_token, auth_user, session_id ) then
    make_unique_token ( client_token, db_token );
    
    update sessions
       set token = db_token,
           expiry = sysdate + to_number(tasker.app_settings.get('TOKEN_EXPIRY'))
     where id = session_id;        
  else
    RAISE_APPLICATION_ERROR (-20002, 'Token mismatch');
  end if;
    return client_token;
end;




END SECURITY;

/
--------------------------------------------------------
--  DDL for Package Body TASK_MGMT
--------------------------------------------------------

  CREATE OR REPLACE PACKAGE BODY "TASKER"."TASK_MGMT" 
AS
  /*******************************************************************************
  *
  * TASKER.TASK_MGMT PACKAGE
  * @author Kerri Shotts
  * @version 0.1.0
  * @license MIT
  *
  * Provides task management functions to the Tasker app built for
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
FUNCTION CAN_MODIFY_ANY_TASK
  RETURN VARCHAR2
AS
BEGIN
  RETURN 'CAN_MODIFY_ANY_TASK';
END CAN_MODIFY_ANY_TASK;
FUNCTION CAN_ASSIGN_ANY_TASK_TO_ANYONE
  RETURN VARCHAR2
AS
BEGIN
  RETURN 'CAN_ASSIGN_ANY_TASK_TO_ANYONE';
END CAN_ASSIGN_ANY_TASK_TO_ANYONE;
FUNCTION CAN_SEE_ANY_TASK
  RETURN VARCHAR2
AS
BEGIN
  RETURN 'CAN_SEE_ANY_TASK';
END CAN_SEE_ANY_TASK;
FUNCTION CAN_COMMENT_ON_ANY_TASK
  RETURN VARCHAR2
AS
BEGIN
  RETURN 'CAN_COMMENT_ON_ANY_TASK';
END CAN_COMMENT_ON_ANY_TASK;
FUNCTION CAN_REASSIGN_ANY_TASK
  RETURN VARCHAR2
AS
BEGIN
  RETURN 'CAN_REASSIGN_ANY_TASK';
END CAN_REASSIGN_ANY_TASK;
FUNCTION CAN_CREATE_ANY_TASK
  RETURN VARCHAR2
AS
BEGIN
  RETURN 'CAN_CREATE_ANY_TASK';
END CAN_CREATE_ANY_TASK;
FUNCTION CAN_CREATE_OWN_TASK
  RETURN VARCHAR2
AS
BEGIN
  RETURN 'CAN_CREATE_OWN_TASK';
END CAN_CREATE_OWN_TASK;
FUNCTION CAN_MODIFY_OWN_TASK
  RETURN VARCHAR2
AS
BEGIN
  RETURN 'CAN_MODIFY_OWN_TASK';
END CAN_MODIFY_OWN_TASK;
FUNCTION CAN_COMMENT_ON_OWN_TASK
  RETURN VARCHAR2
AS
BEGIN
  RETURN 'CAN_COMMENT_ON_OWN_TASK';
END CAN_COMMENT_ON_OWN_TASK;
FUNCTION CAN_COMMENT_ON_ASSIGNED_TASK
  RETURN VARCHAR2
AS
BEGIN
  RETURN 'CAN_COMMENT_ON_ASSIGNED_TASK';
END CAN_COMMENT_ON_ASSIGNED_TASK;
FUNCTION CAN_UPD_PROGRESS_ON_ASGND_TASK
  RETURN VARCHAR2
AS
BEGIN
  RETURN 'CAN_UPD_PROGRESS_ON_ASGND_TASK';
END CAN_UPD_PROGRESS_ON_ASGND_TASK;
FUNCTION CAN_UPD_STATUS_ON_ASGND_TASK
  RETURN VARCHAR2
AS
BEGIN
  RETURN 'CAN_UPD_STATUS_ON_ASGND_TASK';
END CAN_UPD_STATUS_ON_ASGND_TASK;
/******************************************************************************
*
* PUBLIC METHODS
*
******************************************************************************/
/**
* create_task
*
* create a task for a user. The user must be able to create their own tasks
* or must be able to create any task.
*
* @param p_title:varchar2         title of task
* @param p_description:varchar2   description
* @param p_owned_by:integer       owner
* @param p_as_user:varchar2       acting as
* @return integer                 ID of new task
*
******************************************************************************/
FUNCTION create_task(
    p_title       VARCHAR2,
    p_description VARCHAR2,
    p_owned_by    NUMBER,
    p_as_user     VARCHAR2 )
  RETURN INTEGER
AS
  pragma autonomous_transaction;
  user_person_id INTEGER;
  return_id      INTEGER;
BEGIN
  user_person_id     := tasker.utils.get_person_id_from_user_id ( p_as_user );
  IF (user_person_id != p_owned_by) THEN
    IF NOT tasker.security.can_user ( p_as_user, CAN_CREATE_ANY_TASK() ) THEN
      tasker.utils.E_ACCESS_DENIED();
    END IF;
  END IF;
  IF tasker.security.can_user ( p_as_user, CAN_CREATE_OWN_TASK() ) OR tasker.security.can_user ( p_as_user, CAN_CREATE_ANY_TASK() ) THEN
    INSERT
    INTO tasker.task
      (
        id,
        title,
        description,
        pct_complete,
        status,
        owner,
        assigned_to,
        change_date,
        change_user
      )
      VALUES
      (
        tasker.task_seq.NEXTVAL,
        p_title,
        p_description,
        0,
        'I',
        p_owned_by,
        NULL,
        sysdate,
        p_as_user
      )
    RETURNING id
    INTO return_id;
    COMMIT;
    RETURN return_id;
  ELSE
    tasker.utils.E_ACCESS_DENIED();
  END IF;
  RETURN NULL;
END create_task;
/**
* update_task_percentage
*
* updates the percentage of a task. The user must be able to modify their
* own task (if the task is owned by the logged-in user), or be able to modify
* any task.
*
* @param p_id:integer        task id
* @param p_percentage:number percentage 0-100
* @param p_as_user:varchar2  acting as
*
******************************************************************************/
PROCEDURE update_task_percentage
  (
    p_id         NUMBER,
    p_percentage NUMBER,
    p_as_user    VARCHAR2
  )
AS
  user_person_id INTEGER;
  task tasker.task%rowtype;
BEGIN
  user_person_id := tasker.utils.get_person_id_from_user_id ( p_as_user );
  SELECT * INTO task FROM tasker.task WHERE id = p_id;
  IF task.owner         != user_person_id THEN
    IF task.assigned_to != user_person_id THEN
      IF NOT tasker.security.can_user ( p_as_user, CAN_MODIFY_ANY_TASK() ) THEN
        tasker.utils.E_ACCESS_DENIED();
      END IF;
    ELSE
      IF NOT tasker.security.can_user ( p_as_user, CAN_UPD_PROGRESS_ON_ASGND_TASK() ) THEN
        tasker.utils.E_ACCESS_DENIED();
      END IF;
    END IF;
  END IF;
  IF tasker.security.can_user ( p_as_user, CAN_MODIFY_OWN_TASK() ) OR tasker.security.can_user ( p_as_user, CAN_MODIFY_ANY_TASK() ) OR tasker.security.can_user ( p_as_user, CAN_UPD_PROGRESS_ON_ASGND_TASK() ) THEN
    UPDATE tasker.task
    SET pct_complete = p_percentage,
      change_date    = sysdate,
      change_user    = p_as_user
    WHERE id         = p_id;
    COMMIT;
  ELSE
    tasker.utils.E_ACCESS_DENIED();
  END IF;
END update_task_percentage;
/**
* update_task_status
*
* updates the status of a task. The user must be able to modify their
* own task (if the task is owned by the logged-in user), or be able to modify
* any task.
*
* @param p_id:integer        task id
* @param p_percentage:number percentage 0-100
* @param p_as_user:varchar2  acting as
*
******************************************************************************/
PROCEDURE update_task_status(
    p_id      NUMBER,
    p_status  VARCHAR2,
    p_as_user VARCHAR2 )
AS
  user_person_id INTEGER;
  task tasker.task%rowtype;
BEGIN
  user_person_id := tasker.utils.get_person_id_from_user_id ( p_as_user );
  SELECT * INTO task FROM tasker.task WHERE id = p_id;
  IF task.owner         != user_person_id THEN
    IF task.assigned_to != user_person_id THEN
      IF NOT tasker.security.can_user ( p_as_user, CAN_MODIFY_ANY_TASK() ) THEN
        tasker.utils.E_ACCESS_DENIED();
      END IF;
    ELSE
      IF NOT tasker.security.can_user ( p_as_user, CAN_UPD_STATUS_ON_ASGND_TASK() ) THEN
        tasker.utils.E_ACCESS_DENIED();
      END IF;
    END IF;
  END IF;
  IF tasker.security.can_user ( p_as_user, CAN_MODIFY_OWN_TASK() ) OR tasker.security.can_user ( p_as_user, CAN_MODIFY_ANY_TASK() ) OR tasker.security.can_user ( p_as_user, CAN_UPD_STATUS_ON_ASGND_TASK() ) THEN
    UPDATE tasker.task
    SET status    = p_status,
      change_date = sysdate,
      change_user = p_as_user
    WHERE id      = p_id;
    COMMIT;
  ELSE
    tasker.utils.E_ACCESS_DENIED();
  END IF;
END update_task_status;
/**
* get_task
*
* returns a task given an id #, assuming the user has rights to see the data
*
* @param p_task_id:integer      the task id
* @return table of tasks
*
*/
FUNCTION get_task(
    p_task_id NUMBER,
    p_as_user VARCHAR2 )
  RETURN task_set pipelined
AS
  user_person_id INTEGER;
  task tasker.task%rowtype;
BEGIN
  user_person_id := tasker.utils.get_person_id_from_user_id ( p_as_user );
  SELECT *
  INTO task
  FROM tasker.task
  WHERE id         = p_task_id;
  IF ((task.owner != user_person_id) OR (task.assigned_to != user_person_id)) AND NOT tasker.security.can_user ( p_as_user, CAN_SEE_ANY_TASK() ) THEN
    tasker.utils.E_ACCESS_DENIED();
  END IF;
  pipe row (task);
END get_task;
/**
* get_tasks
*
* Returns tasks matching the specified criteria, assuming the user has rights
* to see the data.
*
* @param p_assigned_to:integer         (optional) return tasks assigned to a given user
* @param p_owned_by:integer            (optional) return tasks owned by a given user
* @param p_with_status:varchar2        (optional) returns tasks with a certain status
* @param p_with_completion_low:number  (optional) returns tasks with >= %s
* @param p_with_completion_high:number (optional) returns tasks with <= %s
* @param p_as_user                     acting as usr
*
* @return pipelined table of tasks
*
******************************************************************************/
FUNCTION get_tasks(
    p_assigned_to          NUMBER DEFAULT NULL,
    p_owned_by             NUMBER DEFAULT NULL,
    p_with_status          VARCHAR2 DEFAULT NULL,
    p_with_completion_low  NUMBER DEFAULT 0,
    p_with_completion_high NUMBER DEFAULT 100,
    p_as_user              VARCHAR2 )
  RETURN task_set pipelined
AS
  user_person_id         INTEGER;
  can_see_any_task_cache BOOLEAN;
  allowed_to_see         BOOLEAN := false;
BEGIN
  user_person_id         := tasker.utils.get_person_id_from_user_id ( p_as_user );
  can_see_any_task_cache := tasker.security.can_user ( p_as_user, CAN_SEE_ANY_TASK() );
  FOR r  IN
  (SELECT *
  FROM tasker.task
  WHERE assigned_to = NVL(p_assigned_to, assigned_to)
  AND owner         = NVL(p_owned_by, owner)
  AND status        = NVL(p_with_status, status)
  AND pct_complete BETWEEN p_with_completion_low AND p_with_completion_high
  )
  LOOP
    allowed_to_see   := can_see_any_task_cache;
    IF (r.owner       = user_person_id) THEN
      allowed_to_see := true;
    END IF;
    IF (r.assigned_to = user_person_id) THEN
      allowed_to_see := true;
    END IF;
    IF NOT allowed_to_see THEN
      CONTINUE;
    END IF;
    pipe row (r);
  END LOOP;
END get_tasks;
/**
* create_task_comment
*
* Create a comment for a given task. User must have rights to either comment
* on own task, an assigned task, or modify any task.
*
* @param p_task_id:number         task id
* @param p_comment:varchar2       comment
* @param p_as_user:varchar2       acting as user
* @return integer                 comment id
*
******************************************************************************/
FUNCTION create_task_comment(
    p_task_id NUMBER,
    p_comment VARCHAR2,
    p_as_user VARCHAR2 )
  RETURN INTEGER
AS
  user_person_id INTEGER;
  task tasker.task%rowtype;
  return_id INTEGER;
BEGIN
  user_person_id := tasker.utils.get_person_id_from_user_id ( p_as_user );
  SELECT * INTO task FROM tasker.task WHERE id = p_task_id;
  IF task.owner         != user_person_id THEN
    IF task.assigned_to != user_person_id THEN
      IF NOT tasker.security.can_user ( p_as_user, CAN_MODIFY_ANY_TASK() ) THEN
        tasker.utils.E_ACCESS_DENIED();
      END IF;
    ELSE
      IF NOT tasker.security.can_user ( p_as_user, CAN_COMMENT_ON_ASSIGNED_TASK() ) THEN
        tasker.utils.E_ACCESS_DENIED();
      END IF;
    END IF;
  END IF;
  IF tasker.security.can_user ( p_as_user, CAN_COMMENT_ON_OWN_TASK() ) OR tasker.security.can_user ( p_as_user, CAN_MODIFY_ANY_TASK() ) OR tasker.security.can_user ( p_as_user, CAN_COMMENT_ON_ASSIGNED_TASK() ) THEN
    INSERT
    INTO tasker.task_comments
      (
        id,
        task,
        comments,
        change_date,
        change_user,
        author
      )
      VALUES
      (
        tasker.task_comment_seq.NEXTVAL,
        p_task_id,
        p_comment,
        sysdate,
        p_as_user,
        p_as_user
      )
    RETURNING id
    INTO return_id;
    COMMIT;
    RETURN return_id;
  ELSE
    tasker.utils.E_ACCESS_DENIED();
  END IF;
  RETURN NULL;
END create_task_comment;
/**
* get_comments_for_task
*
* returns task comments for a given task, assuming the user has rights
* to see the comments
*
* @p_task_id:integer           task id
* @p_as_user:varchar2          acting as user
* @return pipelined table of comments
*
******************************************************************************/
FUNCTION get_comments_for_task
  (
    p_task_id NUMBER,
    p_as_user VARCHAR2
  )
  RETURN task_comment_set pipelined
AS
  user_person_id         INTEGER;
  can_see_any_task_cache BOOLEAN;
  task_comment tasker.task_comments%rowtype;
BEGIN
  user_person_id         := tasker.utils.get_person_id_from_user_id ( p_as_user );
  can_see_any_task_cache := tasker.security.can_user ( p_as_user, CAN_SEE_ANY_TASK() );
  FOR r IN
  (SELECT c.ID ID,
      c.TASK TASK,
      c.COMMENTS COMMENTS,
      c.CHANGE_DATE CHANGE_DATE,
      c.CHANGE_USER CHANGE_USER,
      c.AUTHOR AUTHOR,
      t.owner,
      t.assigned_to
    FROM tasker.task_comments c,
      tasker.task t
    WHERE c.task = t.id
  )
  LOOP
    IF
      (
        (r.owner != user_person_id) OR (r.assigned_to != user_person_id)
      )
      AND NOT can_see_any_task_cache THEN
      CONTINUE;
    END IF;
    task_comment.id          := r.id;
    task_comment.task        := r.task;
    task_comment.comments    := r.comments;
    task_comment.change_date := r.change_date;
    task_comment.change_user := r.change_user;
    task_comment.author      := r.author;
    pipe row (task_comment);
  END LOOP;
END get_comments_for_task;
END TASK_MGMT;

/
--------------------------------------------------------
--  DDL for Package Body USER_MGMT
--------------------------------------------------------

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
FUNCTION CAN_CREATE_USER
  RETURN VARCHAR2
AS
BEGIN
  RETURN 'CAN_CREATE_USER';
END CAN_CREATE_USER;
FUNCTION CAN_MODIFY_USER
  RETURN VARCHAR2
AS
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
    p_as_user  VARCHAR2 )
  RETURN VARCHAR2
AS
pragma autonomous_transaction;
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
    INTO users
      (
        ID,
        password,
        salt,
        status,
        change_date,
        change_user
      )
      VALUES
      (
        p_user_id,
        new_hash,
        new_salt,
        'A',
        sysdate,
        p_as_user
      );
      commit;
  ELSE
    tasker.utils.E_ACCESS_DENIED();
  END IF;
  return p_user_id;
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
    p_as_user VARCHAR2
  )
AS
pragma autonomous_transaction;
BEGIN
  -- Verify the user has actual rights to modify users
  IF tasker.security.can_user( p_as_user, CAN_MODIFY_USER() ) THEN
    -- update the status
    UPDATE users
    SET status    = status,
      change_date = sysdate,
      change_user = p_as_user
    WHERE id      = p_user_id;
    commit;
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
    p_as_user     VARCHAR2)
AS
  pragma autonomous_transaction;
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
      change_user = p_as_user
    WHERE id      = p_user_id;
    COMMIT;
  ELSE
    IF p_user_id = p_as_user THEN
      IF tasker.security.verify_password( p_user_id, p_oldPassword ) THEN
        UPDATE users
        SET password  = new_hash,
          salt        = new_salt,
          change_date = sysdate,
          change_user = p_as_user
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
    p_as_user VARCHAR2 )
AS
  pragma autonomous_transaction;
BEGIN
  IF tasker.security.can_user ( p_user_id, tasker.security.CAN_UNLOCK_USER() ) THEN
    UPDATE users SET failed_login_attempts = 0 WHERE id = p_user_id;
    COMMIT;
  ELSE
    tasker.utils.E_ACCESS_DENIED();
  END IF;
END unlock_user;
END USER_MGMT;

/
--------------------------------------------------------
--  DDL for Package Body UTILS
--------------------------------------------------------

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
