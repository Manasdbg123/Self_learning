package com.aiep.knowledgeplatform.repository;
import com.aiep.knowledgeplatform.domain.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
public interface TopicRepository extends JpaRepository<Topic, Long> {}
