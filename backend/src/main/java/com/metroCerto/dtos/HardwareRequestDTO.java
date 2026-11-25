package com.metroCerto.dtos;

import java.math.BigDecimal;

// Parâmetros enviados pelo hardware: GET /registros/hardware?id=1&metro=1.25
// id -> id do tecido (rolo); metro -> metros retirados
public record HardwareRequestDTO(Long id, BigDecimal metro) {
}
