package com.metroCerto.services;

import com.metroCerto.dtos.HardwareRequestDTO;
import com.metroCerto.dtos.RegistroRequestDTO;
import com.metroCerto.dtos.RegistroResponseDTO;
import com.metroCerto.model.registro.Registro;
import com.metroCerto.model.tecido.Tecido;
import com.metroCerto.repositories.RegistroRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

// Registro = retirada de tecido. Criar/alterar/excluir um registro ajusta o saldo do tecido.
@Service
@RequiredArgsConstructor
public class RegistroService {

    private static final Long ID_USUARIO_HARDWARE = 1L;
    private static final Long ID_TECIDO_HARDWARE = 1L;

    private final RegistroRepository registroRepository;
    private final UsuarioService usuarioService;
    private final TecidoService tecidoService;

    @Transactional(readOnly = true)
    public List<RegistroResponseDTO> listar() {
        return registroRepository.findAll().stream().map(RegistroResponseDTO::from).toList();
    }

    @Transactional(readOnly = true)
    public RegistroResponseDTO buscarPorId(Long id) {
        return RegistroResponseDTO.from(buscarEntidade(id));
    }

    @Transactional
    public RegistroResponseDTO criar(RegistroRequestDTO dto) {
        validarMetragem(dto.metroMovimentado());

        Registro registro = new Registro();
        registro.setUsuario(usuarioService.buscarEntidade(dto.idUsuario()));
        registro.setTecido(tecidoService.buscarEntidade(dto.idTecido()));
        registro.setMetroMovimentado(dto.metroMovimentado());

        retirar(registro.getTecido(), dto.metroMovimentado());
        return RegistroResponseDTO.from(registroRepository.save(registro));
    }

    // O hardware atual não identifica usuário nem tecido: usa os ids pré-definidos
    @Transactional
    public RegistroResponseDTO criarPeloHardware(HardwareRequestDTO dto) {
        return criar(new RegistroRequestDTO(ID_USUARIO_HARDWARE, ID_TECIDO_HARDWARE, dto.tecido()));
    }

    @Transactional
    public RegistroResponseDTO atualizar(Long id, RegistroRequestDTO dto) {
        validarMetragem(dto.metroMovimentado());
        Registro registro = buscarEntidade(id);

        // Desfaz a retirada antiga e aplica a nova (o tecido pode ter mudado)
        devolver(registro.getTecido(), registro.getMetroMovimentado());

        registro.setUsuario(usuarioService.buscarEntidade(dto.idUsuario()));
        registro.setTecido(tecidoService.buscarEntidade(dto.idTecido()));
        registro.setMetroMovimentado(dto.metroMovimentado());

        retirar(registro.getTecido(), dto.metroMovimentado());
        return RegistroResponseDTO.from(registroRepository.save(registro));
    }

    @Transactional
    public void deletar(Long id) {
        Registro registro = buscarEntidade(id);
        devolver(registro.getTecido(), registro.getMetroMovimentado());
        registroRepository.delete(registro);
    }

    private Registro buscarEntidade(Long id) {
        return registroRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Registro não encontrado"));
    }

    private void validarMetragem(BigDecimal metros) {
        if (metros == null || metros.signum() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "metroMovimentado deve ser maior que zero");
        }
    }

    // O tecido é uma entidade gerenciada: a alteração do saldo é salva ao fim da transação
    private void retirar(Tecido tecido, BigDecimal metros) {
        tecido.setSaldoAtual(tecido.getSaldoAtual().subtract(metros));
    }

    private void devolver(Tecido tecido, BigDecimal metros) {
        tecido.setSaldoAtual(tecido.getSaldoAtual().add(metros));
    }
}
