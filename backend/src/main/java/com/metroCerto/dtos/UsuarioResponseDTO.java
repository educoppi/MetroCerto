package com.metroCerto.dtos;

import com.metroCerto.model.usuario.Usuario;

// Não expõe a senha
public record UsuarioResponseDTO(Long id, String nome) {

    public static UsuarioResponseDTO from(Usuario usuario) {
        return new UsuarioResponseDTO(usuario.getId(), usuario.getNome());
    }
}
