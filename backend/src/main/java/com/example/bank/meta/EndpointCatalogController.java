package com.example.bank.meta;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import java.util.Comparator;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/meta")
@RequiredArgsConstructor
public class EndpointCatalogController {

    private final RequestMappingHandlerMapping handlerMapping;

    @GetMapping("/endpoints")
    public List<Map<String, Object>> endpoints() {
        return handlerMapping.getHandlerMethods().entrySet().stream()
                .map(this::mapEndpoint)
                .sorted(Comparator.comparing(e -> e.get("path").toString()))
                .toList();
    }

    private Map<String, Object> mapEndpoint(Map.Entry<RequestMappingInfo, ?> entry) {
        RequestMappingInfo info = entry.getKey();
        String path = info.getPathPatternsCondition() != null
                ? info.getPathPatternsCondition().getPatternValues().toString()
                : "[]";
        String methods = info.getMethodsCondition().toString();

        return Map.of(
                "path", path,
                "methods", methods,
                "handler", entry.getValue().toString()
        );
    }
}
