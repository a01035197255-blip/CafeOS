package com.cafeos.task.controller;

import com.cafeos.common.response.ApiResponse;
import com.cafeos.common.security.CustomUserDetails;
import com.cafeos.task.dto.CreateTaskRequest;
import com.cafeos.task.dto.TaskResponse;
import com.cafeos.task.dto.UpdateTaskRequest;
import com.cafeos.task.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    /**
     * 업무 등록
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Void>> createTask(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestBody @Valid CreateTaskRequest request
    ) {

        taskService.createTask(
                userDetails.getUsername(),
                request
        );

        return ResponseEntity.ok(ApiResponse.ok());
    }

    /**
     * 전체 업무 조회 (OWNER, MANAGER)
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getTaskList() {

        return ResponseEntity.ok(
                ApiResponse.ok(
                        taskService.getTaskList()
                )
        );
    }

    /**
     * 내 역할의 업무 조회
     */
    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<TaskResponse>>> getTaskByRole(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {

        return ResponseEntity.ok(
                ApiResponse.ok(
                        taskService.getTaskByRole(
                                userDetails.getUsername()
                        )
                )
        );
    }

    /**
     * 업무 상세조회
     */
    @GetMapping("/{taskId}")
    public ResponseEntity<ApiResponse<TaskResponse>> getTask(
            @PathVariable Long taskId
    ) {

        return ResponseEntity.ok(
                ApiResponse.ok(
                        taskService.getTask(taskId)
                )
        );
    }

    /**
     * 업무 수정
     */
    @PatchMapping("/{taskId}")
    public ResponseEntity<ApiResponse<Void>> updateTask(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long taskId,
            @RequestBody @Valid UpdateTaskRequest request
    ) {

        taskService.updateTask(
                userDetails.getUsername(),
                taskId,
                request
        );

        return ResponseEntity.ok(ApiResponse.ok());
    }

    /**
     * 업무 삭제
     */
    @DeleteMapping("/{taskId}")
    public ResponseEntity<ApiResponse<Void>> deleteTask(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long taskId
    ) {

        taskService.deleteTask(
                userDetails.getUsername(),
                taskId
        );

        return ResponseEntity.ok(ApiResponse.ok());
    }

    /**
     * 업무 완료
     */
    @PatchMapping("/{taskId}/complete")
    public ResponseEntity<ApiResponse<Void>> completeTask(
            @PathVariable Long taskId
    ) {

        taskService.completeTask(taskId);

        return ResponseEntity.ok(ApiResponse.ok());
    }

    /**
     * 업무 완료 취소
     */
    @PatchMapping("/{taskId}/cancel-complete")
    public ResponseEntity<ApiResponse<Void>> cancelComplete(
            @PathVariable Long taskId
    ) {

        taskService.cancelComplete(taskId);

        return ResponseEntity.ok(ApiResponse.ok());
    }
}