from data_hld import HLD_TOPICS
from data_lld import LLD_TOPICS

all_systems = HLD_TOPICS + LLD_TOPICS

def sql_escape(s):
    if not s:
        return "''"
    # double up single quotes
    clean = s.replace("'", "''")
    return f"'{clean}'"

sql_statements = [
    "-- Seed Comprehensive Engineering Knowledge Base from self.pdf",
    "",
    "INSERT INTO topic (subject, category, name, difficulty, overview, deepDive, architecture, codeExample, interviewQuestions) VALUES"
]

entries = []
for t in all_systems:
    subject = sql_escape(t['subject'])
    category = sql_escape(t['category'])
    name = sql_escape(t['title'])
    diff = sql_escape(t['difficulty'])
    overview = sql_escape(t['what'])
    deepDive = sql_escape(t['how'] + "\n\n" + t['internals'])
    arch = sql_escape(t.get('architecture', ''))
    code = sql_escape(t.get('codeExample', ''))
    
    iq_text = "\n".join([f"Q: {iq['q']} A: {iq['a']}" for iq in t.get('interviewQuestions', [])])
    iq = sql_escape(iq_text)
    
    entries.append(f"({subject}, {category}, {name}, {diff}, {overview}, {deepDive}, {arch}, {code}, {iq})")

# Also keep the original JVM Architecture
entries.append("""('Programming', 'Java', 'JVM Architecture', 'Advanced',
'The JVM (Java Virtual Machine) is an abstract computing machine that enables a computer to run a Java program.',
'Deep Dive: It consists of ClassLoader, Runtime Data Areas (Method Area, Heap, Stack, PC Register, Native Method Stack), and the Execution Engine (Interpreter, JIT Compiler, Garbage Collector).',
'Architecture Component Flow: .java -> javac -> .class -> ClassLoader -> Memory -> Execution Engine.',
'// JVM manages this internally, but understanding -Xmx and -Xms is key.',
'Q: Difference between Stack and Heap? A: Stack is thread-local and stores primitives/references. Heap is global and stores objects.')""")

sql_content = "\n-- Seed Comprehensive Engineering Knowledge Base from self.pdf\n\nINSERT INTO topic (subject, category, name, difficulty, overview, deepDive, architecture, codeExample, interviewQuestions) VALUES\n" + ",\n\n".join(entries) + ";\n"

with open('backend/src/main/resources/data.sql', 'w', encoding='utf-8') as f:
    f.write(sql_content)

print(f"Successfully updated backend/src/main/resources/data.sql with {len(entries)} systems!")
