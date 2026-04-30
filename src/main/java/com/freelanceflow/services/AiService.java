package com.freelanceflow.services;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.freelanceflow.dto.ChatMessageDTO;
import com.freelanceflow.entity.Client;
import com.freelanceflow.entity.Invoice;
import com.freelanceflow.entity.Project;
import com.freelanceflow.entity.User;
import com.freelanceflow.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class AiService {

    @Autowired
    ProjectRepository projectRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    ClientRepository clientRepository;

    @Autowired
    InvoiceRepository invoiceRepository;

    @Autowired
    TimeLogRepository timeLogRepository;





    @Value("${groq.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String GROQ_URL =
            "https://api.groq.com/openai/v1/chat/completions";

    // ── Generate project description ─────────────────────────
    public String generateProjectDescription(String projectName) {
        String prompt = "Write a concise, professional project description "
                + "for a freelance project called: \"" + projectName + "\". "
                + "Keep it to 2-3 small sentences."
                + "Do not use bullet points. Plain paragraph only.";

        return callGroq(prompt);
    }




    // ── Core Groq API caller ──────────────────────────────────
    private String callGroq(String userMessage) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            Map<String, Object> message = Map.of(
                    "role", "user",
                    "content", userMessage
            );

            Map<String, Object> body = Map.of(
                    "model", "llama-3.1-8b-instant",
                    "messages", List.of(message),
                    "max_tokens", 500,
                    "temperature", 0.7
            );

            HttpEntity<Map<String, Object>> entity =
                    new HttpEntity<>(body, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    GROQ_URL,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            JsonNode root = objectMapper.readTree(response.getBody());
            return root
                    .path("choices")
                    .get(0)
                    .path("message")
                    .path("content")
                    .asText();

        } catch (Exception e) {
            throw new RuntimeException(
                    "AI API call failed: " + e.getMessage()
            );
        }
    }



    // ── Chat with context ─────────────────────────────────────────
    public String chat(
            User user ,
            String userMessage,
            List<ChatMessageDTO> history) {

        // build context from real data
        String context = buildUserContext(user);

        // build messages array for Groq
        // structure: system context + history + new message
        List<Map<String, Object>> messages = new ArrayList<>();

        // system message with all user data
        messages.add(Map.of(
                "role",    "system",
                "content", context
        ));

        // add conversation history (last 6 messages max
        // to stay within token limits)
        if (history != null && !history.isEmpty()) {
            int start = Math.max(0, history.size() - 6);
            for (int i = start; i < history.size(); i++) {
                ChatMessageDTO msg = history.get(i);
                messages.add(Map.of(
                        "role",    msg.getRole(),
                        "content", msg.getContent()
                ));
            }
        }

        // add the new user message
        messages.add(Map.of(
                "role",    "user",
                "content", userMessage
        ));

        return callGroqWithMessages(messages);
    }

    // ── Groq caller that accepts full messages array ──────────────
    private String callGroqWithMessages(
            List<Map<String, Object>> messages) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            Map<String, Object> body = Map.of(
                    "model",       "llama-3.1-8b-instant",
                    "messages",    messages,
                    "max_tokens",  600,
                    "temperature", 0.5
            );

            HttpEntity<Map<String, Object>> entity =
                    new HttpEntity<>(body, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    GROQ_URL,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            JsonNode root = objectMapper
                    .readTree(response.getBody());

            return root
                    .path("choices")
                    .get(0)
                    .path("message")
                    .path("content")
                    .asText();

        } catch (Exception e) {
            throw new RuntimeException(
                    "Chat API call failed: " + e.getMessage()
            );
        }
    }


    // ── Build context from user's real data ──────────────────────
    private String buildUserContext(User user) {

        StringBuilder ctx = new StringBuilder();



        ctx.append("You are a helpful business assistant for a freelancer ")
                .append("using the FreelanceFlow app. ")
                .append("Answer questions using ONLY the data provided below. ")
                .append("Be concise, friendly, and specific. ")
                .append("Format currency as Rs. X,XXX. ")
                .append("If asked something not in the data, say you don't have ")
                .append("that information.\n\n");

        ctx.append("=== FREELANCER DATA ===\n\n");

        // ── Projects ──────────────────────────────────────────
        List<Project> projects = projectRepository.findAllByUser(user);
        ctx.append("PROJECTS (").append(projects.size()).append(" total):\n");

        for (Project p : projects) {
            Double hours = timeLogRepository
                    .getTotalHoursByProject(p);
            ctx.append("- ").append(p.getTitle())
                    .append(" | Status: ").append(p.getStatus())
                    .append(" | Client: ").append(p.getClient().getClientName())
                    .append(" | Budget: Rs. ").append(p.getBudget())
                    .append(" | Hours logged: ")
                    .append(hours != null ? hours : 0)
                    .append("h")
                    .append(" | Deadline: ").append(p.getDeadline())
                    .append("\n");
        }

        // ── Clients ────────────────────────────────────────────
        List<Client> clients = clientRepository.findAllByUser(user);
        ctx.append("\nCLIENTS (").append(clients.size()).append(" total):\n");

        for (Client c : clients) {
            ctx.append("- ").append(c.getClientName())
                    .append(" | Email: ").append(c.getEmail())
                    .append(" | Company: ").append(c.getCompany())
                    .append("\n");
        }

        // ── Invoices ───────────────────────────────────────────
        List<Invoice> invoices = invoiceRepository.findAllByUser(user);
        ctx.append("\nINVOICES (").append(invoices.size()).append(" total):\n");

        double totalRevenue  = 0;
        double totalUnpaid   = 0;

        for (Invoice inv : invoices) {
            ctx.append("- ").append(inv.getInvoiceNumber())
                    .append(" | Client: ")
                    .append(inv.getClient().getClientName())
                    .append(" | Amount: Rs. ").append(inv.getTotalAmount())
                    .append(" | Status: ").append(inv.getInvoiceStatus())
                    .append(" | Due: ").append(inv.getDueDate())
                    .append("\n");

            if (inv.getInvoiceStatus().name().equals("PAID")) {
                totalRevenue += inv.getTotalAmount().doubleValue();
            } else {
                totalUnpaid  += inv.getTotalAmount().doubleValue();
            }
        }

        ctx.append("\nFINANCIAL SUMMARY:\n");
        ctx.append("- Total revenue (paid invoices): Rs. ")
                .append(String.format("%.2f", totalRevenue)).append("\n");
        ctx.append("- Total outstanding (unpaid): Rs. ")
                .append(String.format("%.2f", totalUnpaid)).append("\n");

        // ── Hours this month ───────────────────────────────────
        LocalDate firstOfMonth = LocalDate.now().withDayOfMonth(1);
        Double hoursThisMonth  = timeLogRepository
                .getTotalHoursByUserAndDateRange(user, firstOfMonth);

        ctx.append("- Hours logged this month: ")
                .append(hoursThisMonth != null
                        ? String.format("%.2f", hoursThisMonth)
                        : "0")
                .append("h\n");

        ctx.append("\nToday's date: ").append(LocalDate.now()).append("\n");
        ctx.append("=== END OF DATA ===\n");

        return ctx.toString();
    }
}