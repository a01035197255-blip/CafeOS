package com.cafeos.menu.service;

import com.cafeos.common.exception.BusinessException;
import com.cafeos.common.exception.ErrorCode;
import com.cafeos.menu.dto.CreateMenuRequest;
import com.cafeos.menu.dto.UpdateMenuRequest;
import com.cafeos.menu.dto.MenuResponse;
import com.cafeos.menu.entity.Menu;
import com.cafeos.menu.repository.MenuRepository;
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
public class MenuService {

    private final MenuRepository menuRepository;
    private final UserRepository userRepository;

    /**
     * 메뉴 등록
     */
    @Transactional
    public MenuResponse createMenu(String email,
                           CreateMenuRequest request) {

        User owner = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (owner.getRole() != UserRole.OWNER) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }

        if (menuRepository.existsByName(request.getName())) {
            throw new BusinessException(ErrorCode.MENU_ALREADY_EXISTS);
        }

        Menu menu = Menu.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .category(request.getCategory())
                .sale(true)
                .season(request.getSeason())
                .imageUrl(request.getImageUrl())
                .build();

        Menu savedMenu = menuRepository.save(menu);

        return MenuResponse.from(savedMenu);
    }

    /**
     * 메뉴 목록
     */
    public List<MenuResponse> getMenuList() {

        return menuRepository.findAllByOrderByIdAsc()
                .stream()
                .map(MenuResponse::from)
                .toList();
    }

    /**
     * 메뉴 상세조회
     */
    public MenuResponse getMenu(Long menuId) {

        Menu menu = menuRepository.findById(menuId)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.MENU_NOT_FOUND));

        return MenuResponse.from(menu);
    }

    /**
     * 메뉴 수정
     */
    @Transactional
    public void updateMenu(String email,
                           Long menuId,
                           UpdateMenuRequest request) {

        User owner = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (owner.getRole() != UserRole.OWNER) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }

        Menu menu = menuRepository.findById(menuId)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.MENU_NOT_FOUND));

        menu.update(
                request.getName(),
                request.getDescription(),
                request.getPrice(),
                request.getCategory(),
                request.getSale(),
                request.getSeason(),
                request.getImageUrl()
        );
    }

    /**
     * 메뉴 삭제
     */
    @Transactional
    public void deleteMenu(String email,
                           Long menuId) {

        User owner = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (owner.getRole() != UserRole.OWNER) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }

        Menu menu = menuRepository.findById(menuId)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.MENU_NOT_FOUND));

        menuRepository.delete(menu);
    }

    /**
     * 판매 여부 변경
     */
    @Transactional
    public void changeSale(String email,
                           Long menuId,
                           Boolean sale) {

        User owner = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.USER_NOT_FOUND));

        if (owner.getRole() != UserRole.OWNER) {
            throw new BusinessException(ErrorCode.ACCESS_DENIED);
        }

        Menu menu = menuRepository.findById(menuId)
                .orElseThrow(() ->
                        new BusinessException(ErrorCode.MENU_NOT_FOUND));

        menu.changeSale(sale);
    }
}