package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.ProgramDTO;
import org.lamisplus.modules.base.domain.entity.Form;
import org.lamisplus.modules.base.domain.entity.Module;
import org.lamisplus.modules.base.domain.entity.Program;
import org.lamisplus.modules.base.domain.mapper.ProgramMapper;
import org.lamisplus.modules.base.repository.ModuleRepository;
import org.lamisplus.modules.base.repository.ProgramRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@org.springframework.stereotype.Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class ProgramService {
    private final ProgramRepository programRepository;
    private final ProgramMapper programMapper;
    private final ModuleRepository moduleRepository;
    private final UserService userService;

    public Program save(ProgramDTO programDTO) {
        Optional<Module> moduleOptional = this.moduleRepository.findById(programDTO.getModuleId());
        if(!moduleOptional.isPresent()) throw new EntityNotFoundException(Module.class, "Module Id", programDTO.getModuleId() + "");

        Optional<Program> programOptional = this.programRepository.findProgramByCode(programDTO.getProgramCode());
        if(programOptional.isPresent()) throw new RecordExistException(Program.class, "Program Name", programDTO.getProgramCode() +"");

        final Program program = this.programMapper.toProgramDTO(programDTO);

        return this.programRepository.save(program);
    }

   /* public List<Program> getProgramByModuleId(Long moduleId){
        List<Program> programList = this.programRepository.findByModuleId(moduleId);
        if(programList.size() > 0 || programList == null) throw new EntityNotFoundException(Module.class, "Module Id", moduleId + "");

        return programList;

    }*/

    public List<Program> getAllPrograms(){
        List<Program> programList = this.programRepository.findAll();
        return programList;
    }

    public List<Form> getFormByProgramId(Long programId){
        Optional<Program> programOptional = this.programRepository.findById(programId);
        if(!programOptional.isPresent() || programOptional.get().getArchived() == 1) throw new EntityNotFoundException(Program.class, "Program Id", programId + "");
        List<Form> forms = programOptional.get().getFormsByProgram().stream()
                .sorted(Comparator.comparing(Form::getId).reversed())
                .collect(Collectors.toList());
        return forms;
    }

    public Integer delete(Long id) {
        Optional<Program> programOptional = this.programRepository.findById(id);
        if(!programOptional.isPresent() || programOptional.get().getArchived() == 1) throw new EntityNotFoundException(Program.class, "Program Id", id + "");
        programOptional.get().setArchived(1);
        return programOptional.get().getArchived();
    }

    public Program update(Long id, ProgramDTO programDTO) {
        Optional<Program> programOptional = programRepository.findById(id);
        if(!programOptional.isPresent() || programOptional.get().getArchived() == 1)throw new EntityNotFoundException(Program.class, "Id", id +"");
        final Program program = this.programMapper.toProgramDTO(programDTO);

        program.setId(id);
        return programRepository.save(program);
    }




}
