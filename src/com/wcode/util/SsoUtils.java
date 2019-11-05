package com.wcode.util;

import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.protocol.HTTP;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * @author King
 * @version 1.0.0
 * @create 2019/11/5 16:17
 */
public class SsoUtils {

    private static final String SSO_API = "/ssologin/getToken";

    public static String getToken(String ip, int port, String appId, String loginId) throws IOException {
        String url = ip + ":" + port + SSO_API;
        HttpPost req = new HttpPost(url);
        List<NameValuePair> params = new ArrayList<>(2);
        params.add(new BasicNameValuePair("appid", appId));
        params.add(new BasicNameValuePair("loginid", loginId));
        req.setEntity(new UrlEncodedFormEntity(params, HTTP.DEF_CONTENT_CHARSET));
        return HttpUtils.getString(req);
    }

    public static void main(String[] args) throws IOException {
        String token = SsoUtils.getToken("http://127.0.0.1", 80, "Client1", "lcs");
        System.out.println("ssoToken: " + token);
        String url = "http://127.0.0.1/systeminfo/version.jsp";
        HttpPost req = new HttpPost(url);
        List<NameValuePair> params = new ArrayList<>(1);
        params.add(new BasicNameValuePair("ssoToken", token));
        req.setEntity(new UrlEncodedFormEntity(params));
        System.out.println(HttpUtils.getString(req));
    }
}
