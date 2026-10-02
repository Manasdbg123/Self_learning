import os

def write_file(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

# ----------------- BACKEND FILES -----------------

pom_xml = """<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>3.2.0</version>
		<relativePath/>
	</parent>
	<groupId>com.aiep</groupId>
	<artifactId>knowledge-platform</artifactId>
	<version>0.0.1-SNAPSHOT</version>
	<name>knowledge-platform</name>
	<description>AI Engineering Knowledge Platform</description>
	<properties>
		<java.version>21</java.version>
	</properties>
	<dependencies>
		<dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-data-jpa</artifactId></dependency>
		<dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-web</artifactId></dependency>
		<dependency><groupId>org.postgresql</groupId><artifactId>postgresql</artifactId><scope>runtime</scope></dependency>
		<dependency><groupId>org.projectlombok</groupId><artifactId>lombok</artifactId><optional>true</optional></dependency>
		<dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-test</artifactId><scope>test</scope></dependency>
	</dependencies>
	<build>
		<plugins>
			<plugin><groupId>org.springframework.boot</groupId><artifactId>spring-boot-maven-plugin</artifactId></plugin>
		</plugins>
	</build>
</project>
"""

app_yml = """spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/knowledge_platform
    username: user
    password: password
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
server:
  port: 8080
"""

entity_topic = """package com.aiep.knowledgeplatform.domain;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Topic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    @Column(columnDefinition = "TEXT")
    private String overview;
    @Column(columnDefinition = "TEXT")
    private String deepDive;
    @Column(columnDefinition = "TEXT")
    private String codeExample;
}
"""

repo_topic = """package com.aiep.knowledgeplatform.repository;
import com.aiep.knowledgeplatform.domain.Topic;
import org.springframework.data.jpa.repository.JpaRepository;
public interface TopicRepository extends JpaRepository<Topic, Long> {}
"""

controller_topic = """package com.aiep.knowledgeplatform.controller;
import com.aiep.knowledgeplatform.domain.Topic;
import com.aiep.knowledgeplatform.repository.TopicRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/topics")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class TopicController {
    private final TopicRepository topicRepository;

    @GetMapping
    public List<Topic> getAllTopics() {
        return topicRepository.findAll();
    }

    @PostMapping
    public Topic createTopic(@RequestBody Topic topic) {
        return topicRepository.save(topic);
    }
}
"""

main_class = """package com.aiep.knowledgeplatform;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class KnowledgePlatformApplication {
	public static void main(String[] args) {
		SpringApplication.run(KnowledgePlatformApplication.class, args);
	}
}
"""

# ----------------- FRONTEND FILES -----------------

layout_tsx = """import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Engineering Knowledge Platform',
  description: 'Your personal AI-powered engineering knowledge system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-zinc-950 text-zinc-50 flex h-screen`}>
        <aside className="w-64 bg-zinc-900 border-r border-zinc-800 p-4 flex flex-col gap-4">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">EngKnowledge</h1>
          <nav className="flex flex-col gap-2 mt-4">
            <a href="/" className="px-3 py-2 rounded bg-zinc-800 hover:bg-zinc-700 transition">Dashboard</a>
            <a href="/subjects" className="px-3 py-2 rounded hover:bg-zinc-800 transition">Subjects</a>
            <a href="/chat" className="px-3 py-2 rounded hover:bg-zinc-800 transition">AI Tutor</a>
          </nav>
        </aside>
        <main className="flex-1 overflow-y-auto p-8">
            {children}
        </main>
      </body>
    </html>
  )
}
"""

page_tsx = """export default function Home() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-zinc-400 mt-2">Welcome back. Continue your engineering journey.</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
            <h3 className="text-lg font-medium">Continue Learning</h3>
            <p className="text-sm text-zinc-400 mt-1">System Design: Rate Limiting</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
            <h3 className="text-lg font-medium">Interview Readiness</h3>
            <p className="text-sm text-zinc-400 mt-1">78% - Strong in Backend</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
            <h3 className="text-lg font-medium">Recently Added</h3>
            <p className="text-sm text-zinc-400 mt-1">Gaurav Sen: Load Balancing</p>
        </div>
      </div>
    </div>
  )
}
"""

globals_css = """@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 214, 219, 220;
  --background-end-rgb: 255, 255, 255;
}

@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 255, 255, 255;
    --background-start-rgb: 0, 0, 0;
    --background-end-rgb: 0, 0, 0;
  }
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}
"""

def generate():
    # Backend
    write_file('backend/pom.xml', pom_xml)
    write_file('backend/src/main/resources/application.yml', app_yml)
    write_file('backend/src/main/java/com/aiep/knowledgeplatform/KnowledgePlatformApplication.java', main_class)
    write_file('backend/src/main/java/com/aiep/knowledgeplatform/domain/Topic.java', entity_topic)
    write_file('backend/src/main/java/com/aiep/knowledgeplatform/repository/TopicRepository.java', repo_topic)
    write_file('backend/src/main/java/com/aiep/knowledgeplatform/controller/TopicController.java', controller_topic)
    
    # Frontend
    write_file('frontend/src/app/layout.tsx', layout_tsx)
    write_file('frontend/src/app/page.tsx', page_tsx)
    write_file('frontend/src/app/globals.css', globals_css)

    print("Project generated successfully!")

if __name__ == '__main__':
    generate()
