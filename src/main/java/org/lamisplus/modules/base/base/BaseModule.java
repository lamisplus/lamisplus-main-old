package org.lamisplus.modules.base.base;

import com.foreach.across.core.AcrossModule;
import com.foreach.across.core.annotations.AcrossDepends;
import com.foreach.across.core.context.configurer.ComponentScanConfigurer;
import com.foreach.across.modules.hibernate.jpa.AcrossHibernateJpaModule;

@AcrossDepends(required = AcrossHibernateJpaModule.NAME)
public class BaseModule extends AcrossModule {
    public final static String NAME = "BaseModule";

    public BaseModule() {
        super();
        addApplicationContextConfigurer(new ComponentScanConfigurer(
            getClass().getPackage().getName()
        ));
    }

    @Override
    public String getName() {
        return NAME;
    }
}
