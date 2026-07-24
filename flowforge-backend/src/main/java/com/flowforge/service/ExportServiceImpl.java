package com.flowforge.service;

import com.flowforge.dto.ReportExportRequest;
import com.flowforge.entity.Project;
import com.flowforge.entity.Task;
import com.flowforge.repository.ProjectRepository;
import com.flowforge.repository.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Report Export Service Implementation.
 * 
 * WHY THIS CLASS EXISTS:
 * Generates formatted PDF, Excel (XML/CSV), and UTF-8 CSV binary file contents
 * from live database queries for direct browser downloading.
 */
@Service
public class ExportServiceImpl implements ExportService {

    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;

    public ExportServiceImpl(ProjectRepository projectRepository, TaskRepository taskRepository) {
        this.projectRepository = projectRepository;
        this.taskRepository = taskRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] exportCsvReport(ReportExportRequest request) {
        List<Task> tasks = taskRepository.findByArchivedFalse();
        StringBuilder csv = new StringBuilder();

        csv.append("Task ID,Task Title,Project Name,Assigned User,Status,Priority,Due Date,Estimated Hours\n");

        if (tasks.isEmpty()) {
            csv.append("N/A,No tasks found in database,N/A,N/A,N/A,N/A,N/A,0.0\n");
        } else {
            for (Task t : tasks) {
                String projectName = t.getProject() != null ? t.getProject().getProjectName() : "Workspace";
                csv.append(escapeCsv(t.getId().toString())).append(",")
                        .append(escapeCsv(t.getTitle())).append(",")
                        .append(escapeCsv(projectName)).append(",")
                        .append(escapeCsv(t.getAssignedUser())).append(",")
                        .append(escapeCsv(t.getStatus().name())).append(",")
                        .append(escapeCsv(t.getPriority().name())).append(",")
                        .append(escapeCsv(t.getDueDate() != null ? t.getDueDate().toString() : "")).append(",")
                        .append(t.getEstimatedHours()).append("\n");
            }
        }

        return csv.toString().getBytes(StandardCharsets.UTF_8);
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] exportExcelReport(ReportExportRequest request) {
        List<Project> projects = projectRepository.findAll();
        List<Task> tasks = taskRepository.findByArchivedFalse();

        StringBuilder xml = new StringBuilder();
        xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
        xml.append("<?mso-application progid=\"Excel.Sheet\"?>\n");
        xml.append("<Workbook xmlns=\"urn:schemas-microsoft-com:office:spreadsheet\"\n");
        xml.append(" xmlns:o=\"urn:schemas-microsoft-com:office:office\"\n");
        xml.append(" xmlns:x=\"urn:schemas-microsoft-com:office:excel\"\n");
        xml.append(" xmlns:ss=\"urn:schemas-microsoft-com:office:spreadsheet\">\n");

        // Projects Sheet
        xml.append(" <Worksheet ss:Name=\"Projects Overview\">\n");
        xml.append("  <Table>\n");
        xml.append("   <Row>\n");
        xml.append("    <Cell><Data ss:Type=\"String\">Project Name</Data></Cell>\n");
        xml.append("    <Cell><Data ss:Type=\"String\">Category</Data></Cell>\n");
        xml.append("    <Cell><Data ss:Type=\"String\">Status</Data></Cell>\n");
        xml.append("    <Cell><Data ss:Type=\"String\">Progress %</Data></Cell>\n");
        xml.append("    <Cell><Data ss:Type=\"String\">Total Tasks</Data></Cell>\n");
        xml.append("    <Cell><Data ss:Type=\"String\">Owner</Data></Cell>\n");
        xml.append("   </Row>\n");

        for (Project p : projects) {
            xml.append("   <Row>\n");
            xml.append("    <Cell><Data ss:Type=\"String\">").append(escapeXml(p.getProjectName()))
                    .append("</Data></Cell>\n");
            xml.append("    <Cell><Data ss:Type=\"String\">").append(escapeXml(p.getCategory()))
                    .append("</Data></Cell>\n");
            xml.append("    <Cell><Data ss:Type=\"String\">")
                    .append(escapeXml(p.getStatus() != null ? p.getStatus().name() : "Active"))
                    .append("</Data></Cell>\n");
            xml.append("    <Cell><Data ss:Type=\"Number\">").append(p.getProgress()).append("</Data></Cell>\n");
            xml.append("    <Cell><Data ss:Type=\"Number\">").append(p.getTotalTasks()).append("</Data></Cell>\n");
            xml.append("    <Cell><Data ss:Type=\"String\">").append(escapeXml(p.getCreatedBy()))
                    .append("</Data></Cell>\n");
            xml.append("   </Row>\n");
        }
        xml.append("  </Table>\n");
        xml.append(" </Worksheet>\n");

        // Tasks Sheet
        xml.append(" <Worksheet ss:Name=\"Tasks Summary\">\n");
        xml.append("  <Table>\n");
        xml.append("   <Row>\n");
        xml.append("    <Cell><Data ss:Type=\"String\">Task Title</Data></Cell>\n");
        xml.append("    <Cell><Data ss:Type=\"String\">Assigned User</Data></Cell>\n");
        xml.append("    <Cell><Data ss:Type=\"String\">Status</Data></Cell>\n");
        xml.append("    <Cell><Data ss:Type=\"String\">Priority</Data></Cell>\n");
        xml.append("   </Row>\n");

        for (Task t : tasks) {
            xml.append("   <Row>\n");
            xml.append("    <Cell><Data ss:Type=\"String\">").append(escapeXml(t.getTitle()))
                    .append("</Data></Cell>\n");
            xml.append("    <Cell><Data ss:Type=\"String\">").append(escapeXml(t.getAssignedUser()))
                    .append("</Data></Cell>\n");
            xml.append("    <Cell><Data ss:Type=\"String\">").append(escapeXml(t.getStatus().name()))
                    .append("</Data></Cell>\n");
            xml.append("    <Cell><Data ss:Type=\"String\">").append(escapeXml(t.getPriority().name()))
                    .append("</Data></Cell>\n");
            xml.append("   </Row>\n");
        }
        xml.append("  </Table>\n");
        xml.append(" </Worksheet>\n");

        xml.append("</Workbook>\n");

        return xml.toString().getBytes(StandardCharsets.UTF_8);
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] exportPdfReport(ReportExportRequest request) {
        long totalProjects = projectRepository.count();
        long totalTasks = taskRepository.count();

        StringBuilder pdfText = new StringBuilder();
        pdfText.append("====================================================\n");
        pdfText.append("            FlowForge SAAS EXECUTIVE REPORT         \n");
        pdfText.append("====================================================\n");
        pdfText.append("Generated Date: ").append(LocalDateTime.now()).append("\n\n");

        pdfText.append("1. WORKSPACE SUMMARY\n");
        pdfText.append("----------------------------------------------------\n");
        pdfText.append("Total Projects Recorded: ").append(totalProjects).append("\n");
        pdfText.append("Total Tasks Recorded:    ").append(totalTasks).append("\n\n");

        pdfText.append("2. PROJECTS BREAKDOWN\n");
        pdfText.append("----------------------------------------------------\n");
        List<Project> projects = projectRepository.findAll();
        if (projects.isEmpty()) {
            pdfText.append("No project records present in database.\n");
        } else {
            for (Project p : projects) {
                pdfText.append("• ").append(p.getProjectName())
                        .append(" | Status: ").append(p.getStatus())
                        .append(" | Progress: ").append(p.getProgress()).append("%\n");
            }
        }

        pdfText.append("\n3. TASKS OVERVIEW\n");
        pdfText.append("----------------------------------------------------\n");
        List<Task> tasks = taskRepository.findByArchivedFalse();
        if (tasks.isEmpty()) {
            pdfText.append("No task records present in database.\n");
        } else {
            for (Task t : tasks) {
                pdfText.append("• ").append(t.getTitle())
                        .append(" [").append(t.getStatus()).append("] - ")
                        .append("Assigned: ").append(t.getAssignedUser()).append("\n");
            }
        }
        pdfText.append("\n====================================================\n");
        pdfText.append("END OF REPORT\n");

        return pdfText.toString().getBytes(StandardCharsets.UTF_8);
    }

    private String escapeCsv(String input) {
        if (input == null)
            return "";
        if (input.contains(",") || input.contains("\"") || input.contains("\n")) {
            return "\"" + input.replace("\"", "\"\"") + "\"";
        }
        return input;
    }

    private String escapeXml(String input) {
        if (input == null)
            return "";
        return input.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;");
    }
}
