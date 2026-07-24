package com.flowforge.service;

import com.flowforge.dto.GlobalSearchResultDto;

/**
 * Global Search Service Interface.
 * 
 * WHY THIS INTERFACE EXISTS:
 * Defines workspace-wide search across Projects, Tasks, Messages, Comments,
 * Files, and Users.
 */
public interface GlobalSearchService {

    GlobalSearchResultDto searchGlobal(String query);
}
