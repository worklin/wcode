package com.wcode.util;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.wcode.crypto.RSA;
import com.wcode.token.TokenEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import java.io.IOException;

/**
 * @author Y-Aron
 * @version 1.0.0
 * @create 2019/10/24 10:20
 */
public class TokenUtils {

    private static final String REGISTER_API = "/api/ec/dev/auth/regist";
    private static final String APPLY_TOKEN_API = "/api/ec/dev/auth/applytoken";
    private static final String APP_ID = "appid";
    private static final String CPK = "cpk";
    private static final String SECRET = "secret";
    private static final String TOKEN = "token";

    /**
     * 向ECOLOGY系统注册许可证
     * @param serverIp  服务器IP地址
     * @param port      服务器端口
     * @param appId     许可证
     */
    public static TokenEntity register(String serverIp, int port, String appId) throws IOException {
        String url = serverIp + ":" + port + REGISTER_API;
        HttpPost post = new HttpPost(url);
        post.setHeader(APP_ID, appId);
        String cpk = RSA.getPublicKey();
        post.setHeader(CPK, cpk);
        JSONObject json = getJSONObject(post);
        json.put(SECRET, json.getString("secrit"));
        json.put(APP_ID, appId);
        return json.toJavaObject(TokenEntity.class);
    }

    /**
     * 获取 token
     * @param serverIp      服务器IP地址
     * @param port          服务器端口
     * @param tokenEntity   token实体
     */
    public static String getToken(String serverIp, int port, TokenEntity tokenEntity) throws IOException {
        String url = serverIp + ":" + port + APPLY_TOKEN_API;
        String secretStr = tokenEntity.getSecretStr();
        HttpPost httpPost = new HttpPost(url);
        httpPost.setHeader(APP_ID, tokenEntity.getAppId());
        httpPost.setHeader(SECRET, secretStr);
        JSONObject json = getJSONObject(httpPost);
        return json.getString(TOKEN);
    }

    private static JSONObject getJSONObject(HttpPost post) throws IOException {
        CloseableHttpClient httpClient = HttpClients.createDefault();
        CloseableHttpResponse resp = httpClient.execute(post);
        return JSON.parseObject(EntityUtils.toString(resp.getEntity()));
    }
}
