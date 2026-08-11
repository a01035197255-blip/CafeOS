package com.cafeos.menu.repository;

import com.cafeos.menu.entity.Menu;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MenuRepository extends JpaRepository<Menu, Long> {

    boolean existsByName(String name);

    Optional<Menu> findByName(String name);

    List<Menu> findAllByOrderByIdAsc();
}