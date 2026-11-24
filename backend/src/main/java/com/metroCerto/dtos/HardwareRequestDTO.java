package com.metroCerto.dtos;

import java.math.BigDecimal;

// JSON enviado pelo hardware: { "tecido": 1.25 } -> metros retirados
public record HardwareRequestDTO(BigDecimal tecido) {
}
