package com.example.demo.Services;

import com.example.demo.Modelos.DAO.IUsuarioDao;
import com.example.demo.Modelos.Entity.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.Optional;

import java.util.List;

/**
 * Servicio que Spring Security usa para cargar usuarios durante la
 * autenticación.
 *
 * CAMBIO CRÍTICO: Paquete movido de "Services" a "com.example.demo.Services"
 * para que @SpringBootApplication lo detecte en el component scan.
 */
@Service
public class UsuarioService implements UserDetailsService {

    @Autowired
    private IUsuarioDao usuarioDao;

    /**
     * Carga un usuario por su username para Spring Security.
     * Se construye el UserDetails con el rol prefijado con "ROLE_" para que
     * hasRole("CLIENTE") en la configuración de seguridad funcione correctamente.
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioDao.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));

        return new org.springframework.security.core.userdetails.User(
                usuario.getUsername(),
                usuario.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_" + usuario.getRol().name())));
    }

    public boolean login(String email, String password) {
        Optional<Usuario> user = usuarioDao.findByEmail(email);

        if (user.isPresent()) {
            return user.get().getPassword().equals(password);
        }
        return false;
    }
}
