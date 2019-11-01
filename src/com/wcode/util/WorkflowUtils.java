package com.wcode.util;

import com.engine.workflow.service.impl.RequestFormServiceImpl;
import com.wcode.workflow.WorkflowEntity;
import org.slf4j.Logger;
import weaver.hrm.User;
import weaver.soa.workflow.request.DetailTableInfo;
import weaver.soa.workflow.request.MainTableInfo;
import weaver.soa.workflow.request.RequestInfo;
import weaver.soa.workflow.request.RequestService;

/**
 * @author Y-Aron
 * @version 1.0.0
 * @create 2019/10/24 12:11
 */
public class WorkflowUtils {

    private static final Logger logger = LoggerUtils.getLogger();

    public static String createWorkflow(WorkflowEntity wf) {
        logger.debug("---------->> 开始创建流程 <<----------");
        if (!checkWorkflowInfo(wf)) return null;
        RequestInfo req = new RequestInfo();
        // 设置创建人ID
        req.setCreatorid(wf.getUid() + "");
        // 设置流程ID
        req.setWorkflowid(wf.getWorkflowId());
        // 设置流程标题
        req.setDescription(wf.getTitle());
        // 设置紧急程度
        req.setRequestlevel(wf.getLevel().getValue());
        // 设置提醒类型
        req.setRemindtype(wf.getRemindType().getCode());
        // 设置主表信息
        MainTableInfo mt = wf.getMainTable();
        if (mt != null) {
            req.setMainTableInfo(mt);
        }
        // 设置明细表数据
        DetailTableInfo dti = wf.getDetailTableInfo();
        if (dti != null) {
            req.setDetailTableInfo(dti);
        }
        try {
            RequestService service = new RequestService();
            // 创建流程
            String requestId = service.createRequest(req);
            if (!"".equals(requestId) && Integer.parseInt(requestId) > 0) {
                logger.debug("----------> 流程创建成功：requestId: {}", requestId);
            } else {
                logger.error("----------> 流程创建失败！msg: {}", requestId);
            }
            return requestId;
        } catch (Exception e) {
            logger.error("----------> 流程创建失败！msg: {}", e.getMessage());
            return null;
        }
    }

    private static boolean checkWorkflowInfo(WorkflowEntity wf) {
        RequestFormServiceImpl service = new RequestFormServiceImpl();
        logger.debug("-----> workflow info: {}", wf);
        if (wf.getWorkflowId() == null || wf.getUid() == null) {
            return false;
        }
        User user = User.getUser(wf.getUid(), 0);
        if (user == null) {
            logger.debug("创建人ID={}不存在！", wf.getUid());
            return false;
        }
        return true;
    }
}
