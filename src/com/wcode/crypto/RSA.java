package com.wcode.crypto;

import javax.crypto.Cipher;
import java.security.*;
import java.security.spec.X509EncodedKeySpec;
import java.util.HashMap;
import java.util.Map;

/**
 * @author: Y-Aron
 * @create: 2018-10-30 00:10
 **/
public class RSA {

    private static final String KEY_ALGORITHM = "RSA";

    private static final int INIT_SIZE = 1024;

    private static final String PUBLIC_KEY = "RSAPublicKey";
    private static final String PRIVATE_KEY = "RSAPrivateKey";
    private static final String SIGNATURE_ALGORITHM = "MD5withRSA";

    private static final Map<String, String> KEY_MAP = new HashMap<>(2);

    static {
        KeyPairGenerator keyPairGen = null;
        try {
            keyPairGen = KeyPairGenerator.getInstance(KEY_ALGORITHM);
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        if (keyPairGen != null) {
            keyPairGen.initialize(INIT_SIZE);
            KeyPair keyPair = keyPairGen.generateKeyPair();
            // 公钥
            KEY_MAP.put(PUBLIC_KEY, Base64Utils.encodeToString(keyPair.getPublic().getEncoded()));
            // 私钥
            KEY_MAP.put(PRIVATE_KEY, Base64Utils.encodeToString(keyPair.getPrivate().getEncoded()));
        }
    }

    /**
     * 取得私钥
     */
    public static String getPrivateKey(){
        return KEY_MAP.get(PRIVATE_KEY);
    }

    /**
     * 取得公钥
     */
    public static String getPublicKey(){
        return KEY_MAP.get(PUBLIC_KEY);
    }

    /**
     * 公钥加密
     * @param data 需要加密的数据
     * @param publicKey 公钥
     * @return 加密后的字节数组
     */
    public static byte[] encrypt(String data, String publicKey) {
        try {
            // 对公钥解密
            byte[] keyBytes = Base64Utils.decode(publicKey);
            // 取得公钥
            X509EncodedKeySpec x509KeySpec = new X509EncodedKeySpec(keyBytes);
            KeyFactory keyFactory = KeyFactory.getInstance(KEY_ALGORITHM);
            Key key = keyFactory.generatePublic(x509KeySpec);
            // 对数据加密
            Cipher cipher = Cipher.getInstance(keyFactory.getAlgorithm());
            cipher.init(Cipher.ENCRYPT_MODE, key);
            return cipher.doFinal(data.getBytes());
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}