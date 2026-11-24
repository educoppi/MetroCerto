package com.metroCerto.dtos;

import java.math.BigDecimal;

public record RegistroRequestDTO(Long idUsuario, Long idTecido, BigDecimal metroMovimentado) {
}
