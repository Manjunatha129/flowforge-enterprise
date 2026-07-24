package com.flowforge.controller;

import com.flowforge.dto.ApiResponse;
import com.flowforge.dto.GlobalSearchResultDto;
import com.flowforge.service.GlobalSearchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Global Search REST Controller.
 * 
 * WHY THIS CLASS EXISTS:
 * Exposes workspace-wide search endpoint
 * (/api/v1/search/global?query={keyword}) for Command Palette (⌘K) matching.
 */
@RestController
@RequestMapping("/api/v1/search")
public class GlobalSearchController {

    private final GlobalSearchService searchService;

    public GlobalSearchController(GlobalSearchService searchService) {
        this.searchService = searchService;
    }

    /**
     * GET /api/v1/search/global?query={keyword} - Execute Global Workspace Search
     */
    @GetMapping("/global")
    public ResponseEntity<ApiResponse<GlobalSearchResultDto>> searchGlobal(@RequestParam("query") String query) {
        GlobalSearchResultDto results = searchService.searchGlobal(query);
        return ResponseEntity.ok(ApiResponse.success("Search results retrieved successfully", results));
    }
}
