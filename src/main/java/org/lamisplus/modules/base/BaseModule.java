package org.lamisplus.modules.base;

import com.foreach.across.config.AcrossApplication;
import com.foreach.across.core.AcrossModule;
import com.foreach.across.core.context.configurer.ComponentScanConfigurer;
import com.foreach.across.modules.hibernate.jpa.AcrossHibernateJpaModule;
import com.foreach.across.modules.web.AcrossWebModule;
import org.lamisplus.modules.bootstrap.BootstrapModule;

@AcrossApplication(
        modules = {
                AcrossHibernateJpaModule.NAME,
                AcrossWebModule.NAME, BootstrapModule.NAME,
        }
)
public class BaseModule extends AcrossModule {
    public static final String NAME = "BaseModule";

    public BaseModule() {
        super();
        addApplicationContextConfigurer(new ComponentScanConfigurer(
                getClass().getPackage().getName() +".controller",
                getClass().getPackage().getName() +".security",
                getClass().getPackage().getName() +".security.jwt",
                getClass().getPackage().getName() +".service",
                getClass().getPackage().getName() +".interceptor",
                getClass().getPackage().getName() +".config",
                getClass().getPackage().getName() +".domain",
                getClass().getPackage().getName() +".domain.mapper",
                getClass().getPackage().getName() +".util",
                "springfox.documentation", "org.springframework.web.socket"));
    }

    public String getName() {
        return NAME;
    }
}