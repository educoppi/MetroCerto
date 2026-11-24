package com.metroCerto.dtos;

import java.math.BigDecimal;

// estampa chega no JSON como texto base64 e o Jackson converte para byte[]
public record TecidoRequestDTO(String nome, byte[] estampa, BigDecimal saldoAtual, BigDecimal estoqueMin) {
}
