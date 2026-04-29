# =========================
# GIAI ĐOẠN 1: BUILD PROJECT
# =========================
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Copy pom.xml và tải thư viện trước để tận dụng cache của Docker
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy mã nguồn và đóng gói
COPY src ./src
RUN mvn clean package -DskipTests

# =========================
# GIAI ĐOẠN 2: RUN APP
# =========================
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Copy file JAR đã build từ giai đoạn 1 sang
# File này đã được tạo ra trong thư mục target sau khi bạn chạy ./mvnw package
COPY --from=build /app/target/sb-ecom-0.0.1-SNAPSHOT.jar app.jar

# Mở port 8080 cho ứng dụng
EXPOSE 8080

# Lệnh khởi chạy ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"]