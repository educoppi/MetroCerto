package com.metroCerto.dtos;

import com.metroCerto.model.registro.Registro;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record RegistroResponseDTO(Long id, Long idUsuario, String nomeUsuario, Long idTecido, String nomeTecido,
                                  BigDecimal metroMovimentado, LocalDateTime dataHora) {

    public static RegistroResponseDTO from(Registro registro) {
        return new RegistroResponseDTO(
                registro.getId(),
                registro.getUsuario().getId(),
                registro.getUsuario().getNome(),
                registro.getTecido().getId(),
                registro.getTecido().getNome(),
                registro.getMetroMovimentado(),
                registro.getDataHora()
        );
    }
}
