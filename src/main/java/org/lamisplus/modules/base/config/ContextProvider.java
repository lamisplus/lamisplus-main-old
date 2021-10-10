package org.lamisplus.modules.base.config;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

@Component
public class ContextProvider implements ApplicationContextAware {
    @Autowired
    private static ApplicationContext CONTEXT;


    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        CONTEXT = applicationContext;
    }

    public ApplicationContext getApplicationContext() {
        return CONTEXT;
    }


    public static <T> T getBean(Class<T> beanClass) {
        return CONTEXT.getBean(beanClass);
    }

    public static Object getBean(String beanName) {
        return CONTEXT.getBean(beanName);
    }
}
