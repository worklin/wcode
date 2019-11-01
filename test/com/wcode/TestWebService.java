package com.wcode;

import com.wcode.util.WsUtils;
import org.dom4j.*;

import java.io.IOException;
import java.util.List;

/**
 * @author Y-Aron
 * @version 1.0.0
 * @create 2019/10/24 17:12
 */
public class TestWebService {

    public static void main(String[] args) throws IOException, DocumentException {
        String url = "http://www.webxml.com.cn/webservices/ChinaTVprogramWebService.asmx";
        String xml = "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:web=\"http://WebXml.com.cn/\">\n" +
                "   <soapenv:Header/>\n" +
                "   <soapenv:Body>\n" +
                "      <web:getTVstationDataSet>\n" +
                "         <web:theAreaID>18</web:theAreaID>\n" +
                "      </web:getTVstationDataSet>\n" +
                "   </soapenv:Body>\n" +
                "</soapenv:Envelope>";
        String resp = WsUtils.execute(url, xml);
        Element rootElement = WsUtils.getRootElement(resp);
        List<Element> elements = WsUtils.getElements(rootElement, "TvStation");
        for (Element element : elements) {
            Element e1 = element.element("tvStationID");
            System.out.println(e1.getTextTrim());
            Element e2 = element.element("tvStationName");
            System.out.println(e2.getTextTrim());
        }
    }
}
