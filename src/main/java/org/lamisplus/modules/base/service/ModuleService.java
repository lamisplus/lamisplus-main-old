package org.lamisplus.modules.base.service;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.lamisplus.modules.base.BaseApplication;
import org.lamisplus.modules.base.bootstrap.*;
import org.lamisplus.modules.base.config.ApplicationProperties;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.IllegalTypeException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.ModuleDTO;
import org.lamisplus.modules.base.domain.entity.*;
import org.lamisplus.modules.base.domain.mapper.ModuleMapper;
import org.lamisplus.modules.base.repository.*;
import org.lamisplus.modules.base.util.CustomFileVisitorUtil;
import org.lamisplus.modules.base.util.DataLoader;
import org.lamisplus.modules.base.util.FileStorage;
import org.lamisplus.modules.base.util.GenericSpecification;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.xeustechnologies.jcl.JarClassLoader;
import org.xeustechnologies.jcl.JclObjectFactory;
import org.xeustechnologies.jcl.context.DefaultContextLoader;

import javax.servlet.http.HttpServletRequest;
import java.io.*;
import java.lang.reflect.Array;
import java.lang.reflect.InvocationTargetException;
import java.net.URL;
import java.net.URLClassLoader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.sql.Timestamp;
import java.util.*;

import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;

@org.springframework.stereotype.Service
@Slf4j
@Transactional
@RequiredArgsConstructor
public class ModuleService {

    private final ModuleRepository moduleRepository;
    private final MenuRepository menuRepository;
    private final ModuleDependencyRepository moduleDependencyRepository;
    private final FormRepository formRepository;
    private final ModuleMapper moduleMapper;
    private final StorageUtil storageService;
    private final ApplicationProperties properties;
    private final Set<String> classNames;
    private final String fileSeparator = File.separator;
    private final Set<Class> moduleClasses;
    private final GenericSpecification<Module> genericSpecification;
    private final UserService userService;
    private final ProgramRepository programRepository;
    private final DataLoader<Form> formDataLoader;
    private final EncounterRepository encounterRepository;
    private static final int MODULE_TYPE = 1;
    private static final int STATUS_UPLOADED = 1;
    private static final int STATUS_INSTALLED = 2;
    private static final int STATUS_STARTED = 3;
    private static final int DEACTIVATED = 5;
    private static final int ARCHIVED = 1;
    private static final int UN_ARCHIVED = 0;
    private static final String OLD_MODULE_SUFFIX = "_old";
    private static final int STATUS_EXIST = 4;
    private static String ORG_LAMISPLUS_MODULES_PATH = "/org/lamisplus/modules/";
    private List<Module> externalModules;
    private static final boolean ACTIVE = true;
    private static final String FORM = "Form";
    private static final boolean INACTIVE = false;
    private static final String TEMP = "_temp";
    private static final String DOT_JAR = ".jar";
    private final ConfigurableApplicationContext context;
    private static final String MODULE_CLASS_NAME = "module";
    private static final String DOT_CLASS = ".class";
    private Timestamp ts = new Timestamp(System.currentTimeMillis());
    String currentUser;
    @Value("${base.url}")
    private String baseUrl;
    private final FilesStorageServiceImpl filesStorageServiceImpl;
    JarClassLoader jcl;

    public Module save(ModuleDTO moduleDTO) {
        Optional<Module> moduleOptional = this.moduleRepository.findByName(moduleDTO.getName());
        if(moduleOptional.isPresent()) throw new RecordExistException(Module.class, MODULE_CLASS_NAME, moduleDTO.getName());

        final Module module = this.moduleMapper.toModuleDTO(moduleDTO);
        module.setCreatedBy(userService.getUserWithRoles().get().getUserName());
        if(module.getDateCreated() == null){
            module.setDateCreated(ts);
        }
        module.setArchived(UN_ARCHIVED);

        return this.moduleRepository.save(module);
    }

    public List<Module> getAllModules(){
        Specification<Module> specification = genericSpecification.findAll(0);
        return this.moduleRepository.findAll(specification);
    }

    public List<Module> uploadAndUnzip(MultipartFile[] files, HttpServletRequest request) {
        ModuleUtil.setModuleConfigs();
        currentUser = userService.getUserWithRoles().get().getUserName();



        Arrays.asList(files).stream().forEach(file ->{
            if(!file.getOriginalFilename().contains(DOT_JAR)){
                log.info("File is not a jar file");
                log.info(file.getContentType());
                throw new IllegalTypeException(Module.class, file.getOriginalFilename(), "not a jar file");
            }
        });

        Arrays.asList(files).stream().forEach(file ->{
            File jarFile = new File(file.getOriginalFilename());
            String jarName = jarFile.getName().toLowerCase();

            String fileName = jarFile.getName().toLowerCase().replace(DOT_JAR,"");
            log.info("name of jar file: " + fileName);
            Optional<Module> optionalModule =  moduleRepository.findByName(fileName);
            //ModuleUtil.createUIDirectory(fileName);


            //final Path modulePath = Paths.get(properties.getModulePath());
            Path modulePath = null;
            try {
                String path = filesStorageServiceImpl.uploadFile(file, request);
                ModuleUtil.uiPath = modulePath;
                modulePath = Paths.get(path);
                ModuleUtil.uiPath = modulePath;
            } catch (Exception e) {
                e.printStackTrace();
            }
            //System.out.println("modulePath - " + modulePath);
            log.info("modulePath -" + modulePath);

            storageService.setRootLocation(modulePath);
            /*if(optionalModule.isPresent() && optionalModule.get().getStatus() == STATUS_STARTED
                    && !optionalModule.get().getName().contains(TEMP)){
                    storageService.store(fileName, file, fileName + TEMP + DOT_JAR);
                    fileName = fileName + TEMP;
                    isExist = true;
                    jarName = jarName.replace(DOT_JAR, "") + TEMP + DOT_JAR;
                    log.debug(fileName + " Uploaded...");
            } else {
                //Copy files
                storageService.store(fileName, file, null);
                log.debug(fileName + " Uploaded...");
                isExist = false;
            }*/
            //storageService.store(fileName, file, null);
            final Path moduleRuntimePath = Paths.get(properties.getModulePath(), "runtime", fileName);
            /*if(moduleRuntimePath != null){
                try {
                    FileUtils.deleteDirectory(moduleRuntimePath.toFile());
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }*/



            try {
                if(!optionalModule.isPresent()){
                    ModuleUtil.copyPathFromJar(modulePath.toUri().toURL(),
                            fileSeparator, moduleRuntimePath);
                }else if(optionalModule.isPresent() && optionalModule.get().getStatus() != STATUS_STARTED) {
                    ModuleUtil.copyPathFromJar(modulePath.toUri().toURL(),
                            fileSeparator, moduleRuntimePath);
                } else {
                    Module module = optionalModule.get();
                    ModuleUtil.addModuleConfigs(module);
                }

                log.debug(fileName + " Unzipped...");

            } catch (Exception e) {
                log.debug(e.getMessage());
                e.printStackTrace();
                throw new RuntimeException("Server error module not loaded: " + e.getMessage());
            }
        });

        return saveExternalModuleWithItsProperties(ModuleUtil.getModuleConfigs(), false);
    }

    private List<Module> saveExternalModuleWithItsProperties(List<Module> moduleConfigs, Boolean notArchived) {
        List<Module> modules = new ArrayList<Module>();
        //Saving a module, program, form to db
        moduleConfigs.forEach(externalModule -> {
           /* if(replace){
                externalModule.setStatus(STATUS_UPLOADED);
                externalModule.setName(externalModule.getName().replace(TEMP, ""));
            }*/
            if(externalModule.getId() == null) {
                externalModule.setActive(INACTIVE);
                externalModule.setUuid(UUID.randomUUID().toString());
                externalModule.setModuleType(MODULE_TYPE);
                externalModule.setStatus(STATUS_UPLOADED);
                externalModule.setArchived(ARCHIVED);
            }
            if(notArchived){
                externalModule.setArchived(UN_ARCHIVED);
                externalModule.setActive(ACTIVE);
                externalModule.setStatus(STATUS_STARTED);
            }
            Optional<Module> moduleOptional = moduleRepository.findByName(externalModule.getName().toLowerCase());


            //Saving module...
            final Module module = moduleOptional.isPresent()? moduleOptional.get(): moduleRepository.save(externalModule);
            log.debug(module.getName() + " saved...");
            modules.add(module);

            //menu of external module
            if (externalModule.getMenuByModule() != null) {
                Menu menu = externalModule.getMenuByModule();
                if(menu.getName() != null){
                    menu.setArchived(ARCHIVED);
                    menu.setUrl(baseUrl + menu.getName() + "/static/index.html");
                    menu.setUuid(UUID.randomUUID().toString());
                    menu.setCreatedBy(currentUser);
                    menu.setModuleId(module.getId());
                    String name = menu.getName();
                    log.debug("menu base url - " + menu);

                    if(!module.getMenuByModule().getName().equals(menu.getName())){
                        menuRepository.save(menu);
                        log.debug("save menu is - " + menu);
                    }
                }
            }
            log.debug("We are here- ");


            //Getting all dependencies
            if(externalModule.getModuleDependencyByModule() != null && !externalModule.getModuleDependencyByModule().isEmpty()) {
                externalModule.getModuleDependencyByModule().forEach(moduleDependency -> {
                    if (moduleDependency.getId() == null) {
                        moduleDependency.setModuleId(module.getId());
                        moduleDependency.setArchived(ARCHIVED);
                    }
                    if (notArchived) {
                        moduleDependency.setArchived(UN_ARCHIVED);
                    }
                    //save dependencies
                    final Optional<ModuleDependency> OptionalDependency = moduleDependencyRepository.findByModuleIdAndArtifactId(
                            module.getId(), moduleDependency.getArtifactId());
                    final ModuleDependency dependency = OptionalDependency.isPresent() ? OptionalDependency.get() : moduleDependencyRepository.save(moduleDependency);
                    log.debug(dependency.getArtifactId() + " saved...");
                });
            }

            //Get program
            externalModule.getProgramsByModule().forEach(program -> {
                Program program1 = null;
                if(programRepository.findByModuleId(module.getId()).size() < 1){
                    if(program.getId() == null) {
                        program.setModuleId(module.getId());
                        program.setCode(UUID.randomUUID().toString());
                        program.setArchived(ARCHIVED);
                        //Saving program...
                        programRepository.save(program);
                    }
                    if(notArchived){
                        program.setArchived(UN_ARCHIVED);
                    }
                    //final Program program1 = programRepository.save(program);
                    log.debug(program.getName() + " saved...");
                }

                //Get forms
                if(program.getFormsByProgram() == null && program.getId() != null) {
                    ModuleUtil.getJsonFile().forEach(jsonFile -> {
                        if (jsonFile.getName().contains(FORM)) {
                            loadExternalModuleForms(jsonFile).forEach(form -> {
                                form.setArchived(ARCHIVED);
                                form.setProgramCode(program.getCode());
                                form.setCode(UUID.randomUUID().toString());
                                //Saving form...
                                final Form form1 = formRepository.save(form);
                                log.debug(form1.getName() + " saved...");

                            });
                        }
                    });
                } else {
                    if(notArchived){
                        program.getFormsByProgram().forEach(form -> {
                            form.setArchived(UN_ARCHIVED);
                            final Form form1 = formRepository.save(form);
                            log.debug(form1.getName() + " saved...");
                        });
                    }
                }
            });
            if(module.getStatus() == STATUS_STARTED) {
                module.setStatus(STATUS_EXIST);
            }else {
                cleanUpExternalModuleFolder(externalModule);
            }
        });
        return modules;
    }

    public Module installModule(Long moduleId, Boolean isInitialized){
        //classNames.clear();
        Optional<Module> moduleOptional = moduleRepository.findById(moduleId);
        List<Module> moduleList = new ArrayList<>();
        Object obj = null;

        if(!moduleOptional.isPresent()) {
            throw new EntityNotFoundException(Module.class, MODULE_CLASS_NAME, moduleId + "");
        }
        Module module = moduleOptional.get();
        moduleList.add(module);

        /*if(moduleOptional.get().getName().contains(TEMP) && isInitialized == null) {
            module = overridingOldModuleWithNewModule(moduleOptional.get());
        }*/

        final Path moduleRuntimePath = Paths.get(properties.getModulePath(), "runtime", module.getName());


        if(module.getStatus() == STATUS_EXIST) {
            final Path moduleJarPath = Paths.get(properties.getModulePath(), module.getName()+DOT_JAR);

            if(moduleJarPath != null) {
                File jarFile = moduleJarPath.toFile();
                String jarName = jarFile.getName().toLowerCase();
                try {
                    ModuleUtil.copyPathFromJar(storageService.getURL(jarName),
                            fileSeparator, moduleRuntimePath);
                    module.setStatus(STATUS_UPLOADED);
                    List<Module> modules = new ArrayList<>();
                    modules.add(module);
                    saveExternalModuleWithItsProperties(modules, false);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
        ORG_LAMISPLUS_MODULES_PATH = fileSeparator + module.getBasePackage().replace(".", fileSeparator) + fileSeparator;

        File rootFile = new File(moduleRuntimePath.toAbsolutePath().toString());
        File filePath = new File(moduleRuntimePath.toAbsolutePath().toString() +
                ORG_LAMISPLUS_MODULES_PATH /*+ module.getName().replace(TEMP, "")*/);
        final Path moduleJarPath = Paths.get(properties.getModulePath(), module.getName()+".jar");
        //File moduleJarFile = new File(moduleJarPath.toAbsolutePath().toString());



        log.debug("moduleRuntimePath is " + moduleRuntimePath.toString());

        if(rootFile != null && rootFile.exists()) {
            try {
                //ClassPathHacker.addFile(moduleJarFile.getAbsolutePath());
                ClassPathHacker.addFile(rootFile.getAbsolutePath());
                List<URL> classURL = showFiles(filePath.listFiles(), rootFile, module.getMain());
                ClassLoader loader = new URLClassLoader(classURL.toArray(
                        new URL[classURL.size()]), ClassLoader.getSystemClassLoader());
                jcl=new JarClassLoader();


                for (String className : classNames) {
                    try {
                        if (className.contains(module.getMain())) {
                            Class c = loader.loadClass(className);
                            moduleClasses.add(c);
                            jcl.add(properties.getModulePath() +fileSeparator+"demo.jar");
                            //Create default factory
                            JclObjectFactory factory = JclObjectFactory.getInstance();
                            //Create object of loaded class
                            obj = factory.create(jcl,className);



                            //genericApplicationContext.registerBean(module.getName(), loader.loadClass(className));
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
                DefaultContextLoader context=new DefaultContextLoader(jcl);
                context.loadContext();

/*                JclCustomClassLoader.loadClass(moduleRuntimePath, classNames);
                loadJclLoader();*/

            } catch (IOException e) {
                log.debug(e.getClass().getName()+": " + e.getMessage());
                e.printStackTrace();
                throw new RuntimeException("Server error module not loaded: " + e.getMessage());
            }

            //changing module status
            if(isInitialized == null) {
                switch (module.getStatus()) {
                    case STATUS_EXIST:
                        module.setStatus(STATUS_INSTALLED);
                    case STATUS_UPLOADED:
                        module.setStatus(STATUS_INSTALLED);
                        moduleRepository.save(module);
                        break;
                }
            }
        } else {
            log.debug("Cannot find File" + module.getName());
            //TODO: remove module from externalModules list
        }
        try {
            String[] args = {"test"};
           /* obj.getClass().getDeclaredMethod( "main", String[].class).
                    invoke( obj, new Object[]{new String[0]});*/

            System.out.println(obj.getClass().getDeclaredMethod( "sayHello", null).
                    invoke( obj, null));
        } catch (Exception e) {
            e.printStackTrace();
        }

        return module;
    }
    public void startModule(Boolean isStartUp){
        //Boolean startUp = false;
        System.out.println("STarting starting....");
        if(isStartUp){
            //startUp = isStartUp;
            loadAllExternalModules(STATUS_STARTED, MODULE_TYPE);
        } else {
            loadAllExternalModules(STATUS_INSTALLED, MODULE_TYPE);
        }
        //startUp = false;

        externalModules.forEach(module -> {
            if(!isStartUp){
                if(module.getStatus() == STATUS_INSTALLED) {
                    Menu menu = module.getMenuByModule();
                    if(menu != null){
                        menu.setArchived(UN_ARCHIVED);
                        menuRepository.save(menu);
                    }
                    module.setStatus(STATUS_STARTED);
                    module.setActive(ACTIVE);
                    module.setArchived(UN_ARCHIVED);
                    module.setInstalledBy(userService.getUserWithRoles().get().getUserName());
                    moduleRepository.save(module);

                    module.getModuleDependencyByModule().forEach(moduleDependency -> {
                        moduleDependency.setArchived(UN_ARCHIVED);
                        moduleDependencyRepository.save(moduleDependency);
                    });

                    module.getProgramsByModule().forEach(program -> {
                        program.getFormsByProgram().forEach(form -> {
                            form.setArchived(UN_ARCHIVED);
                            formRepository.save(form);
                        });
                        program.setArchived(UN_ARCHIVED);
                        programRepository.save(program);
                    });

                }
            }
        });


        if(moduleClasses.size() > 0){
            moduleClasses.add(BaseApplication.class);
            Class [] classArray = new Class[moduleClasses.size()];
            moduleClasses.toArray(classArray);
            try {
                BaseApplication.restart(classArray, context);
            }catch (Exception ex){
                ex.printStackTrace();
            }
        }
    }

    public List<Module> getAllModuleByModuleStatus(int moduleType) {
        return getAllModuleByStatusAndModuleType(0, moduleType);
    }

    public Boolean delete(Long id) {
        Optional<Module> moduleOptional = moduleRepository.findById(id);
        if(!moduleOptional.isPresent()){
            throw new EntityNotFoundException(Module.class, MODULE_CLASS_NAME, "Not Found");
        }
        Module module = moduleOptional.get();
        if(module.getModuleType() == 0){
            throw new IllegalTypeException(Module.class, MODULE_CLASS_NAME, "cannot delete core module");
        }
        if(module.menuByModule != null) {
            menuRepository.delete(module.menuByModule);
        }
        module.getProgramsByModule().forEach(program -> {
            program.getFormsByProgram().forEach(form -> formRepository.delete(form));
            programRepository.delete(program);
        });
        module.getModuleDependencyByModule().forEach(moduleDependency -> {
            moduleDependencyRepository.delete(moduleDependency);
        });

        moduleRepository.deleteById(id);
        return true;
    }

    public void loadDependencies(List<Module> modules){
        if(externalModules == null || externalModules.isEmpty()){
            if(modules == null || modules.isEmpty()){
                externalModules = getAllModuleByStatusAndModuleType(STATUS_STARTED, MODULE_TYPE);
            }
        }
        externalModules.forEach(module -> {
            final Path moduleDependencyRuntimePath = Paths.get(properties.getModulePath(), "libs", module.getName());
            //Path libPath = Paths.get(properties.getModulePath(), "libs", module.getName());
            if(module.getModuleDependencyByModule() != null && !module.getModuleDependencyByModule().isEmpty()) {
                for (File file : moduleDependencyRuntimePath.toFile().listFiles()) {
                    System.out.println(file.getName());
                    //Load dependencies
                    System.out.println(module.getName() + " : " + file.exists());
                    module.getModuleDependencyByModule().forEach(moduleDependency -> {
                        if (file.getName().contains(moduleDependency.getArtifactId())) {
                            try {
                                ClassPathHacker.addFile(file.getAbsolutePath());
                            } catch (IOException e) {
                                log.debug(e.getClass().getName() + ": " + e.getMessage());
                                e.printStackTrace();
                            }
                        }
                    });
                }
            } else {
                log.debug("Cannot load dependency to " + module.getName());
            }
        });
    }

    public List<Module> getAllModuleByModuleStatusAndBatchNo(int moduleStatus, String batchNo) {
        if(moduleStatus > 0 && batchNo != null){
            return moduleRepository.findAllByStatusAndBatchNo(moduleStatus, batchNo);
        }else if(batchNo != null){
            return moduleRepository.findAllByBatchNo(batchNo);
        } else {
            moduleStatus = 0;
            return moduleRepository.findAllByStatus(moduleStatus);
        }
    }

    private void loadAllExternalModules(int status, int moduleType){
        externalModules = getAllModuleByStatusAndModuleType(status, moduleType);

        externalModules.forEach(module -> {
            installModule(module.getId(), true);
        });
    }

    private void cleanUpExternalModuleFolder(Module externalModule) {
        Boolean foundFile = false;
        final Path moduleJarPath = Paths.get(properties.getModulePath(), externalModule.getName()+".jar");
        final Path moduleDependencyRuntimePath = Paths.get(properties.getModulePath(), "runtime", externalModule.getName(), "lib");
        File jarFile = new File(moduleJarPath.toString());
        if(jarFile != null && jarFile.exists()){
            //jarFile.delete();
            log.debug(jarFile.getName() + " deleted...");
        }
        if(externalModule.getModuleDependencyByModule() != null && !externalModule.getModuleDependencyByModule().isEmpty() && externalModule.getModuleDependencyByModule().size() < moduleDependencyRuntimePath.toFile().list().length) {
            for (File file : moduleDependencyRuntimePath.toFile().listFiles()) {
                for (ModuleDependency moduleDependency : externalModule.getModuleDependencyByModule()) {
                    if (file.getName().contains(moduleDependency.getArtifactId())) {
                        foundFile = true;
                        break;
                    }
                }
                if(!foundFile){
                    file.delete();
                    log.debug(file.getName() + "deleted...");
                } else {
                    foundFile = false;
                }
            }

            //Path libPath = Paths.get(properties.getModulePath(), "libs", externalModule.getName());
            File src = new File(Paths.get(properties.getModulePath(), "runtime", externalModule.getName(),"lib").toString());

            //Copy dependencies in lib to libs
            try {
                for(File file: src.listFiles()) {
                    //FileSystemUtils.copyRecursively(file, target);
                    if(!file.isDirectory()) {
                        FileUtils.copyFile(file, Paths.get(properties.getModulePath(), "libs", externalModule.getName(), file.getName()).toFile());
                    }
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    private List<URL> showFiles(File[] files, File rootFile, String mainClass) throws IOException {
        String absolutePath = rootFile.getAbsolutePath();

        List<URL> urlList = new ArrayList<>();
        if(files != null) {
            for (File file : files) {
                if (file.isDirectory()) {
                    showFiles(file.listFiles(), rootFile, mainClass); // Calls same method again.
                } else {
                    if (file.getAbsolutePath().endsWith(DOT_CLASS)) {
                        String filePathName = file.getAbsolutePath().replace(absolutePath + fileSeparator, "");
                        String processedName = filePathName.replace(DOT_CLASS, "");
                        processedName = processedName.replace(fileSeparator, ".");
                        if(processedName.contains(mainClass)){
                            urlList.add(file.toURI().toURL());
                            classNames.add(processedName);
                        }
                    }
                }
            }
        }
        return urlList;
    }

    private List<Module> getAllModuleByStatusAndModuleType(int moduleStatus, int moduleType) {
        Specification<Module> moduleSpecification = genericSpecification.findAllModules(moduleStatus, moduleType);
        List<Module> modules = this.moduleRepository.findAll(moduleSpecification);

        return modules;
    }

    private Class getBeanInContext(String clzName){
        Boolean containsBean = BaseApplication.getContext().containsBean(clzName);
        Class clz = null;
        if(containsBean){
            clz = BaseApplication.getContext().getBean(clzName).getClass();
        }

        return clz;
    }

    private List<Form> loadExternalModuleForms(File searchParam){
        String jsonFile = DataLoader.getJsonFile(searchParam.toPath()).toString();
        List<Form> forms = formDataLoader.readJsonFile(new Form(), jsonFile);

        return forms;
    }

    private ClassLoader getMyClassLoader(ClassLoader loader) {
        return loader;
    }

    public void changeFileNames(String tempName, String name) {
        final Path moduleRuntimePath = Paths.get(properties.getModulePath(), "runtime", name);
        //final Path oldModulePath = Paths.get(properties.getModulePath(), "runtime", name+OLD_MODULE_SUFFIX);
        final Path moduleTempPath = Paths.get(properties.getModulePath(), "runtime", tempName);
        final Path libPath = Paths.get(properties.getModulePath(), "libs", name);
        final Path libTempPath = Paths.get(properties.getModulePath(), "libs", tempName);


        String oldModulePathRenamed = "";
        String moduleTempPathRenamed = "";

        try {
            // rename a file in the same directory
            oldModulePathRenamed = Files.move(moduleRuntimePath, moduleRuntimePath.resolveSibling(name+OLD_MODULE_SUFFIX)).toString();
            moduleTempPathRenamed = Files.move(moduleTempPath, moduleTempPath.resolveSibling(name)).toString();

            File file = new File(oldModulePathRenamed);
            File libFiles = new File(libPath.toString());

            file.setWritable(true);
            libFiles.setWritable(true);

            System.gc();
            System.runFinalization();
            Thread.currentThread().sleep(5000);

            org.apache.tomcat.util.http.fileupload.FileUtils.forceDelete(file);
            org.apache.tomcat.util.http.fileupload.FileUtils.forceDelete(libFiles);

            Files.move(libTempPath, libTempPath.resolveSibling(name), REPLACE_EXISTING).toString();

            //file.deleteOnExit();
            System.out.println("changed rootFile- " + oldModulePathRenamed);
            System.out.println("changed tempFile- " + moduleTempPathRenamed);

        }catch (IOException | InterruptedException ie){
            log.debug(ie.getMessage());
            ie.printStackTrace();
        }

    }

    private Module overridingOldModuleWithNewModule(Module newModule) {
        List<Module> newModules = new ArrayList<>();
        List<Module> oldModules = new ArrayList<>();

        String moduleName = newModule.getName();
        Long moduleId = newModule.getId();
        newModules.add(newModule);
        String changedName = UUID.randomUUID().toString().replace("-", "");
        System.out.println(changedName);
        String oldName = moduleName.replace(TEMP,"");
        Optional<Module> optionalOldModule = moduleRepository.findByName(oldName);
        if(optionalOldModule.isPresent() && optionalOldModule.get() != null) {
            final Module oldModule = optionalOldModule.get();
            oldModules.add(oldModule);
            oldModule.getProgramsByModule().forEach(program -> {
                program.getFormsByProgram().forEach(form -> {
                    form.getEncountersByForm().forEach(encounter -> {
                        encounter.setArchived(DEACTIVATED);
                        encounterRepository.save(encounter);
                        // TODO: DEACTIVATED encounter.getFormDataByEncounter();
                    });
                    form.setArchived(DEACTIVATED);
                    formRepository.save(form);
                });
                program.setArchived(DEACTIVATED);
                programRepository.save(program);
            });

            //Unloading a jar file
            //loadDependencies(oldModules, true);

            oldModule.setName(oldName + OLD_MODULE_SUFFIX + "_" + changedName);
            oldModule.setStatus(DEACTIVATED);
            oldModule.setArchived(DEACTIVATED);
            //delete(oldModule.getId());
            moduleRepository.save(oldModule);
            newModule.setStatus(STATUS_UPLOADED);
            moduleRepository.save(newModule);
        }

        return moduleRepository.findById(moduleId).get();
    }
}