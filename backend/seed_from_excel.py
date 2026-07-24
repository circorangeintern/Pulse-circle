"""
Database seed script — reads "Verify Jobs.xlsx" from the project root and
populates the database with that data. Run this instead of seed.py when you
want to use the Excel data.

Usage:
    cd backend
    python seed_from_excel.py
"""

import uuid
import openpyxl
from datetime import datetime, timezone

from app.core.database import SessionLocal, engine, Base
from app.core.security import get_password_hash
from app.models.user import User, UserRole
from app.models.company import Company
from app.models.job import Job, JobType
from app.models.review import Review
from app.models.report import Report, ReportReason, ReportStatus

EXCEL_PATH = r"C:\Pulse-Circle\Verify Jobs.xlsx"

# Companies to mark as unverified (for demo variety)
_UNVERIFIED_COMPANIES = {
    "BugZero",
    "WriteWave",
    "NetAssist",
    "GrowthPoint",
}


def parse_job_type(raw: str) -> JobType:
    """Map Excel job type strings to the backend enum."""
    mapping = {
        "full-time": JobType.FULL_TIME,
        "part-time": JobType.PART_TIME,
        "contract": JobType.CONTRACT,
        "internship": JobType.INTERNSHIP,
        "remote": JobType.REMOTE,
    }
    return mapping.get(raw.strip().lower(), JobType.FULL_TIME)


def _build_rich_description(title, company, location, job_type, salary, short_desc, requirement, website):
    """Build a rich, detailed job description following the example format."""

    company_short = company.replace(" Ltd", "").replace(" Inc", "").replace(" LLC", "")

    # Map job type to article-friendly wording
    type_map = {
        "Full-time": "full-time",
        "Part-time": "part-time",
        "Contract": "contract",
        "Internship": "internship",
        "Remote": "full-time remote",
    }
    type_text = type_map.get(job_type, job_type.lower())
    is_remote = "remote" in location.lower() or "remote" in job_type.lower()
    location_line = "fully remote" if is_remote else f"based in {location}"
    pref_line = "This is a remote position open to candidates globally." if is_remote else f"This is an on-site position based in {location}."

    # Base skills per job title (extended)
    skills_map = {
        "Frontend Developer": "React TypeScript JavaScript NextJS Tailwind CSS HTML5 CSS3 Jest Redux Webpack",
        "Backend Developer": "Node.js Express TypeScript Python PostgreSQL MongoDB REST API Docker GraphQL",
        "UI/UX Designer": "Figma Adobe XD Sketch Prototyping User Research Wireframing Design Systems Accessibility",
        "Product Manager": "Agile Scrum Jira Confluence Roadmapping Stakeholder Management Data Analysis A/B Testing",
        "Data Analyst": "SQL Python Excel Tableau Power BI Statistics Data Visualization ETL pandas",
        "Mobile Developer": "Flutter Dart React Native Kotlin Swift iOS Android Firebase Riverpod",
        "QA Engineer": "Selenium Cypress Jest Playwright Manual Testing Automation API Testing CI/CD TestRail",
        "DevOps Engineer": "Docker Kubernetes Terraform AWS CI/CD Jenkins Linux Ansible GitHub Actions Helm",
        "Customer Success": "CRM Salesforce Zendesk Communication Problem-solving Onboarding Data Analysis HubSpot",
        "Business Analyst": "SQL Excel Requirements Analysis Process Modeling UML Jira Data Analysis Visio BPMN",
        "HR Intern": "MS Office Communication Recruitment Coordination Onboarding HRIS Employee Relations ATS",
        "Cybersecurity Analyst": "Kali Linux Python SIEM Network Security Penetration Testing Firewalls ISO 27001 Wireshark",
        "Content Writer": "SEO WordPress Copywriting Blogging Content Strategy Research Editing Grammar Social Media",
        "Graphic Designer": "Adobe Photoshop Illustrator InDesign Canva Typography Branding Motion Design Figma",
        "AI Engineer": "Python TensorFlow PyTorch Machine Learning NLP Computer Vision LLM LangChain RAG",
        "Marketing Associate": "Digital Marketing SEO SEM Google Analytics Social Media Content Marketing Email Campaigns HubSpot",
        "Sales Executive": "CRM Salesforce Cold Calling Negotiation Lead Generation Account Management B2B Sales SaaS",
        "Project Coordinator": "MS Project Jira Trello Communication Scheduling Risk Management Agile Waterfall Excel",
        "IT Support": "Windows Linux Networking Active Directory Troubleshooting Hardware Support Ticketing Systems PowerShell",
        "Software Engineer": "Python JavaScript TypeScript React Node.js Docker PostgreSQL Git AWS",
    }
    skills = skills_map.get(title, "Communication Problem-solving Teamwork Adaptability")

    # Nice-to-have per title
    nice_have_map = {
        "Frontend Developer": [
            "Experience with React Native or mobile development",
            "Familiarity with Storybook and design systems",
            "Knowledge of GraphQL and Apollo Client",
            "Experience with performance optimization and Core Web Vitals",
        ],
        "Backend Developer": [
            "Experience with microservices architecture",
            "Familiarity with message queues (RabbitMQ, Kafka)",
            "Knowledge of serverless computing (AWS Lambda)",
            "Experience with CI/CD pipelines and infrastructure as code",
        ],
        "UI/UX Designer": [
            "Experience with motion design and micro-interactions",
            "Knowledge of HTML/CSS for design handoff",
            "Familiarity with usability testing methodologies",
            "Experience designing for accessibility (WCAG 2.1)",
        ],
        "Data Analyst": [
            "Experience with Python for data analysis",
            "Knowledge of statistical modeling and A/B testing",
            "Familiarity with cloud platforms (AWS, GCP, Azure)",
            "Experience with data warehousing and ETL pipelines",
        ],
        "Mobile Developer": [
            "Experience with CI/CD for mobile (Codemagic, Fastlane)",
            "Knowledge of in-app purchases and subscription billing",
            "Familiarity with push notifications and real-time features",
            "Published apps on both App Store and Play Store",
        ],
        "DevOps Engineer": [
            "Experience with service mesh (Istio, Linkerd)",
            "Knowledge of observability tools (Prometheus, Grafana, Datadog)",
            "Familiarity with GitOps practices (ArgoCD, Flux)",
            "Experience with multi-cloud environments",
        ],
        "Cybersecurity Analyst": [
            "Industry certifications (CISSP, CEH, CompTIA Security+)",
            "Experience with cloud security (AWS, Azure, GCP)",
            "Knowledge of DevSecOps practices",
            "Experience with incident response and forensics",
        ],
        "AI Engineer": [
            "Experience with LLM fine-tuning and RAG pipelines",
            "Knowledge of MLOps and model deployment (MLflow, Kubeflow)",
            "Publications in top-tier ML conferences (NeurIPS, ICML, ICLR)",
            "Experience with vector databases (Pinecone, Weaviate, Chroma)",
        ],
        "Software Engineer": [
            "Experience with cloud platforms (AWS, GCP, Azure)",
            "Knowledge of microservices and distributed systems",
            "Familiarity with agile development methodologies",
            "Open-source contributions or side projects",
        ],
    }
    nice_haves = nice_have_map.get(title, [
        "Strong problem-solving and analytical thinking",
        "Excellent written and verbal communication skills",
        "Ability to work independently and as part of a team",
        "Passion for learning new technologies and tools",
    ])

    salary_text = salary.replace("₦", "₦") if salary else "competitive"
    salary_line = salary_text if "competitive" in salary_text.lower() else f"₦{salary_text.replace('₦', '')}"

    lines = [
        f"We are seeking a highly skilled and motivated {title} to join {company} on a {type_text} basis. "
        f"{pref_line} "
        f"The successful candidate will work closely with our team to build and enhance our platform, "
        f"delivering high-quality solutions that drive our mission forward. "
        f"This is an exciting opportunity to contribute to a fast-growing company and make a real impact.",
        "",
        f"## About {company_short}",
        "",
        f"{company_short} is a forward-thinking technology company dedicated to innovation and excellence. "
        f"We believe in fostering a collaborative and inclusive work environment where every team member "
        f"can thrive and grow. Our culture is built on trust, transparency, and a shared passion for "
        f"building products that make a difference.",
        "",
        f"## Responsibilities",
        "",
    ]

    # Add responsibilities based on job title
    resp_map = {
        "Frontend Developer": [
            "Develop and maintain responsive web applications using React and TypeScript",
            "Collaborate with designers to implement pixel-perfect UI components",
            "Optimize application performance for maximum speed and scalability",
            "Write clean, well-tested code and participate in code reviews",
            "Mentor junior developers and contribute to team best practices",
            "Stay up-to-date with emerging frontend technologies and trends",
        ],
        "Backend Developer": [
            "Design, build, and maintain scalable RESTful APIs and microservices",
            "Optimize database queries and ensure data integrity across systems",
            "Implement authentication and authorization flows",
            "Write comprehensive unit and integration tests",
            "Participate in system architecture decisions and technical planning",
            "Monitor and improve application performance and reliability",
        ],
        "UI/UX Designer": [
            "Create intuitive and visually appealing user interfaces for web and mobile",
            "Conduct user research and usability testing to inform design decisions",
            "Develop and maintain design systems and component libraries",
            "Collaborate closely with product managers and developers",
            "Create wireframes, prototypes, and high-fidelity mockups",
            "Advocate for accessibility and inclusive design practices",
        ],
        "Product Manager": [
            "Define product vision, strategy, and roadmap aligned with business goals",
            "Gather and prioritize requirements from stakeholders and users",
            "Write detailed product specifications and user stories",
            "Work closely with engineering, design, and marketing teams",
            "Analyze product metrics and user feedback to drive improvements",
            "Lead sprint planning, reviews, and retrospectives",
        ],
        "Data Analyst": [
            "Analyze large datasets to uncover trends, patterns, and insights",
            "Build and maintain dashboards and reports for key stakeholders",
            "Design and analyze A/B tests to inform product decisions",
            "Collaborate with cross-functional teams to define KPIs and metrics",
            "Develop data models and ETL processes",
            "Present findings and recommendations to leadership",
        ],
        "Mobile Developer": [
            "Build and maintain cross-platform mobile applications using Flutter",
            "Implement smooth animations and responsive UIs",
            "Integrate with RESTful APIs and third-party services",
            "Ensure app performance, security, and reliability",
            "Publish and manage app releases on iOS App Store and Google Play",
            "Collaborate with backend developers to define API contracts",
        ],
        "QA Engineer": [
            "Design and execute comprehensive test plans and test cases",
            "Develop and maintain automated test suites",
            "Identify, document, and track software defects",
            "Perform regression, integration, and performance testing",
            "Collaborate with developers to improve code quality",
            "Contribute to continuous improvement of QA processes",
        ],
        "DevOps Engineer": [
            "Design, implement, and maintain CI/CD pipelines",
            "Manage cloud infrastructure using Infrastructure as Code",
            "Monitor system performance and ensure high availability",
            "Automate deployment processes and operational tasks",
            "Implement security best practices across the infrastructure",
            "Collaborate with development teams to streamline workflows",
        ],
        "Customer Success": [
            "Onboard new customers and ensure smooth adoption of our platform",
            "Proactively engage with customers to drive value and retention",
            "Resolve customer inquiries and escalate issues as needed",
            "Gather customer feedback and collaborate with product teams",
            "Develop and maintain customer success documentation",
            "Track and report on customer health metrics",
        ],
        "Business Analyst": [
            "Gather and document business requirements from stakeholders",
            "Analyze business processes and identify improvement opportunities",
            "Create process models, use cases, and functional specifications",
            "Facilitate communication between business and technical teams",
            "Validate solutions against business requirements",
            "Support user acceptance testing and training",
        ],
        "HR Intern": [
            "Assist with recruitment processes including screening and scheduling",
            "Support employee onboarding and offboarding procedures",
            "Maintain HR records and employee databases",
            "Help organize team-building events and initiatives",
            "Assist with payroll and benefits administration",
            "Contribute to HR policy development and compliance",
        ],
        "Cybersecurity Analyst": [
            "Monitor and analyze security events and alerts",
            "Conduct vulnerability assessments and penetration testing",
            "Implement and maintain security controls and policies",
            "Respond to security incidents and conduct forensic analysis",
            "Develop security awareness training for employees",
            "Stay current with emerging threats and security technologies",
        ],
        "Content Writer": [
            "Create engaging, SEO-optimized content for blog and website",
            "Develop content strategies aligned with marketing goals",
            "Research industry topics and trends to inform content",
            "Edit and proofread content for accuracy and consistency",
            "Collaborate with design team on visual content",
            "Track content performance and optimize accordingly",
        ],
        "Graphic Designer": [
            "Create visually compelling designs for digital and print media",
            "Develop brand assets including logos, icons, and illustrations",
            "Design marketing materials such as social media graphics and email templates",
            "Maintain and evolve brand guidelines across all channels",
            "Collaborate with marketing and product teams on creative projects",
            "Stay current with design trends and tools",
        ],
        "AI Engineer": [
            "Develop and deploy machine learning models and AI systems",
            "Build and optimize LLM-based applications using RAG architectures",
            "Design and implement data pipelines for model training",
            "Conduct experiments and evaluate model performance",
            "Collaborate with product teams to integrate AI features",
            "Stay at the forefront of AI research and apply cutting-edge techniques",
        ],
        "Marketing Associate": [
            "Execute multi-channel marketing campaigns across digital platforms",
            "Manage social media accounts and content calendars",
            "Analyze campaign performance and optimize for ROI",
            "Create engaging marketing content and collateral",
            "Support lead generation and demand generation initiatives",
            "Coordinate with external agencies and vendors",
        ],
        "Sales Executive": [
            "Identify and prospect new business opportunities",
            "Build and maintain strong relationships with clients",
            "Deliver compelling product demonstrations and presentations",
            "Negotiate contracts and close deals to meet revenue targets",
            "Maintain accurate sales pipeline and forecasts in CRM",
            "Collaborate with marketing on lead generation strategies",
        ],
        "Project Coordinator": [
            "Coordinate project activities and ensure timely delivery",
            "Track project milestones, deliverables, and budgets",
            "Facilitate communication between team members and stakeholders",
            "Prepare project documentation and status reports",
            "Identify and mitigate project risks and issues",
            "Support project managers in planning and execution",
        ],
        "IT Support": [
            "Provide technical support to end-users via ticketing system",
            "Troubleshoot hardware, software, and network issues",
            "Manage user accounts, permissions, and access controls",
            "Install, configure, and maintain IT equipment and software",
            "Document IT procedures and maintain knowledge base",
            "Participate in IT projects and system upgrades",
        ],
        "Software Engineer": [
            "Design, develop, and maintain software applications",
            "Write clean, efficient, and well-documented code",
            "Participate in code reviews and technical discussions",
            "Collaborate with cross-functional teams to define requirements",
            "Troubleshoot and debug production issues",
            "Contribute to system architecture and technology decisions",
        ],
    }
    responsibilities = resp_map.get(title, [
        "Collaborate with team members to deliver high-quality solutions",
        "Participate in agile ceremonies and contribute to planning",
        "Write clean, maintainable code following best practices",
        "Troubleshoot and resolve issues in a timely manner",
        "Contribute to documentation and knowledge sharing",
    ])
    for r in responsibilities:
        lines.append(f"- {r}")

    lines.extend([
        "",
        "## Requirements",
        "",
    ])

    # Requirements
    reqs = [
        f"{requirement} proficiency" if len(requirement) < 30 else requirement,
        "Excellent problem-solving and analytical skills",
        "Strong communication and collaboration abilities",
        "Ability to work effectively in a fast-paced environment",
        "Self-motivated with a passion for continuous learning",
        "Experience with version control systems (Git)",
    ]
    # Add experience requirement based on level
    if "Senior" in title or "Lead" in title or "AI Engineer" in title:
        reqs.insert(0, "5+ years of professional experience in a similar role")
    elif "Intern" in title:
        reqs.insert(0, "Currently pursuing or recently completed a degree in a related field")
    elif "Junior" in title or "Associate" in title:
        reqs.insert(0, "1-2 years of professional experience in a similar role")
    else:
        reqs.insert(0, "3+ years of professional experience in a similar role")

    for r in reqs:
        lines.append(f"- {r}")

    lines.extend([
        "",
        "## Nice-to-Have",
        "",
    ])
    for n in nice_haves:
        lines.append(f"- {n}")

    lines.extend([
        "",
        "## Working Environment",
        "",
        f"- **Location:** {location_line}",
        f"- **Type:** {type_text.title()}",
        f"- **Salary:** {salary_line}",
        "- **Reporting line:** Reports to the team lead or department head",
        "- **Equipment:** Company-provided equipment or stipend",
        "- **Team size:** Collaborative team environment with regular stand-ups and retrospectives",
        "",
        "## Growth Opportunities",
        "",
        "This role offers a chance to take ownership of impactful projects in a fast-growing company. "
        "You will work on cutting-edge technologies, collaborate with a talented team, and contribute "
        "to shaping the future of our platform. Your contributions will directly impact the success "
        "of our products and the satisfaction of our customers.",
        "",
        "## Required Skills",
        f"{skills}",
    ])

    return "\n".join(lines)


def seed():
    db = SessionLocal()

    try:
        # ── Drop all tables and recreate with latest schema ──
        print("Dropping and recreating all tables…")
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)
        db.commit()

        # ── Read Excel ──
        wb = openpyxl.load_workbook(EXCEL_PATH)
        ws = wb.active
        rows = list(ws.iter_rows(min_row=2, values_only=True))
        print(f"Loaded {len(rows)} rows from Excel")

        # ── Users ──
        admin = User(
            identifier=uuid.uuid4(),
            full_name="Alice Admin",
            email="admin@verifyhire.com",
            hashed_password=get_password_hash("admin123"),
            role=UserRole.ADMIN,
            is_active=True,
            created_date=datetime.now(timezone.utc),
        )
        seeker1 = User(
            identifier=uuid.uuid4(),
            full_name="Bob Seeker",
            email="bob@example.com",
            hashed_password=get_password_hash("password123"),
            role=UserRole.USER,
            is_active=True,
            created_date=datetime.now(timezone.utc),
        )
        seeker2 = User(
            identifier=uuid.uuid4(),
            full_name="Carol Reviewer",
            email="carol@example.com",
            hashed_password=get_password_hash("password123"),
            role=UserRole.USER,
            is_active=True,
            created_date=datetime.now(timezone.utc),
        )
        db.add_all([admin, seeker1, seeker2])
        db.commit()
        print(f"  OK {db.query(User).count()} users")

        # ── Companies (unique names from Excel) ──
        seen_companies = {}
        for row in rows:
            company_name = str(row[2]).strip() if row[2] else "Unknown"
            if company_name not in seen_companies:
                company = Company(
                    identifier=uuid.uuid4(),
                    name=company_name,
                    location=str(row[3]).strip() if row[3] else None,
                    industry="Technology",
                    about=f"{company_name} is a company operating in the tech space.",
                    verified=company_name not in _UNVERIFIED_COMPANIES,
                    created_by_identifier=admin.identifier,
                    created_date=datetime.now(timezone.utc),
                )
                db.add(company)
                seen_companies[company_name] = company

        db.commit()
        print(f"  OK {len(seen_companies)} companies")

        # ── Jobs ──
        job_records = []
        for row in rows:
            title = str(row[0]).strip() if row[0] else "Untitled"
            job_type_str = str(row[1]).strip() if row[1] else "Full-time"
            company_name = str(row[2]).strip() if row[2] else "Unknown"
            location = str(row[3]).strip() if row[3] else None
            salary = str(row[4]).strip() if row[4] else ""
            description = str(row[5]).strip() if row[5] else ""
            requirement = str(row[6]).strip() if row[6] else ""
            website = str(row[7]).strip() if row[7] else ""

            full_description = _build_rich_description(
                title, company_name, location, job_type_str,
                salary, description, requirement, website
            )

            company = seen_companies[company_name]
            job = Job(
                identifier=uuid.uuid4(),
                title=title,
                company_identifier=company.identifier,
                location=location,
                job_type=parse_job_type(job_type_str),
                description=full_description,
                created_by_identifier=admin.identifier,
                created_date=datetime.now(timezone.utc),
            )
            job_records.append(job)

        db.add_all(job_records)
        db.commit()
        print(f"  OK {len(job_records)} jobs")

        # ── Sample Reviews ──
        companies_list = list(seen_companies.values())
        if len(companies_list) >= 3:
            reviews_data = [
                Review(
                    identifier=uuid.uuid4(),
                    rating=5,
                    comment="Great company! Transparent hiring process and great team culture.",
                    company_identifier=companies_list[0].identifier,
                    created_by_identifier=seeker1.identifier,
                    created_date=datetime.now(timezone.utc),
                ),
                Review(
                    identifier=uuid.uuid4(),
                    rating=4,
                    comment="Good experience overall. The interview process was smooth.",
                    company_identifier=companies_list[1].identifier,
                    created_by_identifier=seeker1.identifier,
                    created_date=datetime.now(timezone.utc),
                ),
                Review(
                    identifier=uuid.uuid4(),
                    rating=3,
                    comment="Decent company but the response time was slow.",
                    company_identifier=companies_list[2].identifier,
                    created_by_identifier=seeker2.identifier,
                    created_date=datetime.now(timezone.utc),
                ),
            ]
            db.add_all(reviews_data)
            db.commit()
            print(f"  OK {len(reviews_data)} reviews")

        print("\nSUCCESS: Database seeded from Excel successfully!")
        print(f"   Users:     {db.query(User).count()}")
        print(f"   Companies: {db.query(Company).count()}")
        print(f"   Jobs:      {db.query(Job).count()}")
        print(f"   Reviews:   {db.query(Review).count()}")

    except Exception as e:
        db.rollback()
        print(f"\nERROR: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
