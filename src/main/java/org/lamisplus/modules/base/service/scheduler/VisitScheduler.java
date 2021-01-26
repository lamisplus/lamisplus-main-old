package org.lamisplus.modules.base.service.scheduler;


import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lamisplus.modules.base.domain.dto.VisitDTO;
import org.lamisplus.modules.base.domain.entity.Visit;
import org.lamisplus.modules.base.domain.mapper.VisitMapper;
import org.lamisplus.modules.base.repository.VisitRepository;
import org.lamisplus.modules.base.service.VisitService;
import org.lamisplus.modules.base.util.CustomDateTimeFormat;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
public class VisitScheduler {
    private final VisitService visitService;
    private final VisitMapper visitMapper;
    private final VisitRepository visitRepository;

    /**
     * Auto checkOut fires 1 hour
     */
    @Scheduled(fixedDelay = 10000000, initialDelay = 50000)
    public void autoCheckOut() {
        try {
            List<VisitDTO> visitDTOList = this.visitService.getAllVisits();
            visitDTOList.forEach(visitDTO -> {
                //Check patient type
                if (visitDTO.getTypePatient() != null && visitDTO.getTypePatient() <= 2) {
                    Visit visit = this.visitMapper.toVisit(visitDTO);
                    if (visit.getDateVisitStart() == null || visit.getTimeVisitStart() == null) {
                        return;
                    }
                    if (visit.getDateVisitEnd() == null || visit.getTimeVisitEnd() == null) {
                        LocalDate localDate = visit.getDateVisitStart().plusDays(1);
                        LocalTime localTime = visit.getTimeVisitStart().plusHours(24);
                        LocalDate customNowLocalDate = CustomDateTimeFormat.LocalDateByFormat(LocalDate.now(), "dd-MM-yyyy");
                        LocalTime customNowLocalTime = CustomDateTimeFormat.LocalTimeByFormat(LocalTime.now(), "hh:mm a");
                        if ((customNowLocalDate.isAfter(localDate) || customNowLocalDate.isEqual(localDate)) &&
                                (customNowLocalTime.isAfter(localTime) || customNowLocalTime.equals(localTime))) {
                            visit.setDateVisitEnd(localDate);
                            visit.setTimeVisitEnd(localTime);
                            //visit.setModifiedBy("System");
                            this.visitRepository.save(visit);
                        }
                    }

                }
            });
        }catch(NullPointerException e){
            log.info(e.getMessage());
        }
    }


}
