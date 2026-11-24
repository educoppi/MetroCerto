package com.metroCerto.repositories;

import com.metroCerto.model.tecido.Tecido;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TecidoRepository extends JpaRepository<Tecido, Long> {
}
