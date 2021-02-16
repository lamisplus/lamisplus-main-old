package org.lamisplus.modules.base;

import lombok.extern.slf4j.Slf4j;
import org.jfree.util.Log;
import org.lamisplus.modules.base.bootstrap.ClassLoaderTest;
import org.lamisplus.modules.base.service.ModuleService;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.context.event.ApplicationEnvironmentPreparedEvent;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.ApplicationListener;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.io.File;
import java.lang.reflect.Method;
import java.net.URL;
import java.net.URLClassLoader;
import java.util.HashSet;
import java.util.Set;

@EnableScheduling
@SpringBootApplication
@Slf4j
public class BaseApplication extends SpringBootServletInitializer {
    private static ConfigurableApplicationContext context;

    private static Boolean isStartUp = true;

    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(BaseApplication.class);
    }

    public static void main(String[] args) {
        SpringApplication application = new SpringApplication(BaseApplication.class);
        //addInitHooks(application);
        context = application.run(args);
        Log.info("java.class.path - " + System.getProperty("java.class.path"));
        ModuleService moduleService = context.getBean(ModuleService.class);
        moduleService.startModule(isStartUp);
    }

    public static void restart(Class[] clz, ConfigurableApplicationContext configurableApplicationContext) {
        if (context == null) {
            context = configurableApplicationContext;
        }

        ApplicationArguments args = context.getBean(ApplicationArguments.class);

        Thread thread = new Thread(() -> {
            try {
                //context.refresh();
                context.close();
                //System.out.println("System is close");
                context = SpringApplication.run(clz, args.getSourceArgs());

            }catch (Exception e){
                e.printStackTrace();
            }
        });

        thread.setDaemon(false);
        thread.start();
    }

    public static ConfigurableApplicationContext getContext() {
        return context;
    }

    /*static void addInitHooks(SpringApplication application) {
        try {
            System.setProperty("java.class.path", System.getProperty("user.dir")+ "\\runtime\\demo" +";"+System.getProperty("user.dir"));
            System.out.println(System.getProperty("java.class.path"));
            Set<String> classNames = new HashSet<>();
            classNames.add("org.lamisplus.modules.demo.DemoModuleApplication");
            ClassLoaderTest.getMain(classNames,System.getProperty("user.dir")+ "\\runtime\\demo");
        }catch (Exception e){
            e.printStackTrace();
        }
        *//*application.addListeners((ApplicationListener<ApplicationEnvironmentPreparedEvent>) event -> {
            String version = event.getEnvironment().getProperty("java.runtime.version");
            log.info("Running with Java {}", version);
        });*//*
    }*/

    /*@PersistenceContext
    EntityManager em;

    @Transactional
    @Override
    public void run(String... args) throws Exception {

        HashSet createdPermissions = new HashSet<>();

        // Seed permissions
        List<Permission> permissionsObject = em.createQuery("SELECT a FROM Permission a", Permission.class).getResultList();
        List<String> permissions = permissionsObject.stream()
                .map(Permission::getName)
                .collect(Collectors.toList());
        for (PermissionConstants.PermissionsEnum _permission : PermissionConstants.PermissionsEnum.values()) {
            if (!permissions.contains(_permission.toString())) {
                Permission permission = new Permission(_permission.toString());
                createdPermissions.add(permission);
                em.persist(permission);
            }
        }
        List<Role> RolesObject = em.createQuery("SELECT a FROM Role a", Role.class).getResultList();
        List<String> Roles = RolesObject.stream()
                .map(Role::getName)
                .collect(Collectors.toList());
        if (!Roles.contains(RolesConstants.SUPER_ADMIN)) {
            Role admin = new Role(RolesConstants.SUPER_ADMIN);
            admin.setPermissions(createdPermissions);
            em.persist(admin);
        }

        if (!Roles.contains(RolesConstants.COUNTRY_ADMIN)) {
            Role role = new Role(RolesConstants.COUNTRY_ADMIN);
            em.persist(role);
        }
        if (!Roles.contains(RolesConstants.STATE_ADMIN)) {
            Role role = new Role(RolesConstants.STATE_ADMIN);
            em.persist(role);
        }
        if (!Roles.contains(RolesConstants.FACILITY_ADMIN)) {
            Role role = new Role(RolesConstants.FACILITY_ADMIN);
            em.persist(role);
        }
        if (!Roles.contains(RolesConstants.CLINICIAN)) {
            Role role = new Role(RolesConstants.CLINICIAN);
            em.persist(role);
        }
        if (!Roles.contains(RolesConstants.NURSE)) {
            Role role = new Role(RolesConstants.NURSE);
            em.persist(role);
        }
        if (!Roles.contains(RolesConstants.PHARMACIST)) {
            Role role = new Role(RolesConstants.PHARMACIST);
            em.persist(role);
        }
        if (!Roles.contains(RolesConstants.LABORATORY_SCIENTIST)) {
            Role role = new Role(RolesConstants.LABORATORY_SCIENTIST);
            em.persist(role);
        }
        if (!Roles.contains(RolesConstants.DATA_CLERK)) {
            Role role = new Role(RolesConstants.DATA_CLERK);
            em.persist(role);
        }
        if (!Roles.contains(RolesConstants.USER)) {
            Role role = new Role(RolesConstants.USER);
            em.persist(role);
        }
    }*/

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

    public static void addURL(URL url) throws Exception {
        URLClassLoader classLoader = (URLClassLoader) ClassLoader.getSystemClassLoader();
        Class clazz= URLClassLoader.class;

        // Use reflection
        Method method = clazz.getDeclaredMethod("addURL", new Class[] { URL.class });
        method.setAccessible(true);
        method.invoke(classLoader, new Object[] { url });
    }
}
