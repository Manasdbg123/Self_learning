package com.aiep.knowledgeplatform.domain;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Topic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String subject;
    private String category;
    private String name;
    private String difficulty;
    
    @Column(columnDefinition = "TEXT")
    private String overview;
    @Column(columnDefinition = "TEXT")
    private String deepDive;
    @Column(columnDefinition = "TEXT")
    private String architecture;
    @Column(columnDefinition = "TEXT")
    private String codeExample;
    @Column(columnDefinition = "TEXT")
    private String interviewQuestions;
}
