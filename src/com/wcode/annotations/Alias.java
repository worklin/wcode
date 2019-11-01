package com.wcode.annotations;

import java.lang.annotation.*;

@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.FIELD})
public @interface Alias {

    String[] value() default {};

    String desc() default "";
}
