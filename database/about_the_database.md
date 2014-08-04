# About the Database

The database engine is Oracle 11gR2 (Express Edition). This should work on any Oracle 
edition 11gR2 or later. At the time of this writing, 12c is not available in an 
Express Edition. 

## Installing Tasker

Once the database has been installed (see `../digital_ocean/pge-db`), follow the
following steps to install Tasker into the database:

1. Log in to the database:

        sqlplus / as sysdba

2. Create a new tablespace named `TASKER`:

        create tablespace TASKER logging
        datafile '/u01/app/oracle/oradata/XE/tasker.dbf' 
        size 64m autoextend on next 64m maxsize unlimited
        extent management local;

3. Create FOUR users; the first two are to be locked ALWAYS:

        create user TASKER_DATA identified by 'password' 
        default tablespace TASKER temporary tablespace TEMP
        account LOCK;
        
        create user TASKER_API identified by 'password' 
        default tablespace TASKER temporary tablespace TEMP
        account LOCK;

        create user TASKER_CLIENT identified by 'password' 
        default tablespace TASKER temporary tablespace TEMP;

        create user TASKER_ADMIN identified by 'password' 
        default tablespace TASKER temporary tablespace TEMP;
        
4. 

## Settings

Settings are controlled in the `TASKER_DATA.SETTINGS` table. In order to effect
changes, one must have the `TASKER_ADMIN` role. The following settings are understood:

...

## Layers

There are several layers implemented in the Database server for Tasker:

* Data Layer
* API Layer (Security, Permissions, etc.) and Business Logic Layer

### Data Layer

The data layer is owned by the `TASKER_DATA` schema. This account is LOCKED and does
not permit direct access. Access to data is provided indirectly via `TASKER_API`'s 
packages and views.

The data layer includes the `USER`, `PEOPLE`, `TASK`, `TASK_COMMENTS`, etc., tables.

> *Note*: This schema is defined in `TASKER_DATA.SETTINGS` under `DATA_SCHEMA`

### API Layer

The API layer is owned by `TASKER_API`. This account is also LOCKED and does not permit
direct access. Access is permitted to specified users who have the right to query data
present in this schema and who have the right to execute stored procedures in this
schema.

> *Note*: This schema is defined in `TASKER_DATA.SETTINGS` under `API_SCHEMA`

The API layer includes the necessary packages that manipulate the underlying data, as
well as any views that take user permissions into account when returning data.

### Database Security, User authentication, etc.

The system as built supports multiple mechanisms for user access:

* User logs into database directly (via any number of tools)
* User logs into database via Tasker Mobile application (Web app would work this way too)

In the first situation, the process is as follows:

1. Authentication occurs against the database. This means that it's really a good idea 
to have user authentication actually handled outside of the system completely (via LDAP 
or something similar), otherwise it is likely that the user's database password and 
their application password will not be in sync. (Though this may or may not be 
considered a problem. 

2. The user's current schema is altered with a logon trigger so that no public or 
private synonyms are necessary. Should the schema name be altered, it is critical that 
the logon trigger is appropriately modified.

        ALTER SESSION SET CURRENT_SCHEMA = TASKER_API;

3. The user can then access resources via the Tasker API packages. Access to the tables 
is via either a SP or a view.

*Note*: Users authenticated in this manner do **not** have access to Tasker's security
functions, including calling `SECURITY.authenticate` and `verify_token`.

In the second situation, the process is as follows:

1. The client connects to the database as `TASKER_CLIENT`, which is a privileged user that
has the ability to authenticate the user upon the client's request.

2. The current schema is set within the same logon trigger as the first mechanism.

3. `SECURITY.authenticate_user` or `SECURITY.VERIFY_TOKEN` is called which then sets
a session context variable that indicates the current user has been authorized. This
context session is only verified when the logged on user is `TASKER_CLIENT` to prevent a
user authenticated by the database from hijacking another user's rights. 

    > **Note**: The schema that checks the context variable is determined by a setting
    > in the TASKER_DATA.`SETTINGS` table. Should this schema need to be changed,
    > be sure to update this value.
    
4. The client then executes the desired SP or queries the appropriate view.

5. As long as the client is connected or until another authentication/verify request is
executed, the connection behaves as if it is the user requested in step 3.

There are some special considerations when it comes to the schemas relating directly to
Tasker (`TASKER_CLIENT`, `TASKER_API`, `TASKER_DATA`). `TASKER_CLIENT` is the only account
that is permitted to essentially proxy to another user -- and as such its security is
paramount. The other two accounts should remain LOCKED at all times -- allowing access
to these accounts would enable an attacker to bypass any and all permission checks.

### Database User Roles

In order to appropriately restrict access to users and Tasker schemas, there are several
roles available:

* `TASKER_USER` provides access to `TASKER_API`'s packages **EXCEPT** the security
routines. It also provides access to the views in the same schema.

* `TASKER_API` provides access to the security routines in `TASKER_API` as
well as the grants permitted by the prior role.

* `TASKER_ADMIN` should only be applied on highly controlled accounts. These
accounts will gain the ability to edit the data *directly* on the `TASKER_DATA`
schema.

