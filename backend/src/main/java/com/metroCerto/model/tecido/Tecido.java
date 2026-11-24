package com.metroCerto.model.tecido;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.math.BigDecimal;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Tecido implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nome;

    @Lob
    @Column(nullable = false, columnDefinition = "MEDIUMBLOB")
    private byte[] estampa;

    @Column(nullable = false, precision = 10, scale = 2, name = "saldo_atual")
    private BigDecimal saldoAtual;

    @Column(nullable = false, precision = 10, scale = 2, name = "estoque_min")
    private BigDecimal estoqueMin;
}
