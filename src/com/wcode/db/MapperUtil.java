package com.wcode.db;

import org.apache.ibatis.session.Configuration;
import org.apache.ibatis.session.ExecutorType;
import org.apache.ibatis.session.LocalCacheScope;
import org.apache.ibatis.session.SqlSession;
import weaver.conn.ConnectionPool;
import weaver.conn.WeaverConnection;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import static weaver.conn.mybatis.MyBatisFactory.sqlSessionFactory;

/**
* ⽅法参数不接受 null或 ""
* @author Y-Aron
* @create 2019/5/8
*/
public class MapperUtil {

    private static final Map<Class, Object> cacheMapper = new ConcurrentHashMap<>(1);

    private static final Map<String, SqlSession> cacheSqlSession = new ConcurrentHashMap<>(1);

    public static <T> T getMapper(Class<T> clazz) {
        return MapperUtil.getMapper(clazz, false);
    }

    public static <T> T getMapper(Class<T> clazz, boolean enableCache) {
        return MapperUtil.getMapper(clazz, null, ExecutorType.SIMPLE, enableCache);
    }

    public static <T> T getMapper(Class<T> clazz, String dataSource) {
        return MapperUtil.getMapper(clazz, dataSource, false);
    }

    public static <T> T getMapper(Class<T> clazz, String dataSource, boolean enableCache) {
        return MapperUtil.getMapper(clazz, dataSource, ExecutorType.SIMPLE, enableCache);
    }

    public static <T> T getMapper(Class<T> clazz, String dataSource, ExecutorType executorType, boolean enableCache) {
        String threadName = Thread.currentThread().getName();
        SqlSession sqlSession = cacheSqlSession.get(threadName);
        if (sqlSession == null) {
            ConnectionPool pool = ConnectionPool.getInstance();
            WeaverConnection connection = pool.getConnection(dataSource);
            Configuration config = sqlSessionFactory.getConfiguration();
            if (executorType == null) {
                executorType = config.getDefaultExecutorType();
            }
            if (enableCache) {
                config.setLocalCacheScope(LocalCacheScope.STATEMENT);
            }
            sqlSession = sqlSessionFactory.openSession(executorType, connection);
        }
        cacheSqlSession.put(threadName, sqlSession);
        return MapperUtil.getMapper(clazz, sqlSession);
    }

    public static <T> T getMapper(Class<T> clazz, SqlSession sqlSession) {
        if (cacheMapper.containsKey(clazz)) {
            //noinspection unchecked
            return (T) cacheMapper.get(clazz);
        }
        Configuration config = sqlSession.getConfiguration();
        if (!config.hasMapper(clazz)) {
            config.addMapper(clazz);
        }
        T mapper = sqlSession.getMapper(clazz);
        cacheMapper.put(clazz, mapper);
        return mapper;
    }

    private static SqlSession getCurrentSqlSession() {
        if (cacheSqlSession.size() == 0) return null;
        return cacheSqlSession.get(Thread.currentThread().getName());
    }
}