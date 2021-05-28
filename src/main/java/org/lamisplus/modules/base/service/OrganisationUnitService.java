package org.lamisplus.modules.base.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.lamisplus.modules.base.controller.apierror.EntityNotFoundException;
import org.lamisplus.modules.base.controller.apierror.RecordExistException;
import org.lamisplus.modules.base.domain.dto.OrganisationUnitDTO;
import org.lamisplus.modules.base.domain.dto.OrganisationUnitExtraction;
import org.lamisplus.modules.base.domain.entity.OrganisationUnit;
import org.lamisplus.modules.base.domain.entity.OrganisationUnitHierarchy;
import org.lamisplus.modules.base.domain.mapper.OrganisationUnitMapper;
import org.lamisplus.modules.base.repository.OrganisationUnitHierarchyRepository;
import org.lamisplus.modules.base.repository.OrganisationUnitRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@Slf4j
@RequiredArgsConstructor
public class OrganisationUnitService {
    private static final int UNARCHIVED = 0;
    private static final int ARCHIVED = 1;
    private static final Long FIRST_ORG_LEVEL = 1L;
    private final OrganisationUnitRepository organisationUnitRepository;
    private final OrganisationUnitMapper organisationUnitMapper;
    private final OrganisationUnitHierarchyRepository organisationUnitHierarchyRepository;

    public OrganisationUnit save(OrganisationUnitDTO organisationUnitDTO) {
        Optional<OrganisationUnit> organizationOptional = organisationUnitRepository.findByNameAndParentOrganisationUnitIdAndArchived(organisationUnitDTO.getName(), organisationUnitDTO.getId(), UNARCHIVED);
        if(organizationOptional.isPresent())throw new RecordExistException(OrganisationUnit.class, "Name", organisationUnitDTO.getName() +"");
        final OrganisationUnit organisationUnit = organisationUnitMapper.toOrganisationUnit(organisationUnitDTO);

        OrganisationUnit organisationUnit1 = organisationUnitRepository.save(organisationUnit);
        Long level = organisationUnit1.getOrganisationUnitLevelId();
        List<OrganisationUnitHierarchy> organisationUnitHierarchies = new ArrayList<>();
        OrganisationUnit returnOrgUnit = organisationUnit1;

        Long parent_org_unit_id = 1L;
        while(parent_org_unit_id > 0){
            parent_org_unit_id = organisationUnit1.getParentOrganisationUnitId();
            organisationUnitHierarchies.add(new OrganisationUnitHierarchy(null, returnOrgUnit.getId(), organisationUnit1.getParentOrganisationUnitId(),
                    level, null, null, null));

            Optional<OrganisationUnit> organisationUnitOptional = organisationUnitRepository.findById(organisationUnit1.getParentOrganisationUnitId());
            if(organisationUnitOptional.isPresent()){
                organisationUnit1 = organisationUnitOptional.get();
            }
            --parent_org_unit_id;
        }
        organisationUnitHierarchyRepository.saveAll(organisationUnitHierarchies);
        return returnOrgUnit;
    }

    //TODO: work on this
    public OrganisationUnit update(Long id, OrganisationUnitDTO organisationUnitDTO) {
        Optional<OrganisationUnit> organizationOptional = organisationUnitRepository.findByIdAndArchived(id, UNARCHIVED);
        if(!organizationOptional.isPresent())throw new EntityNotFoundException(OrganisationUnit.class, "Id", id +"");
        final OrganisationUnit organisationUnit = organisationUnitMapper.toOrganisationUnit(organisationUnitDTO);

        organisationUnit.setId(id);
        return organisationUnitRepository.save(organisationUnit);
    }

    public Integer delete(Long id) {
        Optional<OrganisationUnit> organizationOptional = organisationUnitRepository.findByIdAndArchived(id, UNARCHIVED);
        if (!organizationOptional.isPresent())throw new EntityNotFoundException(OrganisationUnit.class, "Id", id +"");
        organizationOptional.get().setArchived(ARCHIVED);
        return organizationOptional.get().getArchived();
    }

    public OrganisationUnit getOrganizationUnit(Long id){
        Optional<OrganisationUnit> organizationOptional = organisationUnitRepository.findByIdAndArchived(id, UNARCHIVED);
        if (!organizationOptional.isPresent())throw new EntityNotFoundException(OrganisationUnit.class, "Id", id +"");
        return organizationOptional.get();
    }

    public List<OrganisationUnit> getOrganisationUnitByParentOrganisationUnitId(Long id) {
        return  organisationUnitRepository.findAllOrganisationUnitByParentOrganisationUnitIdAndArchived(id, UNARCHIVED);
    }

    public List<OrganisationUnit> getAllOrganizationUnit() {
        return organisationUnitRepository.findAllByArchivedOrderByIdAsc(UNARCHIVED);
    }

    public List<OrganisationUnit> getOrganisationUnitByParentOrganisationUnitIdAndOrganisationUnitLevelId(Long parentOrgUnitId, Long orgUnitLevelId) {
        return organisationUnitRepository.findAllByParentOrganisationUnitIdAndOrganisationUnitLevelId(parentOrgUnitId, orgUnitLevelId);
    }

    public List<OrganisationUnit> getOrganisationUnitByOrganisationUnitLevelId(Long id) {
        return organisationUnitRepository.findAllByOrganisationUnitLevelId(id);
    }

    public List<OrganisationUnitDTO> getOrganisationUnitSubsetByParentOrganisationUnitIdAndOrganisationUnitLevelId(Long parent_org_unit_id, Long org_unit_level_id) {
        List<OrganisationUnitHierarchy> organisationUnitHierarchies = organisationUnitHierarchyRepository.findAllByParentOrganisationUnitIdAndOrganisationUnitLevelId(parent_org_unit_id, org_unit_level_id);
        List<OrganisationUnitDTO> organisationUnitDTOS = new ArrayList<>();
        organisationUnitHierarchies.forEach(organisationUnitHierarchy -> {
            final OrganisationUnitDTO organisationUnitDTO = organisationUnitMapper.toOrganisationUnitDTO(organisationUnitHierarchy.getOrganisationUnitByOrganisationUnitId());
            organisationUnitDTOS.add(organisationUnitDTO);
        });
        return organisationUnitDTOS;
    }

    public List<OrganisationUnit> getAllOrganisationUnitByOrganisationUnitLevelId(Long organisationUnitLevelId) {
        List<Long> levels = new ArrayList<>();
        for(Long i = FIRST_ORG_LEVEL; i < organisationUnitLevelId; i++){
            levels.add(i);
        }
        return organisationUnitRepository.findAllByOrganisationUnitLevelIdIn(levels);
    }

    public List getAll(){
        List orgList = new ArrayList();
        try {
            orgList = this.readDataFromExcelFile("C:\\Users\\Dell\\Documents\\PALLADIUM WORKS\\PALLADIUM WORKS\\IP_Facilities.xlsx");
        } catch (IOException e) {
            e.printStackTrace();
        }
        return orgList;
    }

    public List<OrganisationUnitDTO> readDataFromExcelFile(String excelFilePath) throws IOException {

        List<OrganisationUnitExtraction> organisationUnitExtractions = new ArrayList<OrganisationUnitExtraction>();
        List<OrganisationUnitDTO> organisationUnitDTOS = new ArrayList<>();


        FileInputStream inputStream = new FileInputStream(new File(excelFilePath));
        try {

            XSSFWorkbook workbook = new XSSFWorkbook(inputStream);

            Sheet firstSheet = workbook.getSheetAt(0);

            Iterator<Row> iterator = firstSheet.iterator();
            while (iterator.hasNext()) {
                Row nextRow = iterator.next();
                Iterator<Cell> cellIterator = nextRow.cellIterator();
                OrganisationUnitExtraction organisationUnitExtraction = new OrganisationUnitExtraction();
                OrganisationUnitDTO organisationUnitDTO = new OrganisationUnitDTO();

                while (cellIterator.hasNext()) {
                    Cell nextCell = cellIterator.next();
                    int columnIndex = nextCell.getColumnIndex();
                    String parentOrganisationUnitName = "";
                    switch (columnIndex) {
                        case 0:
                            organisationUnitExtraction.setOrganisationUnitName(String.valueOf(nextCell).trim());
                            //System.out.println(getCellValue(nextCell));
                            break;
                        case 1:
                            parentOrganisationUnitName = String.valueOf(nextCell).trim();
                            organisationUnitExtraction.setParentOrganisationUnitName(parentOrganisationUnitName);
                            //System.out.println(getCellValue(nextCell));
                            break;
                        case 2:
                            String parentParentOrganisationUnitName = String.valueOf(nextCell).trim();
                            organisationUnitExtraction.setParentParentOrganisationUnitName(parentParentOrganisationUnitName);
                            organisationUnitExtraction.setDescription("Facility in "+organisationUnitExtraction.getParentOrganisationUnitName());
                            Long id = organisationUnitRepository.findByOrganisationDetails(organisationUnitExtraction.getParentOrganisationUnitName(), parentParentOrganisationUnitName);
                            organisationUnitExtraction.setParentOrganisationUnitId(id);

                            organisationUnitDTO.setName(organisationUnitExtraction.getOrganisationUnitName());
                            organisationUnitDTO.setDescription(organisationUnitExtraction.getDescription());
                            organisationUnitDTO.setOrganisationUnitLevelId(4L);
                            organisationUnitDTO.setParentOrganisationUnitId(organisationUnitExtraction.getParentOrganisationUnitId());
                            save(organisationUnitDTO);
                            break;
                    }
                }
                organisationUnitDTOS.add(organisationUnitDTO);
                organisationUnitExtractions.add(organisationUnitExtraction);
            }
            inputStream.close();
        }catch (Exception e){
            e.printStackTrace();
        }
        return organisationUnitDTOS;
    }

    private Object getCellValue(Cell cell) {
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case BOOLEAN:
                return cell.getBooleanCellValue();
            case NUMERIC:
                return cell.getNumericCellValue();
        }
        return null;
    }
}
