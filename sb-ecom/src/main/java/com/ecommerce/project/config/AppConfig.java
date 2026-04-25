package com.ecommerce.project.config;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
public class AppConfig {

    @Value("${project.image}")
    private String imagePath;

    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }


}
