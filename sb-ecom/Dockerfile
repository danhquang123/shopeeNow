# =========================
# GIAI ĐOẠN 1: BUILD PROJECT
# =========================
# Sử dụng Maven với JDK 21 (Đúng phiên bản dự án của bạn)
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# 1. Copy file pom.xml vào trước để tải thư viện
COPY pom.xml .

# 2. Sử dụng lệnh 'mvn' thay vì './mvnw' để tránh lỗi định dạng file trên Windows
RUN mvn dependency:go-offline -B

# 3. Copy mã nguồn vào
COPY src ./src

# 4. Build dự án tạo file JAR
RUN mvn clean package -DskipTests

# =========================
# GIAI ĐOẠN 2: RUN APP
# =========================
# Sử dụng JRE 21 nhẹ hơn để chạy ứng dụng
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# 5. Copy file JAR từ giai đoạn build sang (Đúng tên dự án của bạn)
# Mình đổi tên thành app.jar cho ngắn gọn và dễ quản lý
COPY --from=build /app/target/sb-ecom-0.0.1-SNAPSHOT.jar app.jar

# Mở port 8080
EXPOSE 8080

# 6. Lệnh chạy ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"]