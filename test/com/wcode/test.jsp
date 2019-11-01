<%@ page import="com.wcode.util.WorkflowUtils" %>
<%@ page import="com.wcode.workflow.WorkflowEntity" %>
<%@ page import="java.util.HashMap" %>
<%@ page import="java.util.Map" %>

<%

    WorkflowEntity entity = new WorkflowEntity();

    String str = "123123123";
    out.print(str);
    entity.setTitle(str);
    entity.setUid(1);
    entity.setWorkflowId("3");

    Map<String, Object> map = new HashMap<>(3);
    map.put("nickname", "11231312312");
    entity.setMainTable(map);

    String requestId = WorkflowUtils.createWorkflow(entity);
    out.print(requestId);
%>