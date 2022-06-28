package org.lamisplus.modules.base.domain.dto;

import lombok.Data;
import org.lamisplus.modules.base.domain.entity.DrugOrder;

import java.util.List;

@Data
public class DrugOrderDTOS {
    private List<DrugOrder> drugOrders;
}
