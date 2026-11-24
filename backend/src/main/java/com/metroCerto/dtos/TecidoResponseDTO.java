package com.metroCerto.dtos;

import com.metroCerto.model.tecido.Tecido;

import java.math.BigDecimal;

// Não inclui a imagem: ela é servida em GET /tecidos/{id}/estampa
public record TecidoResponseDTO(Long id, String nome, BigDecimal saldoAtual, BigDecimal estoqueMin) {

    public static TecidoResponseDTO from(Tecido tecido) {
        return new TecidoResponseDTO(tecido.getId(), tecido.getNome(), tecido.getSaldoAtual(), tecido.getEstoqueMin());
    }
}
