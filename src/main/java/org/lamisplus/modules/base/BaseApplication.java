package org.lamisplus.modules.base;

import org.lamisplus.modules.base.util.module.JarFileLoader;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class BaseApplication extends SpringBootServletInitializer {
	private static ConfigurableApplicationContext context;

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return application.sources(BaseApplication.class);
	}
	public static void main(String[] args) {
		context = SpringApplication.run(BaseApplication.class, args);
		JarFileLoader jarFileLoader = context.getBean(JarFileLoader.class);
		jarFileLoader.loadExternalModulesAtStartUp();
	}

	public static void restart(Class [] clz) {
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

}

