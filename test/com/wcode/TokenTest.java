package com.wcode;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.wcode.token.TokenEntity;
import com.wcode.util.TokenUtils;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * @author Y-Aron
 * @version 1.0.0
 * @create 2019/10/24 11:36
 */
public class TokenTest {

    private static final String appId = "1";


    public static void main(String[] args) throws IOException {
        // 注册许可证
        TokenEntity tokenEntity = TokenUtils.register("http://127.0.0.1", 80, appId);

//        System.out.println(tokenEntity);
        // 获取 token
        String token = TokenUtils.getToken("http://127.0.0.1", 80, tokenEntity);
//        System.out.println(token);

        // 普通接口调用
        HttpPost post = new HttpPost("http://127.0.0.1/api/workflow/reqform/requestOperation");
        post.setHeader("appid", tokenEntity.getAppId());
        post.setHeader("token", token);
        post.setHeader("userid", tokenEntity.getUserStr("1"));
        post.addHeader("Content-type", "application/json; charset=utf-8");
        post.setHeader("Accept", "application/json");
        Map<String, Object> map = new HashMap<>(3);
        map.put("iscreate", "0");
        map.put("workflowid", "4");
        map.put("requestid", "85093");
        map.put("Intervenorid", "1");
        map.put("IntervenoridType", "1");
        map.put("actiontype", "requestOperation");
        map.put("enableIntervenor", "1");
        map.put("submitNodeId", "11_1_0");
        map.put("src", "intervenor");
        map.put("1_85093_request_submit_token", new Date().getTime());
//        map.put("authSignatureStr", "cfa451a260dd8af35c921d34477fac35");
//        map.put("signatureAttributesStr", "SXNCZUZvcndhcmRNb2RpZnk9MHxmb3JtaWQ9LTl8cmVxdWVzdG5hbWU9suLK1LS0vajB97PMLc+1zbO53MDt1LEtMjAxOS0xMC0zMHx0YWtlQmFjaz0xfHJlcXVlc3RsZXZlbD0wfGNvYWRpc21vZGlmeT0wfElzQmVGb3J3YXJkQWxyZWFkeT18SXNDYW5Nb2RpZnk9ZmFsc2V8Y29hZHNpZ250eXBlPTJ8Y3JlYXRlcnR5cGU9MHxJc1dhaXRGb3J3YXJkT3Bpbmlvbj0wfHByZWlzcmVtYXJrPS0xfG5vZGVpZD0xMHx3b3JrZmxvd2lkPTR8aXNiaWxsPTF8SXNCZUZvcndhcmRQZW5kaW5nPTB8Y2Fudmlldz10cnVlfGlzaW50ZXJ2ZW5vcj0xfGhlbHBkb2NpZD0wfGN1cnJlbnRub2RlaWQ9MTB8aXNQZW5kaW5nUmVtYXJrPWZhbHNlfElzQmVGb3J3YXJkU3VibWl0QWxyZWFkeT18SXNGcmVlTm9kZT18SXNIYW5kbGVGb3J3YXJkPTB8SXNCZUZvcndhcmRTdWJtaXROb3Rhcmllcz18cmVxdWVzdGlkPTg1MDkzfGNyZWF0ZXI9MXxJc0JlRm9yd2FyZFRvZG89fElzQmVGb3J3YXJkQ2FuU3VibWl0T3Bpbmlvbj10cnVlfElzQ2FuU3VibWl0PWZhbHNlfElzRnJlZVdvcmtmbG93PWZhbHNlfGN1cnJlbnRub2RldHlwZT0wfG5vZGV0eXBlPTB8d29ya2Zsb3duYW1lPbLiytS0tL2owfezzHxJc1N1Ym1pdEZvcndhcmQ9MHxpc3JlbWFya0ZvclJNPXxJc1BlbmRpbmdGb3J3YXJkPTF8Y29hZGlzZm9yd2FyZD0wfGNvYWRDYW5TdWJtaXQ9ZmFsc2V8Zm9yd2FyZEJhY2s9MXxJc1N1Ym1pdGVkT3Bpbmlvbj0xfElzQmVGb3J3YXJkU3VibWl0PTB8aXNNb2RpZnlMb2c9MHxJc0JlRm9yd2FyZD0wfGlzTWFpblN1Ym1pdHRlZD1mYWxzZXxiaWxsaWQ9MTF8SXNBbHJlYWR5Rm9yd2FyZD18d2ZjdXJycmlkPTB8Y3VycmVudHN0YXR1cz0tMXxJc1Rha2luZ09waW5pb25zPTB8SXNGcm9tV0ZSZW1hcmtfVD0wfGdyb3VwZGV0YWlsaWQ9MHxJc0Zyb21XRlJlbWFyaz18dGFraXNyZW1hcms9LTF8Y29hZGlzcGVuZGluZz0wfGludGVydmVub3JyaWdodD0yfGNhbkZvcndkPWZhbHNlfGNvYWRpc3N1Ym1pdGRlc2M9MHw=");
//        map.put("signatureSecretKey", "d3ecdc0a203a4641dbce111bb3194ab2");
//        map.put("SignType", "0");
        map.put("nodetype", "0");
        map.put("f_weaver_belongto_userid", "1");
        map.put("f_weaver_belongto_usertype", "0");
        map.put("nodeid", "10");
        map.put("formid", "-9");
        post.setEntity(new StringEntity(JSON.toJSONString(map)));
        CloseableHttpClient httpClient = HttpClients.createDefault();
        CloseableHttpResponse resp = httpClient.execute(post);
        JSONObject jsonObject = JSON.parseObject(EntityUtils.toString(resp.getEntity()));
        System.out.println(jsonObject);
    }


}
