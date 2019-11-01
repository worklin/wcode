package com.wcode.db;

import weaver.conn.RecordSetTrans;

public interface UpdateAction {
    <T> void doUpdate(T var1, RecordSetTrans var2) throws Exception;
}