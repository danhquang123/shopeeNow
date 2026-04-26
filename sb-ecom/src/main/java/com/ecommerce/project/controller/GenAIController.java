package com.ecommerce.project.controller;


import com.ecommerce.project.service.OpenChat.ChatMemoryService;
import com.ecommerce.project.service.OpenChat.FashionAssistantService;
import com.ecommerce.project.service.OpenChat.ImageService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.ai.image.ImageResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;
@RequestMapping("/openai")
@RestController
public class GenAIController {


    private final ImageService imageService;
    private final ChatMemoryService chatMemoryService;
    private final FashionAssistantService fashionAssistantService;

    public GenAIController( ImageService imageService,FashionAssistantService fashionAssistantService,
                           ChatMemoryService chatMemoryService) {

        this.imageService = imageService;
        this.fashionAssistantService=fashionAssistantService;
        this.chatMemoryService = chatMemoryService;
    }

//    @GetMapping("ask-ai")
//    public String getResponse(@RequestParam String prompt) {
//        return chatService.getResponseOptions(prompt);
//    }
//
//    @GetMapping("ask-ai-options")
//    public String getResponseOptions(@RequestParam String prompt) {
//        return chatService.getResponseOptions(prompt);
//    }

    /*
     * @GetMapping("generate-image")
     * public void generateImages(HttpServletResponse response, @RequestParam String
     * prompt) throws IOException {
     * ImageResponse imageResponse = imageService.generateImage(prompt);
     * String imageUrl = imageResponse.getResult().getOutput().getUrl();
     * response.sendRedirect(imageUrl);
     * }
     */

    @GetMapping("/generate-image")
    public List<String> generateImages(HttpServletResponse response,
                                       @RequestParam String prompt,

                                       @RequestParam(defaultValue = "1") int n,
                                       @RequestParam(defaultValue = "1024") int width,
                                       @RequestParam(defaultValue = "1024") int height) throws IOException {
        ImageResponse imageResponse = imageService.generateImage(prompt, n, width, height);

        // Streams to get urls from ImageResponse
        List<String> imageUrls = imageResponse.getResults().stream()
                .map(result -> result.getOutput().getUrl())
                .toList();

        return imageUrls;
    }



    @GetMapping("/chat")
    public String chat(@RequestParam String prompt) {
        return chatMemoryService.chat(prompt);
    }

    @GetMapping("/fashion-advice")
    public String fashionAdvice(
            @RequestParam String style,
            @RequestParam(defaultValue = "unisex") String gender,
            @RequestParam(defaultValue = "casual") String occasion,
            @RequestParam(defaultValue = "summer") String season
    ) {
        return fashionAssistantService.suggestOutfit(
                style,
                gender,
                occasion,
                season
        );
    }

}
