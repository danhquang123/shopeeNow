package com.ecommerce.project.repositories;

import com.ecommerce.project.model.Cart;
import com.ecommerce.project.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {

    // Tìm giỏ hàng dựa trên email của User (rất hay dùng khi lấy từ JWT/Cookie)
    @Query("SELECT c FROM Cart c WHERE c.user.email = ?1")
    Cart findCartByEmail(String email);

    // Tìm giỏ hàng dựa trên ID của User
    @Query("SELECT c FROM Cart c WHERE c.user.userId = ?1")
    Optional<Cart> findCartByUserId(Long userId);

    @Query("SELECT c FROM Cart c WHERE c.user.email = ?1 AND c.cartId = ?2")
    Cart findCartByEmailAndCartId(String emailId, Long cartId);

    @Query("SELECT c FROM Cart c JOIN FETCH c.cartItems ci JOIN FETCH ci.product p WHERE p.id = ?1")
    List<Cart> findCartsByProductId(Long productId);

    // Tìm giỏ hàng theo đối tượng User (Chuẩn nhất)
    Cart findByUser(User user);

    // Hoặc nếu bạn muốn tìm theo Email thông qua bảng User
    Cart findByUser_Email(String email);


}