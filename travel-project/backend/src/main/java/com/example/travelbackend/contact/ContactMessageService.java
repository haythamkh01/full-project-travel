package com.example.travelbackend.contact;


import com.example.travelbackend.contact.dto.ContactMessageRequest;
import com.example.travelbackend.contact.dto.ContactMessageResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ContactMessageService {
    private final ContactMessageRepository repo;

    public ContactMessageService(ContactMessageRepository repo) {
        this.repo = repo;
    }

    public ContactMessageResponse save(ContactMessage entity) {
        var saved = repo.save(entity);
        return map(saved);
    }

    public Page<ContactMessageResponse> list(MessageStatus status, Pageable pageable) {
        var page = (status != null) ? repo.findAllByStatus(status, pageable) : repo.findAll(pageable);
        return page.map(this::map);
    }

    public void markRead(Long id) {
        var msg = repo.findById(id).orElseThrow();
        msg.setStatus(MessageStatus.READ);
        repo.save(msg);
    }

    public long unreadCount() {
        return repo.countByStatus(MessageStatus.NEW);
    }

    private ContactMessageResponse map(ContactMessage m) {
        return new ContactMessageResponse(
                m.getId(), m.getUserId(), m.getName(), m.getEmail(),
                m.getSubject(), m.getContent(), m.getCreatedAt(),
                m.getStatus(), m.getAdminNote()
        );
    }
}
