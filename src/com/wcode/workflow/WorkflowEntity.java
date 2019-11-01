package com.wcode.workflow;

import com.engine.govern.constant.RemindType;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import weaver.soa.workflow.request.*;

import java.util.List;
import java.util.Map;

/**
 * @author Y-Aron
 * @version 1.0.0
 * @create 2019/10/24 12:11
 */
@Getter
@Setter
@ToString
public class WorkflowEntity {
    // 流程标题
    private String title;
    // 流程ID
    private String workflowId;
    // 创建用户ID
    private Integer uid;
    // 紧急程度
    private LevelEnum level = LevelEnum.DEFAULT;
    // 提醒类型
    private RemindType remindType = RemindType.REMINDTYPE_ISSUE;
    // 主表信息
    private Map<String, Object> mainTable;
    // 明细表信息
    private Map<String, List<Map<String, Object>>> detailTableInfo;

    public MainTableInfo getMainTable() {
        if (this.mainTable == null || this.mainTable.size() == 0) {
            return null;
        }
        MainTableInfo mt = new MainTableInfo();
        this.mainTable.forEach((k, v) -> mt.addProperty(new Property(){{
            setName(k);
            setValue(String.valueOf(v));
        }}));
        return mt;
    }

    public DetailTableInfo getDetailTableInfo() {
        if (this.detailTableInfo == null || this.detailTableInfo.size() == 0) {
            return null;
        }
        DetailTableInfo dti = new DetailTableInfo();
        this.detailTableInfo.forEach((dtIdx, data) -> dti.addDetailTable(createDetailTable(dtIdx, data)));
        return dti;
    }

    private DetailTable createDetailTable(String dtIdx, List<Map<String, Object>> data) {
        DetailTable dt = new DetailTable();
        dt.setId(dtIdx);
        for (Map<String, Object> map : data) {
            dt.addRow(this.createRow(map));
        }
        return dt;
    }

    private Row createRow(Map<String, Object> map) {
        Row row = new Row();
        map.forEach((name, val) -> row.addCell(new Cell(){{
            setName(name);
            setValue(String.valueOf(val));
        }}));
        return row;
    }
}
