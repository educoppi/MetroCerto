package com.metroCerto.repositories;

import com.metroCerto.model.registro.Registro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

// As consultas já trazem tecido e usuário no mesmo SELECT (join fetch),
// evitando uma consulta extra por registro ao montar o RegistroResponseDTO.
public interface RegistroRepository extends JpaRepository<Registro, Long> {

    @Query("""
            select r from Registro r
            join fetch r.tecido
            join fetch r.usuario
            order by r.dataHora desc
            """)
    List<Registro> listarTodos();

    @Query("""
            select r from Registro r
            join fetch r.tecido
            join fetch r.usuario
            where r.dataHora >= :de and r.dataHora < :ate
            order by r.dataHora desc
            """)
    List<Registro> listarPorPeriodo(@Param("de") LocalDateTime de, @Param("ate") LocalDateTime ate);

    @Query("""
            select r from Registro r
            join fetch r.tecido t
            join fetch r.usuario
            where t.id = :idTecido
            order by r.dataHora desc
            """)
    List<Registro> listarPorTecido(@Param("idTecido") Long idTecido);
}
