package org.lamisplus.modules.base.service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.BaseApplication;
import org.lamisplus.modules.base.config.ApplicationProperties;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.ModuleDTO;
import org.lamisplus.modules.base.domain.entity.Module;
import org.lamisplus.modules.base.domain.mapper.ModuleMapper;
import org.lamisplus.modules.base.repository.ModuleRepository;
import org.lamisplus.modules.base.util.ClassPathHacker;
import org.lamisplus.modules.base.util.GenericSpecification;
import org.lamisplus.modules.base.util.module.ModuleUtil;
import org.lamisplus.modules.base.util.module.StorageUtil;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.xeustechnologies.jcl.JarClassLoader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.URL;
import java.net.URLClassLoader;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@org.springframework.stereotype.Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class ModuleService {
    private final ModuleRepository moduleRepository;
    private final ModuleMapper moduleMapper;
    private final StorageUtil storageService;
    private final ApplicationProperties properties;
    private List<String> classList = new ArrayList<String>();
    private String fileSeparator = File.separator;
    //private final UserService userService;

    public Module save(ModuleDTO moduleDTO) {
        Optional<Module> moduleOptional = this.moduleRepository.findByName(moduleDTO.getName());
        if(moduleOptional.isPresent()) throw new RecordExistException(Module.class, "Module Id", moduleDTO.getName());

        final Module module = this.moduleMapper.toModuleDTO(moduleDTO);
        //module.setCreatedBy(userService.getUserWithAuthorities().get().getUserName());

        return this.moduleRepository.save(module);
    }

    public List<Module> getAllModules(){
        GenericSpecification<Module> genericSpecification = new GenericSpecification<Module>();
        Specification<Module> specification = genericSpecification.findAll();
        List<Module> moduleList = this.moduleRepository.findAll(specification);
        //if(moduleList.size() > 0 || moduleList == null) throw new EntityNotFoundException(Module.class, "Module", moduleId + "");
        return moduleList;
    }

    public Module bootstrap(MultipartFile file, Boolean overrideExistFile) {
        List<Module> configs = new ArrayList<>();
        Module module = new Module();
        //create a new file to get file name
        File jarFile = new File(file.getOriginalFilename());
        String fileName = jarFile.getName().toLowerCase().replace(".jar","");

        //Check to see if module exist
        /*Optional<Module> moduleOptional = this.moduleRepository.findByName(fileName);
        if(moduleOptional.isPresent() && moduleOptional.get().getArchived() != 1) {
            if(overrideExistFile == null || overrideExistFile == false ){
                throw new RecordExistException(Module.class, "Module", fileName);
            }
            moduleOptional.get().setVersion("new version");
            moduleRepository.save(moduleOptional.get());
        }*/

        //Copy files
        storageService.store(fileName, file, overrideExistFile);

        module.setName(fileName);
        module.setActive(true);
        module.setModuleType(1);
        //this.moduleRepository.save(module);
        final Path moduleRuntimePath = Paths.get(properties.getModulePath(), "runtime", module.getName());

        try {
            //ModuleUtil.getContentAndLoadModuleConfig(file.getInputStream(), "module.yml", configs,fileName, true);
            //moduleUtil.readZipFileRecursive(file.getInputStream(), fileName, true);
            ModuleUtil.copyPathFromJar(storageService.getURL(jarFile.getName().toLowerCase()), fileSeparator, moduleRuntimePath);

        } catch (Exception e) {
            e.printStackTrace();
        }
        return module;
    }

    public void startModule(String moduleName){
        //fileSeparator = File.separator;
        ClassLoader prevCl = this.getClass().getClassLoader();

        final Path moduleRuntimePath = Paths.get(properties.getModulePath(), "runtime", moduleName);

        File rootFile = new File(moduleRuntimePath.toAbsolutePath().toString());

        //File Dependencies = new File(moduleRuntimePath.toAbsolutePath().toString() + "/lib");

        File filePath = new File(moduleRuntimePath.toAbsolutePath().toString() + "/org/lamisplus/modules/" + moduleName);

        try {
            ClassPathHacker.addFile(rootFile.getAbsolutePath());

            /*for (File jar : Dependencies.listFiles()) {
                InputStream targetStream = new FileInputStream(jar);
                String jarFileName = jar.getName().toLowerCase().replace(".jar","");
                classList = moduleUtil.readZipFileRecursive(targetStream, jarFileName, false);
            }*/

            List<URL> listURL = showFiles(filePath.listFiles(), rootFile);

            URL [] urlArray = new URL [listURL.size()];

            URLClassLoader loader = new URLClassLoader(urlArray, prevCl);

            List<Class> allClass = new ArrayList<>();
            classList.forEach(className ->{
                try {
                    allClass.add(loader.loadClass(className));
                } catch (ClassNotFoundException e) {
                    e.printStackTrace();
                }
            });

            allClass.add(BaseApplication.class);
            Class [] classArray = new Class[allClass.size()];
            allClass.toArray(classArray);


            /*Class clazz = loader.loadClass("org.lamisplus.modules.demo.DemoModuleApplication");
            System.out.println(clazz.getMethod("sayHello").getReturnType().toString());


            Class clazz2 = loader.loadClass("org.lamisplus.modules.demo.service.HelloService");
            System.out.println(clazz2.getSimpleName());

            isLoaded = clazz.getSimpleName().contains("DemoModuleApplication");
            System.out.println(clazz.getSimpleName());

            Constructor constructor = clazz.getConstructor();
            Object myClassObject = constructor.newInstance();

            // Getting the target method from the loaded class and invoke it using its name
            Method method = clazz.getMethod("sayHello");
            System.out.println("Invoked method name: " + method.getName());
            method.invoke(myClassObject);*/

            BaseApplication.restart(classArray);


        } catch (Exception e) {
        // Handle the exception
        e.printStackTrace();
        }
    }

    public List<URL> showFiles(File[] files, File rootFile) throws IOException {
        String absolutePath = rootFile.getAbsolutePath();

        List<URL> urlList = new ArrayList<>();
        for (File file : files) {
                if (file.isDirectory()) {
                    ClassPathHacker.addFile(file.getAbsolutePath());
                    showFiles(file.listFiles(),rootFile); // Calls same method again.
                } else {
                    if(file.getAbsolutePath().endsWith(".class")) {
                        String filePathName = file.getAbsolutePath().replace(absolutePath + fileSeparator, "");
                        String processedName = filePathName.replace(".class", "");
                        processedName = processedName.replace(fileSeparator, ".");
                        classList.add(processedName);
                    }
                }
        }
        return urlList;
    }
}