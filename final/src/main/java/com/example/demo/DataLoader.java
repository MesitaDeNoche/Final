package com.example.demo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.demo.Modelos.DAO.Usuario.IUsuarioDao;
import com.example.demo.Modelos.Entity.Usuario;

@Component
public class DataLoader implements CommandLineRunner{
    
    @Autowired
    private IUsuarioDao usuarioDao;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args){
        if(usuarioDao.findByUsername("Admin").isEmpty()){
            Usuario admin = new Usuario();
            admin.setUsername("Admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRol(Usuario.Rol.ADMIN);
            usuarioDao.save(admin);
        }
    }

}
