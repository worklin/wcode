package com.wcode.workflow;

/**
 * @author Y-Aron
 * @version 1.0.0
 * @create 2019/10/24 12:15
 */
public enum LevelEnum {
    // 正常
    DEFAULT("0"),
    // 重要
    IMPORTANT("1"),
    // 紧急
    URGENT("2");

    private String value;

    LevelEnum(String value) {
        this.value = value;
    }

    public String getValue() {
        return value;
    }
}
