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
        return tecidoRepository.findAll().stream().map(TecidoResponseDTO::from).toList();
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
        Tecido tecido = new Tecido();
        preencher(tecido, dto);
        return TecidoResponseDTO.from(tecidoRepository.save(tecido));
    }

    @Transactional
    public TecidoResponseDTO atualizar(Long id, TecidoRequestDTO dto) {
        Tecido tecido = buscarEntidade(id);
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

    private void preencher(Tecido tecido, TecidoRequestDTO dto) {
        tecido.setNome(dto.nome());
        tecido.setSaldoAtual(dto.saldoAtual());
        tecido.setEstoqueMin(dto.estoqueMin());
        // No PUT, se a estampa não vier no JSON, mantém a imagem atual
        if (dto.estampa() != null) {
            tecido.setEstampa(dto.estampa());
        }
    }
}
