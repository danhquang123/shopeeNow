package com.ecommerce.project.service.OpenChat;

import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ChatMemoryService {

    private final ChatModel chatModel;
    private final int MAX_HISTORY = 20;

    private final List<Message> conversationHistory = new ArrayList<>();

    public ChatMemoryService(ChatModel chatModel) {
        this.chatModel = chatModel;
    }

    public String chat(String userInput) {

        conversationHistory.add(new UserMessage(userInput));

        if(conversationHistory.size() > MAX_HISTORY){
            conversationHistory.remove(0);
        }

        Prompt prompt = new Prompt(conversationHistory);

        String response = chatModel.call(prompt)
                .getResult()
                .getOutput()
                .getText();

        conversationHistory.add(new AssistantMessage(response));

        return response;
    }
}