package org.lamisplus.modules.base;

import org.lamisplus.modules.base.domain.entity.Permission;
import org.lamisplus.modules.base.domain.entity.Role;
import org.lamisplus.modules.base.domain.entity.User;
import org.lamisplus.modules.base.security.PermissionConstants;
import org.lamisplus.modules.base.security.RolesConstants;
import org.lamisplus.modules.base.service.ModuleService;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import java.util.HashSet;

@EnableScheduling
@SpringBootApplication
public class BaseApplication extends SpringBootServletInitializer implements CommandLineRunner {
	private static ConfigurableApplicationContext context;

	private static Boolean isStartUp = true;

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return application.sources(BaseApplication.class);
	}
	public static void main(String[] args) {
		context = SpringApplication.run(BaseApplication.class, args);
		ModuleService moduleService = context.getBean(ModuleService.class);
		moduleService.startModule(isStartUp);
	}

	public static void restart(Class [] clz, ConfigurableApplicationContext configurableApplicationContext) {
		if (context == null) {
			context = configurableApplicationContext;
		}

		ApplicationArguments args = context.getBean(ApplicationArguments.class);

		Thread thread = new Thread(() -> {
			context.close();
			context = SpringApplication.run(clz, args.getSourceArgs());
		});

		thread.setDaemon(false);
		thread.start();
	}

	public static ConfigurableApplicationContext getContext(){
		return context;
	}

	@PersistenceContext
	EntityManager em;

	@Transactional
	@Override
	public void run(String... args) throws Exception {

		HashSet createdPermissions = new HashSet<>();

		// Clear and Re-seed permissions
		for (PermissionConstants.PermissionsEnum _permission : PermissionConstants.PermissionsEnum.values()) {
			Permission permission = new Permission(_permission.toString());
			createdPermissions.add(permission);
			em.persist(permission);
		}

		Role admin = new Role(RolesConstants.ADMIN);
		admin.setPermissions(createdPermissions);
		em.persist(admin);

		Role user = new Role(RolesConstants.USER);
		em.persist(user);
	}

	/**
	 * Refresh the given application context, if necessary.
	 */
	/*protected void refreshApplicationContext(ApplicationContext applicationContext) {
		if (applicationContext instanceof ConfigurableApplicationContext) {
			ConfigurableApplicationContext cac = (ConfigurableApplicationContext) applicationContext;
			if (!cac.isActive()) {
				cac.refresh();
			}
		}
	}*/
}

