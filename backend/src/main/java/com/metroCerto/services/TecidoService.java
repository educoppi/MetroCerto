package com.metroCerto.services;

import com.metroCerto.dtos.TecidoRequestDTO;
import com.metroCerto.dtos.TecidoResponseDTO;
import com.metroCerto.model.tecido.Tecido;
import com.metroCerto.repositories.TecidoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TecidoService {

    private final TecidoRepository tecidoRepository;

    @Transactional(readOnly = true)
    public List<TecidoResponseDTO> listar() {
        return tecidoRepository.findAllByOrderByIdAsc().stream().map(TecidoResponseDTO::from).toList();
    }

    @Transactional(readOnly = true)
    public TecidoResponseDTO buscarPorId(Long id) {
        return TecidoResponseDTO.from(buscarEntidade(id));
    }

    @Transactional(readOnly = true)
    public byte[] buscarEstampa(Long id) {
        return buscarEntidade(id).getEstampa();
    }

    @Transactional
    public TecidoResponseDTO criar(TecidoRequestDTO dto) {
        if (dto.estampa() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A estampa é obrigatória");
        }
        validar(dto);
        if (tecidoRepository.existsByNomeIgnoreCase(dto.nome().trim())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe um rolo com esse nome");
        }
        Tecido tecido = new Tecido();
        preencher(tecido, dto);
        return TecidoResponseDTO.from(tecidoRepository.save(tecido));
    }

    @Transactional
    public TecidoResponseDTO atualizar(Long id, TecidoRequestDTO dto) {
        Tecido tecido = buscarEntidade(id);
        validar(dto);
        if (tecidoRepository.existsByNomeIgnoreCaseAndIdNot(dto.nome().trim(), id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Já existe um rolo com esse nome");
        }
        preencher(tecido, dto);
        return TecidoResponseDTO.from(tecidoRepository.save(tecido));
    }

    @Transactional
    public void deletar(Long id) {
        tecidoRepository.delete(buscarEntidade(id));
    }

    public Tecido buscarEntidade(Long id) {
        return tecidoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Tecido não encontrado"));
    }

    private void validar(TecidoRequestDTO dto) {
        if (dto.nome() == null || dto.nome().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "O nome é obrigatório");
        }
        if (dto.saldoAtual() == null || dto.saldoAtual().signum() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "saldoAtual deve ser zero ou maior");
        }
        if (dto.estoqueMin() == null || dto.estoqueMin().signum() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "estoqueMin deve ser zero ou maior");
        }
    }

    private void preencher(Tecido tecido, TecidoRequestDTO dto) {
        tecido.setNome(dto.nome().trim());
        tecido.setSaldoAtual(dto.saldoAtual());
        tecido.setEstoqueMin(dto.estoqueMin());
        // No PUT, se a estampa não vier no JSON, mantém a imagem atual
        if (dto.estampa() != null) {
            tecido.setEstampa(dto.estampa());
        }
    }
}
