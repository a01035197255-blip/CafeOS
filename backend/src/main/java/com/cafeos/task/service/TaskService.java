package com.cafeos.task.service;

import com.cafeos.common.exception.BusinessException;
import com.cafeos.common.exception.ErrorCode;
import com.cafeos.task.dto.CreateTaskRequest;
import com.cafeos.task.dto.TaskResponse;
import com.cafeos.task.dto.UpdateTaskRequest;
import com.cafeos.task.entity.Task;
import com.cafeos.task.repository.TaskRepository;
import com.cafeos.user.entity.User;
import com.cafeos.user.entity.UserRole;
import com.cafeos.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    /**
     * 업무 등록
     */
    @Transactional
    public void createTask(String email,
                           CreateTaskRequest request){

        User owner = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.USER_NOT_FOUND));

        if(owner.getRole() != UserRole.OWNER){
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }

        Task task = Task.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .role(request.getRole())
                .build();

        taskRepository.save(task);
    }

    /**
     * 업무 목록 조회
     */
    public List<TaskResponse> getTaskList(){

        return taskRepository.findAll()
                .stream()
                .map(TaskResponse::from)
                .toList();
    }

    /**
     * 역할별 업무 조회
     */
    public List<TaskResponse> getTaskByRole(String email){

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.USER_NOT_FOUND));

        return taskRepository.findByRole(user.getRole())
                .stream()
                .map(TaskResponse::from)
                .toList();
    }

    /**
     * 업무 상세조회
     */
    public TaskResponse getTask(Long taskId){

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.TASK_NOT_FOUND));

        return TaskResponse.from(task);
    }

    /**
     * 업무 수정
     */
    @Transactional
    public void updateTask(String email,
                           Long taskId,
                           UpdateTaskRequest request){

        User owner = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.USER_NOT_FOUND));

        if(owner.getRole() != UserRole.OWNER){
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.TASK_NOT_FOUND));

        task.update(
                request.getTitle(),
                request.getDescription(),
                request.getRole()
        );
    }

    /**
     * 업무 삭제
     */
    @Transactional
    public void deleteTask(String email,
                           Long taskId){

        User owner = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.USER_NOT_FOUND));

        if(owner.getRole() != UserRole.OWNER){
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.TASK_NOT_FOUND));

        taskRepository.delete(task);
    }

    /**
     * 업무 완료
     */
    @Transactional
    public void completeTask(Long taskId){

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.TASK_NOT_FOUND));

        task.complete();
    }

    /**
     * 업무 완료 취소
     */
    @Transactional
    public void cancelComplete(Long taskId){

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.TASK_NOT_FOUND));

        task.cancelComplete();
    }
}