package com.viveris.api.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.viveris.api.model.User;
import com.viveris.api.repository.UserRepository;

import lombok.Data;

@Data
@Service
public class UserService {

	@Autowired
	private UserRepository userRepository;
	
	public Optional<User> getUser(final Long id) {
		return userRepository.findById(id);
	}
	
	public Iterable<User> getUsers() {
		return userRepository.findAll();
	}
	
	public Optional<User> getUserByPseudo(String pseudo) {
		return userRepository.findFirstByPseudo(pseudo);
	}
	
	public void deleteUser(final Long id) {
		userRepository.deleteById(id);
	}
	
	public User saveUser(User user) {
		User savedUser = userRepository.save(user);
		return savedUser;
	}



}