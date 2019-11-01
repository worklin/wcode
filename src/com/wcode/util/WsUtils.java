package com.wcode.util;

import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;

import java.io.IOException;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;

/**
 * @author Y-Aron
 * @version 1.0.0
 * @create 2019/10/24 17:20
 */
public class WsUtils {

    public static String execute(String url, String xml) throws IOException {
        HttpPost post = new HttpPost(url);
        post.setHeader("Content-Type", "text/xml; charset=UTF-8");
        HttpEntity body = new StringEntity(xml);
        post.setEntity(body);
        CloseableHttpClient httpClient = HttpClients.createDefault();
        CloseableHttpResponse resp = httpClient.execute(post);
        return EntityUtils.toString(resp.getEntity(), "utf-8");
    }

    public static Element getRootElement(String xml) throws DocumentException {
        Document document = DocumentHelper.parseText(xml);
        return document.getRootElement();
    }

    public static List<Element> getElements(Element root, String name) {
        List<Element> elements = new LinkedList<>();
        getElements(root, name, elements);
        return elements;
    }

    private static void getElements(Element el, String name, List<Element> elements){
        if (name.equals(el.getName())) {
            elements.add(el);
        } else {
            Iterator it = el.elementIterator();
            while (it.hasNext()) {
                getElements((Element) it.next(), name, elements);
            }
        }
    }
}
