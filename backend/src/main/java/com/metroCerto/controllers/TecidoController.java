package com.metroCerto.controllers;

import com.metroCerto.dtos.TecidoRequestDTO;
import com.metroCerto.dtos.TecidoResponseDTO;
import com.metroCerto.services.TecidoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.net.URLConnection;
import java.util.List;

@RestController
@RequestMapping("/tecidos")
@RequiredArgsConstructor
public class TecidoController {

    private final TecidoService tecidoService;

    @GetMapping
    public List<TecidoResponseDTO> listar() {
        return tecidoService.listar();
    }

    @GetMapping("/{id}")
    public TecidoResponseDTO buscarPorId(@PathVariable Long id) {
        return tecidoService.buscarPorId(id);
    }

    // Devolve a imagem pura: dá para usar direto em <img src="http://localhost:8080/tecidos/1/estampa">
    @GetMapping("/{id}/estampa")
    public ResponseEntity<byte[]> buscarEstampa(@PathVariable Long id) {
        byte[] estampa = tecidoService.buscarEstampa(id);
        return ResponseEntity.ok()
                .contentType(detectarTipo(estampa))
                .body(estampa);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TecidoResponseDTO criar(@RequestBody TecidoRequestDTO dto) {
        return tecidoService.criar(dto);
    }

    @PutMapping("/{id}")
    public TecidoResponseDTO atualizar(@PathVariable Long id, @RequestBody TecidoRequestDTO dto) {
        return tecidoService.atualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@PathVariable Long id) {
        tecidoService.deletar(id);
    }

    // Descobre se é PNG, JPEG, GIF... pelos primeiros bytes do arquivo
    private MediaType detectarTipo(byte[] imagem) {
        try {
            String tipo = URLConnection.guessContentTypeFromStream(new ByteArrayInputStream(imagem));
            return tipo != null ? MediaType.parseMediaType(tipo) : MediaType.APPLICATION_OCTET_STREAM;
        } catch (IOException e) {
            return MediaType.APPLICATION_OCTET_STREAM;
        }
    }
}
