package com.metroCerto.repositories;

import com.metroCerto.model.tecido.Tecido;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TecidoRepository extends JpaRepository<Tecido, Long> {

    // Lista na ordem de cadastro (o front exibe os rolos nessa ordem)
    List<Tecido> findAllByOrderByIdAsc();

    // Evita dois rolos com o mesmo nome (o front identifica a estampa pelo nome)
    boolean existsByNomeIgnoreCase(String nome);

    boolean existsByNomeIgnoreCaseAndIdNot(String nome, Long id);
}
