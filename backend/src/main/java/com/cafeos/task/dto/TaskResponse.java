package com.cafeos.task.dto;

import com.cafeos.task.entity.Task;
import com.cafeos.user.entity.UserRole;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class TaskResponse {

    private Long id;

    private String title;

    private String description;

    private UserRole role;

    private Boolean completed;

    public static TaskResponse from(Task task){

        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .role(task.getRole())
                .completed(task.getCompleted())
                .build();
    }
}