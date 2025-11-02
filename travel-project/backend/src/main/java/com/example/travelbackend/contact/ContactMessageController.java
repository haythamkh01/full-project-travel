package com.example.travelbackend.contact;


import com.example.travelbackend.contact.dto.ContactMessageRequest;
import com.example.travelbackend.contact.dto.ContactMessageResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ContactMessageController {

    private final ContactMessageService service;
    private final CurrentUserLookup currentUser; // small helper shown below

    public ContactMessageController(ContactMessageService service, CurrentUserLookup currentUser) {
        this.service = service;
        this.currentUser = currentUser;
    }

    // Public (or logged-in) can send a message
    @PostMapping("/contact-messages")
    public ContactMessageResponse submit(
            @Valid @RequestBody ContactMessageRequest req,
            Authentication auth,
            HttpServletRequest httpReq
    ) {
        var entity = new ContactMessage();
        entity.setSubject(req.subject);
        entity.setContent(req.content);
        entity.setSenderIp(httpReq.getRemoteAddr());

        // If authenticated, override name/email from DB
        var user = currentUser.get(auth);
        if (user != null) {
            entity.setUserId(user.id());
            entity.setName(user.name());
            entity.setEmail(user.email());
        } else {
            entity.setName(req.name);
            entity.setEmail(req.email);
        }
        return service.save(entity);
    }

    // Admin list (supports ?status=NEW|READ, ?page=0&size=20)
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/contact-messages")
    public Page<ContactMessageResponse> list(
            @RequestParam(value = "status", required = false) MessageStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return service.list(status, pageable);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/admin/contact-messages/{id}/read")
    public void markRead(@PathVariable Long id) {
        service.markRead(id);
    }

    // For a small red badge in your admin navbar
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin/contact-messages/unread-count")
    public long unreadCount() {
        return service.unreadCount();
    }
}
