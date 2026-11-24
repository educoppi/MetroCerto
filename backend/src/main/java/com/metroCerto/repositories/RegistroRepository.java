package com.metroCerto.repositories;

import com.metroCerto.model.registro.Registro;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RegistroRepository extends JpaRepository<Registro, Long> {
}
