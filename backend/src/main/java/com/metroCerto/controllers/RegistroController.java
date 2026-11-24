package com.metroCerto.controllers;

import com.metroCerto.dtos.HardwareRequestDTO;
import com.metroCerto.dtos.RegistroRequestDTO;
import com.metroCerto.dtos.RegistroResponseDTO;
import com.metroCerto.services.RegistroService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/registros")
@RequiredArgsConstructor
public class RegistroController {

    private final RegistroService registroService;

    // GET /registros                              -> todos (mais recentes primeiro)
    // GET /registros?de=2026-11-01&ate=2026-11-30  -> só os do período
    @GetMapping
    public List<RegistroResponseDTO> listar(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate de,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ate) {
        return registroService.listar(de, ate);
    }

    @GetMapping("/{id}")
    public RegistroResponseDTO buscarPorId(@PathVariable Long id) {
        return registroService.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RegistroResponseDTO criar(@RequestBody RegistroRequestDTO dto) {
        return registroService.criar(dto);
    }

    // Usado pelo hardware: recebe { "tecido": 1.25 } e registra a retirada
    @PostMapping("/hardware")
    @ResponseStatus(HttpStatus.CREATED)
    public RegistroResponseDTO criarPeloHardware(@RequestBody HardwareRequestDTO dto) {
        return registroService.criarPeloHardware(dto);
    }

    @PutMapping("/{id}")
    public RegistroResponseDTO atualizar(@PathVariable Long id, @RequestBody RegistroRequestDTO dto) {
        return registroService.atualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@PathVariable Long id) {
        registroService.deletar(id);
    }
}
