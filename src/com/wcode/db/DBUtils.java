package com.wcode.db;

import com.alibaba.fastjson.JSONObject;
import com.wcode.util.LoggerUtils;
import org.slf4j.Logger;
import weaver.conn.RecordSetTrans;

import javax.persistence.Column;
import javax.persistence.Table;
import java.lang.reflect.Field;
import java.util.*;

/**
 * @author Y-Aron
 * @version 1.0.0
 * @create 2019/10/8 10:24
 */
public class DBUtils {

    private static final Logger logger = LoggerUtils.getLogger();

    private static final int DEFAULT_SIZE = 0;

    public static boolean insert(Object object) throws IllegalAccessException {
        if (object == null) return false;
        Class<?> clazz = object.getClass();
        Table table = clazz.getDeclaredAnnotation(Table.class);
        String tableName = table == null ? clazz.getSimpleName() : table.name();
        StringBuilder sql = new StringBuilder("insert into ");
        sql.append(tableName).append('(');
        StringBuilder fieldNames = new StringBuilder();
        StringBuilder qs = new StringBuilder();
        Field[] fields = clazz.getDeclaredFields();
        ArrayList<Object> values = new ArrayList<>(fields.length);
        for (int i = 0, len = fields.length; i < len; i++) {
            Field field = fields[i];
            String fieldName = field.getName();
            fieldNames.append(i == 0 ? fieldName : "," + fieldName);
            qs.append(i == 0 ? "?" : ",?");
            field.setAccessible(true);
            values.add(field.get(object));
        }
        sql.append(fieldNames).append(") values(").append(qs).append(')');
        RecordSetTrans rst = new RecordSetTrans();
        logger.debug("DBUtils insert sql: {}", sql);
        boolean bool = false;
        try {
            bool = rst.executeUpdate(sql.toString(), values);
            logger.debug("DBUtils insert {} is success", tableName);
        } catch (Exception e) {
            logger.error("DBUtils insert {} is error: {}", tableName, e.getMessage());
        }
        return bool;
    }

    public static <T> List<T> query(String sql, Class<T> clazz, Object... params) {
        if (sql == null || clazz == null) return new ArrayList<>(DEFAULT_SIZE);
        RecordSetTrans rst = new RecordSetTrans();
        try {
            rst.executeQuery(sql, params);
        } catch (Exception e) {
            logger.error("DBUtils query is error: {}", e.getMessage());
            return new ArrayList<>(DEFAULT_SIZE);
        }
        List<String> cols = Arrays.asList(rst.getColumnName());
        Map<String, String> map = new HashMap<>(cols.size());
        for (Field field : clazz.getDeclaredFields()) {
            Column column = field.getAnnotation(Column.class);
            String alias = column == null ? field.getName() : column.name();
            if (cols.contains(alias)) {
                map.put(alias, field.getName());
            }
        }
        List<T> objList = new ArrayList<>(rst.getCounts());
        while (rst.next()) {
            T obj = convert2Object(rst, map, clazz);
            objList.add(obj);
        }
        return objList;
    }

    public static <T> boolean execute(Object[] objects, UpdateAction action) {
        return execute(Arrays.asList(objects), action);
    }

    public static <T> boolean execute(Collection<T> list, UpdateAction action) {
        RecordSetTrans rst = new RecordSetTrans();
        rst.setAutoCommit(false);
        try {
            for (T t : list) {
                action.doUpdate(t, rst);
            }
            rst.commit();
        } catch (Exception e) {
            rst.rollback();
            logger.error("数据库执行失败！errMsg: {}", e.getMessage());
            return false;
        }
        return true;
    }

    private static <T> T convert2Object(RecordSetTrans rst, Map<String, String> map, Class<T> clazz) {
        JSONObject json = new JSONObject();
        map.forEach((k, v) -> json.put(v, rst.getString(k)));
        return json.toJavaObject(clazz);
    }
}
