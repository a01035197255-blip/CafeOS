package com.cafeos.task.repository;

import com.cafeos.task.entity.Task;
import com.cafeos.user.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByRole(UserRole role);
}