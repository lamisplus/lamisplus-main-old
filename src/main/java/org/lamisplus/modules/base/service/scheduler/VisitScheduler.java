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
    private static final int ONE_DAY = 1;
    private static final int TWENTY_FOUR_HOURS = 24;
    private static final String AUTOMATED = "Automated";
    private static final int UN_ARCHIVED = 0;
    //private final VisitService visitService;
    //private final VisitMapper visitMapper;
    private final VisitRepository visitRepository;

    /**
     * Auto checkOut fires 1 hour
     */
    @Scheduled(fixedDelay = 10000000, initialDelay = 50000)
    public void autoCheckOut() {
        try {
            List<Visit> visitList = visitRepository.findAllByArchived(UN_ARCHIVED);
            visitList.forEach(visit -> {
                //Check patient type
                if (visit.getTypePatient() != null && visit.getTypePatient() <= 2) {
                    if (visit.getDateVisitStart() == null || visit.getTimeVisitStart() == null) {
                        return;
                    }
                    if (visit.getDateVisitEnd() == null || visit.getTimeVisitEnd() == null) {
                        LocalDate localDate = visit.getDateVisitStart().plusDays(ONE_DAY);
                        LocalTime localTime = visit.getTimeVisitStart().plusHours(TWENTY_FOUR_HOURS);
                        LocalDate customNowLocalDate = CustomDateTimeFormat.LocalDateByFormat(LocalDate.now(), "dd-MM-yyyy");
                        LocalTime customNowLocalTime = CustomDateTimeFormat.LocalTimeByFormat(LocalTime.now(), "hh:mm a");
                        if ((customNowLocalDate.isAfter(localDate) || customNowLocalDate.isEqual(localDate)) &&
                                (customNowLocalTime.isAfter(localTime) || customNowLocalTime.equals(localTime))) {
                            visit.setDateVisitEnd(localDate);
                            visit.setTimeVisitEnd(localTime);
                            visit.setModifiedBy(AUTOMATED);
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
