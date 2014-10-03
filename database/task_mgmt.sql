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
TYPE task_set IS TABLE OF tasker.task%ROWTYPE;
TYPE task_comment_set IS TABLE OF tasker.task_comments%ROWTYPE;
  /******************************************************************************
  *
  * FAUX CONSTANTS
  *
  ******************************************************************************/
  FUNCTION CAN_MODIFY_ANY_TASK RETURN VARCHAR2;
  FUNCTION CAN_ASSIGN_ANY_TASK_TO_ANYONE RETURN VARCHAR2;
  FUNCTION CAN_SEE_ANY_TASK RETURN VARCHAR2;
  FUNCTION CAN_COMMENT_ON_ANY_TASK RETURN VARCHAR2;
  FUNCTION CAN_REASSIGN_ANY_TASK RETURN VARCHAR2;
  FUNCTION CAN_CREATE_OWN_TASK RETURN VARCHAR2;
  FUNCTION CAN_CREATE_ANY_TASK RETURN VARCHAR2;
  FUNCTION CAN_MODIFY_OWN_TASK RETURN VARCHAR2;
  FUNCTION CAN_COMMENT_ON_OWN_TASK RETURN VARCHAR2;
  FUNCTION CAN_COMMENT_ON_ASSIGNED_TASK RETURN VARCHAR2;
  FUNCTION CAN_UPD_PROGRESS_ON_ASGND_TASK RETURN VARCHAR2;
  FUNCTION CAN_UPD_STATUS_ON_ASGND_TASK RETURN VARCHAR2;
  /******************************************************************************
  *
  * PUBLIC METHODS
  *
  ******************************************************************************/
  FUNCTION create_task(
      p_title       VARCHAR2,
      p_description VARCHAR2,
      p_owned_by    NUMBER DEFAULT NULL,
      p_as_user     VARCHAR2 DEFAULT NULL)
    RETURN INTEGER;
  PROCEDURE update_task_percentage(
      p_id         NUMBER,
      p_percentage NUMBER,
      p_as_user    VARCHAR2 DEFAULT NULL);
  PROCEDURE update_task_status(
      p_id      NUMBER,
      p_status  VARCHAR2,
      p_as_user VARCHAR2 DEFAULT NULL);
PROCEDURE assign_task(
    p_id      NUMBER,
    p_assignee  NUMBER,
    p_as_user VARCHAR2 DEFAULT NULL );
  FUNCTION get_task(
      p_task_id NUMBER,
      p_as_user VARCHAR2 DEFAULT NULL)
    RETURN task_set pipelined;
  FUNCTION get_tasks(
      p_assigned_to          NUMBER DEFAULT NULL,
      p_owned_by             NUMBER DEFAULT NULL,
      p_with_status          VARCHAR2 DEFAULT NULL,
      p_with_completion_low  NUMBER DEFAULT 0,
      p_with_completion_high NUMBER DEFAULT 100,
      p_as_user              VARCHAR2 default null)
    RETURN task_set pipelined;
  FUNCTION create_task_comment(
      p_task_id NUMBER,
      p_comment VARCHAR2,
      p_as_user VARCHAR2 default null)
    RETURN INTEGER;
  FUNCTION get_comments_for_task(
      p_task_id NUMBER,
      p_as_user VARCHAR2 default null)
    RETURN task_comment_set pipelined;
END TASK_MGMT;
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
FUNCTION CAN_MODIFY_ANY_TASK RETURN VARCHAR2 AS
BEGIN
  RETURN 'CAN_MODIFY_ANY_TASK';
END CAN_MODIFY_ANY_TASK;

FUNCTION CAN_ASSIGN_ANY_TASK_TO_ANYONE RETURN VARCHAR2 AS
BEGIN
  RETURN 'CAN_ASSIGN_ANY_TASK_TO_ANYONE';
END CAN_ASSIGN_ANY_TASK_TO_ANYONE;

FUNCTION CAN_SEE_ANY_TASK RETURN VARCHAR2 AS
BEGIN
  RETURN 'CAN_SEE_ANY_TASK';
END CAN_SEE_ANY_TASK;

FUNCTION CAN_COMMENT_ON_ANY_TASK RETURN VARCHAR2 AS
BEGIN
  RETURN 'CAN_COMMENT_ON_ANY_TASK';
END CAN_COMMENT_ON_ANY_TASK;

FUNCTION CAN_REASSIGN_ANY_TASK RETURN VARCHAR2 AS
BEGIN
  RETURN 'CAN_REASSIGN_ANY_TASK';
END CAN_REASSIGN_ANY_TASK;

FUNCTION CAN_CREATE_ANY_TASK RETURN VARCHAR2 AS
BEGIN
  RETURN 'CAN_CREATE_ANY_TASK';
END CAN_CREATE_ANY_TASK;

FUNCTION CAN_CREATE_OWN_TASK RETURN VARCHAR2 AS
BEGIN
  RETURN 'CAN_CREATE_OWN_TASK';
END CAN_CREATE_OWN_TASK;

FUNCTION CAN_MODIFY_OWN_TASK RETURN VARCHAR2 AS
BEGIN
  RETURN 'CAN_MODIFY_OWN_TASK';
END CAN_MODIFY_OWN_TASK;

FUNCTION CAN_COMMENT_ON_OWN_TASK RETURN VARCHAR2 AS
BEGIN
  RETURN 'CAN_COMMENT_ON_OWN_TASK';
END CAN_COMMENT_ON_OWN_TASK;

FUNCTION CAN_COMMENT_ON_ASSIGNED_TASK RETURN VARCHAR2 AS
BEGIN
  RETURN 'CAN_COMMENT_ON_ASSIGNED_TASK';
END CAN_COMMENT_ON_ASSIGNED_TASK;

FUNCTION CAN_UPD_PROGRESS_ON_ASGND_TASK RETURN VARCHAR2 AS
BEGIN
  RETURN 'CAN_UPD_PROGRESS_ON_ASGND_TASK';
END CAN_UPD_PROGRESS_ON_ASGND_TASK;

FUNCTION CAN_UPD_STATUS_ON_ASGND_TASK RETURN VARCHAR2 AS
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
    p_owned_by    NUMBER DEFAULT NULL,
    p_as_user     VARCHAR2 DEFAULT NULL)
  RETURN INTEGER
AS
  PRAGMA AUTONOMOUS_TRANSACTION;
  user_person_id INTEGER;
  owner_id       INTEGER;
  return_id      INTEGER;
BEGIN
  user_person_id     := tasker.utils.get_person_id_from_user_id ( p_as_user );
  owner_id := nvl(p_owned_by, user_person_id);
  IF (user_person_id != owner_id) THEN
    IF NOT tasker.security.can_user ( p_as_user, CAN_CREATE_ANY_TASK() ) THEN
      tasker.utils.E_ACCESS_DENIED();
    END IF;
  END IF;
  IF tasker.security.can_user ( p_as_user, CAN_CREATE_OWN_TASK() ) OR tasker.security.can_user ( p_as_user, CAN_CREATE_ANY_TASK() ) THEN
    INSERT
    INTO tasker.task (
        id, title, description, pct_complete, status, owner,
        assigned_to, change_date, change_user
      ) VALUES (
        tasker.task_seq.NEXTVAL, p_title, p_description, 0, 'I', owner_id,
        NULL, sysdate, p_as_user
      )
    RETURNING id INTO return_id;
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
    p_as_user    VARCHAR2 DEFAULT NULL
  )
AS
  user_person_id INTEGER;
  task tasker.task%ROWTYPE;
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
    p_as_user VARCHAR2 DEFAULT NULL )
AS
  user_person_id INTEGER;
  task tasker.task%ROWTYPE;
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
 * assign_task
 *
 * Assign a task to a person
 */
PROCEDURE assign_task(
    p_id      NUMBER,
    p_assignee  NUMBER,
    p_as_user VARCHAR2 DEFAULT NULL )
AS
  user_person_id INTEGER;
  can_assign_to_assignee BOOLEAN := FALSE;
  task tasker.task%ROWTYPE;
BEGIN
  user_person_id := tasker.utils.get_person_id_from_user_id ( p_as_user );
  SELECT * INTO task FROM tasker.task WHERE id = p_id;
  IF task.owner         != user_person_id THEN
    IF NOT tasker.security.can_user ( p_as_user, CAN_REASSIGN_ANY_TASK)  THEN
      tasker.utils.E_ACCESS_DENIED();
    END IF;
  END IF;
  IF tasker.security.can_user ( p_as_user, CAN_MODIFY_OWN_TASK() )
     OR tasker.security.can_user ( p_as_user, CAN_MODIFY_ANY_TASK() )  THEN

    IF NOT tasker.security.can_user ( p_as_user, CAN_ASSIGN_ANY_TASK_TO_ANYONE() ) THEN
      -- get all the people to whom we can assign the task
      FOR person IN ( SELECT * FROM TABLE(PERSON_MGMT.GET_PEOPLE_ADMINISTERED_BY ( user_person_id )) ) LOOP
        IF person.id = p_assignee THEN
          can_assign_to_assignee := TRUE;
        END IF;
      END LOOP;
      IF NOT can_assign_to_assignee THEN
       tasker.utils.E_ACCESS_DENIED();
      END IF;
    END IF;

    UPDATE tasker.task
    SET assigned_to    = p_assignee,
           change_date = sysdate,
           change_user = p_as_user
         WHERE id      = p_id;
    COMMIT;
  ELSE
    tasker.utils.E_ACCESS_DENIED();
  END IF;
END assign_task;
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
    p_as_user VARCHAR2 DEFAULT NULL )
  RETURN task_set pipelined
AS
  user_person_id INTEGER;
  task tasker.task%rowtype;
  allowed_to_see BOOLEAN := false;
BEGIN
  user_person_id := tasker.utils.get_person_id_from_user_id ( p_as_user );
  SELECT *
  INTO task
  FROM tasker.task
  WHERE id         = p_task_id;

    allowed_to_see   := tasker.security.can_user ( p_as_user, CAN_SEE_ANY_TASK() );
    IF (task.owner       = user_person_id) THEN
      allowed_to_see := true;
    END IF;
    IF (task.assigned_to = user_person_id) THEN
      allowed_to_see := true;
    END IF;
  IF NOT allowed_to_see THEN
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
    p_as_user              VARCHAR2 default null )
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
  WHERE NVL (assigned_to,-1) = NVL(NVL(p_assigned_to, assigned_to), -1)
  AND NVL(owner,-1)         = NVL(NVL(p_owned_by, owner), -1)
  AND NVL(status,'@')        = NVL(NVL(p_with_status, status), '@')
  AND NVL(pct_complete,0) BETWEEN NVL(p_with_completion_low,0) AND NVL(p_with_completion_high,100)
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
    p_as_user VARCHAR2 default null )
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
    INTO tasker.task_comments (
        id, task, comments, change_date, change_user, author
      ) VALUES (
        tasker.task_comment_seq.NEXTVAL, p_task_id, p_comment, sysdate, p_as_user, p_as_user
      )
    RETURNING id INTO return_id;
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
    p_as_user VARCHAR2 default null
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
        (r.owner != user_person_id) AND (r.assigned_to != user_person_id)
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

