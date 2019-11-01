package com.wcode.util;

import weaver.conn.RecordSet;
import weaver.formmode.setup.ModeRightInfo;

/**
 * @author Y-Aron
 * @version 1.0.0
 * @create 2019/9/27 17:10
 */
public class ModeUtils {

    private static final ModeRightInfo MODE_RIGHT_INFO = new ModeRightInfo();

    private static final int DEFAULT_CREATER = 1;

    public static void resetDataShare(int moduleId, String tableName) {
        RecordSet rs = new RecordSet();
        String sql = "select max(id) mid from " + tableName;
        rs.execute(sql);
        if (rs.next()) {
            MODE_RIGHT_INFO.setNewRight(true);
            MODE_RIGHT_INFO.editModeDataShare(DEFAULT_CREATER, moduleId, rs.getInt("mid"));
        }
    }
}
