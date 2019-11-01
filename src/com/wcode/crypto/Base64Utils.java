package com.wcode.crypto;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

/**
 * @author Y-Aron
 * @create 2019/7/26 19:06
 * @since 1.0.0
 */
public class Base64Utils {

    public static String encodeToString(final String src) {
        final Base64.Encoder encoder = Base64.getEncoder();
        return encoder.encodeToString(src.getBytes(StandardCharsets.UTF_8));
    }

    public static String encodeToString(final byte[] src) {
        final Base64.Encoder encoder = Base64.getEncoder();
        return encoder.encodeToString(src);
    }

    public static byte[] decode(String publicKey) {
        Base64.Decoder decoder = Base64.getDecoder();
        return decoder.decode(publicKey);
    }
}