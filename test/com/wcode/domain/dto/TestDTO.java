package com.wcode.domain.dto;

import com.wcode.annotations.Alias;
import com.wcode.util.RequestUtils;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import weaver.soa.workflow.request.MainTableInfo;
import weaver.soa.workflow.request.Property;
import weaver.soa.workflow.request.RequestInfo;

/**
 * @author Y-Aron
 * @version 1.0.0
 * @create 2019/11/1 10:33
 */
@Setter
@Getter
@ToString
public class TestDTO {
    @Alias(value = "wb", desc = "文本类型")
    private String text;
    @Alias(value = "zs", desc = "整数类型")
    private Integer zs;
    @Alias(value = "fds", desc = "浮点类型")
    private Double fds;
    @Alias(value = "dhwb", desc = "多行文本")
    private String dhwb;
    @Alias(value = "fjwj", desc = "附件文件")
    private String fjwj;
    @Alias(value = "fjtp", desc = "附件图片")
    private String fjtp;

    public static void main(String[] args) {
        RequestInfo request = new RequestInfo();

        MainTableInfo mainTableInfo = new MainTableInfo();
        mainTableInfo.addProperty(new Property(){{
            setName("wb");
            setValue("wb1111111111111");
        }});
        mainTableInfo.addProperty(new Property(){{
            setName("zs");
            setValue("11111");
        }});

        mainTableInfo.addProperty(new Property(){{
            setName("fds");
            setValue("123.33");
        }});

        mainTableInfo.addProperty(new Property(){{
            setName("dxwb");
            setValue("123.33");
        }});
        request.setMainTableInfo(mainTableInfo);

        System.out.println(RequestUtils.convert(request, TestDTO.class));
    }
}
