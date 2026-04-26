package com.ecommerce.project.service.OpenChat;

import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class FashionAssistantService {

    private final ChatModel chatModel;

    public FashionAssistantService(ChatModel chatModel) {
        this.chatModel = chatModel;
    }

    public String suggestOutfit(String style,
                                String gender,
                                String occasion,
                                String season) {

        var template = """
        Tôi đang xây dựng website bán quần áo và phụ kiện.

        Hãy tư vấn outfit phù hợp với:

        - Phong cách: {style}
        - Giới tính: {gender}
        - Dịp sử dụng: {occasion}
        - Mùa: {season}

        Hãy trả về:

        - Tên outfit
        - Quần áo nên mặc
        - Phụ kiện phù hợp
        - Màu sắc nên phối
        - Lý do outfit phù hợp

        Trả lời bằng tiếng Việt.
        """;

        PromptTemplate promptTemplate = new PromptTemplate(template);

        Map<String, Object> params = Map.of(
                "style", style,
                "gender", gender,
                "occasion", occasion,
                "season", season
        );

        Prompt prompt = promptTemplate.create(params);

        return chatModel.call(prompt)
                .getResult()
                .getOutput()
                .getText();
    }
}
