package com.wcode.util;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import java.io.IOException;

/**
 * @author King
 * @version 1.0.0
 * @create 2019/11/5 16:25
 */
class HttpUtils {

    static JSONObject getJSONObject(HttpPost post) throws IOException {
        return JSON.parseObject(EntityUtils.toString(getEntity(post)));
    }

    static String getString(HttpPost post) throws IOException {
        return EntityUtils.toString(getEntity(post));
    }

    private static HttpEntity getEntity(HttpPost post) throws IOException {
        CloseableHttpClient httpClient = HttpClients.createDefault();
        CloseableHttpResponse resp = httpClient.execute(post);
        return resp.getEntity();
    }
}
