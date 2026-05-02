package Services;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.DTO.RegistroDTO;
import com.example.demo.Modelos.DAO.Cliente.IClienteDao;
import com.example.demo.Modelos.DAO.Usuario.IUsuarioDao;
import com.example.demo.Modelos.Entity.Cliente;
import com.example.demo.Modelos.Entity.Usuario;
import com.example.demo.Modelos.Entity.Usuario.Rol;

public class RegistroService {

    @Autowired
    private IUsuarioDao usuarioDao;

    @Autowired
    private IClienteDao clienteDao;

    @Autowired
    private PasswordEncoder passwordEncoder;

   @Transactional
public void registrarCliente(RegistroDTO dto) {

    // Verificar que el username no exista
    if (usuarioDao.findByUsername(dto.getUsername()).isPresent()) {
        throw new RuntimeException("El username ya está en uso");
    }

    // Crear Persona base

    // Crear Cliente
    Cliente cliente = new Cliente();
    //cliente.setCedula(dto.getId());
    cliente.setNombre(dto.getNombre());
    cliente.setApellido(dto.getApellido());
    cliente.setEmail(dto.getEmail());
    cliente.setTelefono(dto.getTelefono());
    cliente.setFechaNacimiento(dto.getFechaNacimiento());
    cliente.setPais(dto.getPais());
    cliente.setFechaPrimContacto(LocalDate.now()); // ← se genera aquí, no viene del DTO
    clienteDao.save(cliente);

    // Crear Usuario vinculado
    Usuario usuario = new Usuario();
    usuario.setUsername(dto.getUsername());
    usuario.setPassword(passwordEncoder.encode(dto.getPassword()));
    usuario.setRol(Rol.CLIENTE);
    usuario.setCreatedAt(LocalDate.now());
    usuarioDao.save(usuario);
}
}
