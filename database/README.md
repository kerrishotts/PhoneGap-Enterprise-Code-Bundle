# About the Database

The database engine is Oracle 11gR2 (Express Edition). This should work on any Oracle 
edition 11gR2 or later. At the time of this writing, 12c is not available in an 
Express Edition. 

> NOTE: This is *not* how I would suggest structuring your database in a production enterprise environment.
> For educational purposes, the data and API tiers are combined, but in a real environment, I would
> break these out into multiple tiers -- the data living in one schema, heavily protected, the APIs living
> in another two schemas (security and app APIs), and a separate layer for views. The idea would be to
> segregate each layer such that it would be possible to allow access to the data via views to typical
> user accounts while also allowing access to the more privileged code and data using very specific and
> controlled accounts. How to do this is beyond the scope of this project, and varies by database platform.

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

3. Create a new user called `TASKER`

4. Assign the following privileges to TASKER (from a SYSDBA):

        grant create any context to tasker
        grant execute on dbms_session to tasker

5. Run the following SQL files to create the various objects (as the Tasker user):

  - sequences.sql
  - tables.sql
  - app_settings.sql
  - person_mgmt.sql
  - security.sql
  - session_context.sql
  - task_mgmt.sql
  - user_mgmt.sql
  - utils.sql

6. Create the necessary context as Tasker:

        create context tasker_ctx using session_context accessed globally;
        
7. Execute the sample_data.sql file to create some sample data as the Tasker user.


## Settings

Settings are controlled in the `TASKER.SETTINGS` table. 

...


