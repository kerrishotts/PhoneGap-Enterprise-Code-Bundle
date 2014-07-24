/*
SELECT *
  FROM tasker.task
  WHERE assigned_to = NVL(null, assigned_to)
  AND owner         = NVL(2, owner)
  AND status        = NVL(null, status)
  AND pct_complete BETWEEN 0 AND 100;
*/

select * from table(tasker.task_mgmt.get_tasks( p_owned_by=>2, p_as_user=>'BSMITH' ));


declare
  b boolean;
  i integer;
  p_as_user varchar2(32) := 'JDOE';
begin
  i:= tasker.utils.get_person_id_from_user_id ( p_as_user );
  dbms_output.put_line ( i);
  b:= tasker.security.can_user ( p_as_user, 'CAN_SEE_ANY_TASK' );
  if b then 
    dbms_output.put_line ( 'YES');
  else
    dbms_output.put_line ( 'NO');
  end if;
end;

/*
declare
  string_id varchar2(32);
  number_id integer;
begin
  --tasker.user_mgmt.change_user_password ('SYSADMIN', '', 'password', 'SYSADMIN');
  --string_id := tasker.user_mgmt.create_user ('BSMITH', 'password', 'SYSADMIN');
  --string_id := tasker.user_mgmt.create_user ('JDOE', 'password', 'SYSADMIN');
  --number_id := tasker.person_mgmt.create_person ( 'JDOE', 'John', '', 'Doe', 'SYSADMIN' );
  --number_id := tasker.person_mgmt.create_person ( 'BSMITH', 'Bob', 'A', 'Smith', 'SYSADMIN' );  
  --tasker.person_mgmt.assign_administrator ( 2, 3, 'SYSADMIN' );
  --number_id := tasker.task_mgmt.create_task ( 
  --'Push new version of website', 
  --'Shouldn''t take too long. Let me know if you have problems',
  --2,
  --'JDOE' );
  --
   null;
end;
*/
