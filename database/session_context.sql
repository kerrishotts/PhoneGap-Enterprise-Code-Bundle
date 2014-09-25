CREATE OR REPLACE PACKAGE "TASKER"."SESSION_CONTEXT" IS
-- from http://psoug.org/reference/sys_context.html
PROCEDURE set_session_id(p_session_id NUMBER);
PROCEDURE set_ctx(p_name VARCHAR2, p_value VARCHAR2);
PROCEDURE close_session(p_session_id NUMBER);

END;

CREATE OR REPLACE PACKAGE BODY "TASKER"."SESSION_CONTEXT" IS
-- from http://psoug.org/reference/sys_context.html
g_session_id NUMBER;

PROCEDURE set_session_id(p_session_id NUMBER) IS
BEGIN
  g_session_id := p_session_id;
  dbms_session.set_identifier(p_session_id);
end set_session_id;
--===============================================
PROCEDURE set_ctx(p_name VARCHAR2, p_value VARCHAR2) IS
BEGIN
  dbms_session.set_context('Tasker_Ctx',p_name,p_value,USER,g_session_id);
END set_ctx;
--===============================================
PROCEDURE close_session(p_session_id NUMBER) IS
BEGIN
  dbms_session.set_identifier(p_session_id);
  dbms_session.clear_identifier;
END close_session;
--===============================================
END;

