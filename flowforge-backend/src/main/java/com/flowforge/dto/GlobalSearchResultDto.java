package com.flowforge.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 * Global Search Result DTO.
 * 
 * WHY THIS CLASS EXISTS:
 * Encapsulates global search results categorized by entity type (Projects,
 * Tasks, Messages, Comments, Files, Users).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GlobalSearchResultDto {
    private String query;
    private int totalMatches;

    @Builder.Default
    private List<ProjectDto> projects = new ArrayList<>();

    @Builder.Default
    private List<TaskDto> tasks = new ArrayList<>();

    @Builder.Default
    private List<ChatMessageDto> chatMessages = new ArrayList<>();

    @Builder.Default
    private List<UnifiedCommentDto> comments = new ArrayList<>();

    @Builder.Default
    private List<FileAttachmentDto> files = new ArrayList<>();

    @Builder.Default
    private List<UserDto> users = new ArrayList<>();
}
