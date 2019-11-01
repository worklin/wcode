package com.wcode.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @author Y-Aron
 * @version 1.0.0
 * @create 2019/10/8 10:48
 */
public class LoggerUtils {

    public static Logger getLogger() {
        return LoggerFactory.getLogger("debug");
    }
}
