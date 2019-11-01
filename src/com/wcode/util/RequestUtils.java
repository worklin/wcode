package com.wcode.util;

import com.alibaba.fastjson.JSONObject;
import com.wcode.annotations.Alias;
import org.apache.commons.lang.ArrayUtils;
import weaver.soa.workflow.request.*;

import java.lang.reflect.Field;
import java.util.*;

public class RequestUtils {
	private static final int DEFAULT_SIZE = 0;

	public static Map<String, String> convertToMap(RequestInfo request, String... fieldMarks) {
		if (ArrayUtils.isEmpty(fieldMarks)) return new HashMap<>(DEFAULT_SIZE);
		Set<String> set = new HashSet<>(Arrays.asList(fieldMarks));
		return convertToMap(request, set);
	}

	public static List<Map<String, String>> convertToMap(DetailTable detailTable, String... fieldMarks) {
		if (ArrayUtils.isEmpty(fieldMarks)) return new ArrayList<>(DEFAULT_SIZE);
		Set<String> set = new HashSet<>(Arrays.asList(fieldMarks));
		return convertToMap(detailTable, set);
	}

	public static List<Map<String, String>> convertToMap(DetailTable detailTable, Collection<String> set) {
		Row[] rows = detailTable.getRow();
		List<Map<String, String>> list = new ArrayList<>(detailTable.getRowCount());
		Map<String, String> map;
		int size = set.size();
		for (Row row : rows) {
			map = new HashMap<>(size);
			for (Cell cell : row.getCell()) {
				String name = cell.getName();
				String val = cell.getValue();
				if (set.contains(name)) {
					map.put(name, val);
				}
			}
			list.add(map);
		}
		return list;
	}

	public static Map<String, String> convertToMap(RequestInfo request, Collection<String> set) {
		Property[] properties = request.getMainTableInfo().getProperty();
		int len = set.size();
		Map<String, String> map = new HashMap<>(len);
		for (Property property : properties) {
			if (len == map.size()) break;
			String name = property.getName();
			String val = property.getValue();
			if (set.contains(name)) {
				map.put(name, val);
			}
		}
		return map;
	}

	public static <T> List<T> convert(DetailTable detailTable, Class<T> clazz) {
		Map<String, String> fieldMap = getFieldMap(clazz);
		if (fieldMap.size() == 0) {
			return new ArrayList<>(DEFAULT_SIZE);
		} else {
			Row[] rows = detailTable.getRow();
			List<T> list = new ArrayList<>(rows.length);
			for (Row row : rows) {
				T object = convertToObject(fieldMap, row, clazz);
				list.add(object);
			}
			return list;
		}
	}

	public static <T> T convert(RequestInfo request, Class<T> clazz) {
		Map<String, String> fieldMap = getFieldMap(clazz);
		JSONObject json = convertJson(fieldMap, request.getMainTableInfo().getProperty());
		return json.toJavaObject(clazz);
	}

	private static <T> T convertToObject(Map<String, String> fieldMap, Row row, Class<T> clazz) {
		Cell[] cells = row.getCell();
		int count = 0;
		JSONObject json = new JSONObject(fieldMap.size());
		for (Cell cell : cells) {
			if (fieldMap.size() == count) break;
			String name = cell.getName();
			String val = cell.getValue();
			if (fieldMap.containsKey(name)) {
				json.put(fieldMap.get(name), val);
				count ++;
			}
		}
		return json.toJavaObject(clazz);
	}

	private static JSONObject convertJson(Map<String, String> fieldMap, Property[] properties) {
		JSONObject json = new JSONObject(fieldMap.size());
		if (fieldMap.size() == 0) {
			return json;
		} else {
			int count = 0;
			for (Property property : properties) {
				if (fieldMap.size() == count) break;
				String name = property.getName();
				String val = property.getValue();
				if (fieldMap.containsKey(name)) {
					json.put(fieldMap.get(name), val);
					count ++;
				}
			}
			return json;
		}
	}

	private static Map<String, String> getFieldMap(Class clazz) {
		Field[] fields = clazz.getDeclaredFields();
		Map<String, String> fieldMap = new HashMap<>(fields.length);
		for (Field field : fields) {
			Alias annotation = field.getAnnotation(Alias.class);
			String fieldName = field.getName();
			if (annotation == null) {
				fieldMap.put(fieldName, fieldName);
			} else {
				String[] aliasArr = annotation.value();
				for (String alias : aliasArr) {
					fieldMap.put(alias, fieldName);
				}
			}
		}
		return fieldMap;
	}
}