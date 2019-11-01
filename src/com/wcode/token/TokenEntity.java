package com.wcode.token;

import com.wcode.crypto.Base64Utils;
import com.wcode.crypto.RSA;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

/**
 * @author Y-Aron
 * @version 1.0.0
 * @create 2019/10/24 10:34
 */
@Setter
@Getter
@ToString
public class TokenEntity {
    // 许可证
    private String appId;
    // 响应信息
    private String msg;
    // 错误码。0代表成功（可忽略）
    private int errCode;
    // 响应码。0代表成功
    private int code;
    // 信息显示类型 默认”none”
    private String msgShowType;
    // 秘钥信息
    private String secret;
    // 错误消息
    private String errMsg;
    // 响应状态。true:成功,false:失败
    private boolean status;
    // 系统公钥信息
    private String spk;

    /**
     * 获取密钥
     */
    public String getSecretStr() {
        if (this.secret != null && this.spk != null) {
            return Base64Utils.encodeToString(RSA.encrypt(this.secret, this.spk));
        }
        return null;
    }

    /**
     * 获取加密的 userId
     */
    public String getUserStr(String userId) {
        if (this.spk == null) return null;
        return Base64Utils.encodeToString(RSA.encrypt(userId, this.spk));
    }
}
