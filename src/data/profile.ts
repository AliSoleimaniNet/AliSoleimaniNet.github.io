// All site content lives here. Edit this file; the rendering and 3D code never needs to change.

export interface Project {
  id: string;
  kicker: string;
  status: 'production' | 'in progress' | 'open source' | 'confidential';
  name: string;
  sub: string;
  description: string;
  stats?: { value: string; label: string }[];
  tags: string[];
  repo?: string;
  link?: string;
  featured?: boolean;
}

export interface StackItem { label: string; icon?: string; short?: string }

export const profile = {
  meta: {
    name: 'Ali Soleimani',
    handle: 'AliSoleimaniNet',
    title: 'Backend .NET Tech Lead & Go Engineer',
    url: 'https://alisoleimaninet.github.io/',
    location: 'Isfahan, Iran',
    email: 'AliSoleimaniWorks@gmail.com',
    github: 'https://github.com/AliSoleimaniNet',
    linkedin: 'https://www.linkedin.com/in/ali-soleimani-net/',
  },

  hero: {
    eyebrow: 'Backend .NET Tech Lead @ Helpsy',
    roles: ['Backend .NET Tech Lead', 'Go Engineer', 'Distributed Systems Builder', 'Microservices Architect'],
    tagline:
      'I design and ship the systems behind healthcare platforms, identity services and payment kiosks: scalable, observable and built to last.',
    chips: ['.NET 9 / 10', 'Go', 'PostgreSQL', 'Kafka & RabbitMQ', 'gRPC', 'Docker'],
  },

  about: {
    bio: [
      'I am a backend engineer who likes the hard parts: <strong>distributed systems, identity, payments and the infrastructure that keeps them honest</strong>. At <strong>Helpsy</strong> I lead the engineering of a mental-health clinic platform: a fleet of .NET microservices, an API gateway, event-driven messaging and the CI/CD and observability around it.',
      'Alongside .NET I write <strong>Go</strong>, most recently building a multi-service identity and access platform for a healthcare company with SSO, MFA, mutual-TLS and a policy decision point. Before that I built and operated a self-service payment kiosk network that has processed thousands of transactions a day for years.',
      'I am also a graduate student in Software Engineering at the University of Isfahan, and I care a lot about clean architecture, developer tooling and documentation that engineers actually read.',
    ],
    facts: [
      { icon: 'lead', title: 'Tech Lead @ Helpsy', sub: 'Backend, frontend team & DevOps · since 2024' },
      { icon: 'code', title: '.NET & Go', sub: 'Microservices, gRPC, event-driven systems' },
      { icon: 'edu', title: 'M.Sc. Software Engineering', sub: 'University of Isfahan · in progress' },
      { icon: 'pin', title: 'Isfahan, Iran', sub: 'Open to remote collaboration' },
    ],
  },

  experience: [
    {
      role: 'Senior Backend Engineer & Tech Lead',
      org: 'Helpsy',
      orgUrl: 'https://helpsy.ir',
      period: 'Aug 2024 — Present',
      bullets: [
        'Lead the backend of a mental-health clinic platform: 8 ASP.NET Core 9 microservices behind a YARP gateway, gRPC between services, MassTransit/RabbitMQ with a transactional outbox.',
        'Own the platform: PostgreSQL, Redis, Hangfire jobs, GitLab CI pipelines, Docker deployments across dev/staging/prod, Grafana observability and a shared dev server.',
        'Designed the security layer: opaque-session cookies swapped for JWTs at the gateway, idempotent token refresh, Redis rate limiting, hardened multi-tenant sub-domain hosting.',
        'Delivered booking, payment gateway integration, settlement and reporting flows; lead the frontend team shipping Next.js and React panels.',
      ],
    },
    {
      role: 'Go Engineer · Identity & Access Platform',
      org: 'Healthcare company (confidential)',
      period: '2026',
      bullets: [
        'Built a six-service Go IAM platform: gateway, auth, session, token/JWKS, policy decision point and admin, all on PostgreSQL and Redis.',
        'Implemented SSO, MFA and step-up authentication, mutual-TLS confidential channels, key rotation, tenant lifecycle and an audit pipeline, instrumented with OpenTelemetry and Prometheus.',
        'Took single sign-on live end to end across four products.',
      ],
    },
    {
      role: 'Full-Stack Developer',
      org: 'Bar1',
      period: 'Oct 2023 — Apr 2024',
      bullets: [
        'Built features for a logistics and freight platform: waybill workflows, bank B2B API integration and internal tooling in .NET.',
      ],
    },
    {
      role: 'Teaching Assistant',
      org: 'University of Isfahan',
      period: 'Sep 2022 — Mar 2023',
      bullets: ['Assisted computer engineering courses, grading and lab sessions.'],
    },
  ],

  education: [
    { degree: 'M.Sc. Software Engineering', org: 'University of Isfahan', period: '2025 — Present' },
    { degree: 'B.Sc. Computer Engineering', org: 'University of Isfahan', period: '2020 — 2024' },
  ],

  projects: <Project[]>[
    {
      id: 'helpsy',
      kicker: 'Tech Lead',
      status: 'production',
      name: 'Helpsy',
      sub: 'Mental-health clinic & therapy platform',
      description:
        'A multi-tenant platform for clinics, therapists and organizations: booking with slot locking, payment gateway and settlement, psychology tests, ticketing, SMS reminders and per-tenant landing pages, all served from one deployment.',
      stats: [
        { value: '8', label: 'microservices' },
        { value: '7', label: 'frontends' },
        { value: '1', label: 'gateway (YARP)' },
      ],
      tags: ['.NET 9', 'gRPC', 'MassTransit', 'RabbitMQ', 'PostgreSQL', 'Redis', 'Hangfire', 'YARP', 'Next.js', 'GitLab CI', 'Docker'],
      link: 'https://helpsy.ir',
      featured: true,
    },
    {
      id: 'kiosk',
      kicker: 'Owner',
      status: 'production',
      name: 'Kiosk Management',
      sub: 'Self-service payment kiosks for a public-sector client',
      description:
        'Central admin API plus an offline-first kiosk agent: bank PC-POS terminals (Sadad, FanAva), thermal receipt printers, SQLite store-and-forward with background sync workers, fleet auto-update and Windows kiosk mode.',
      stats: [
        { value: 'Dozens', label: 'of kiosks' },
        { value: '1000s', label: 'transactions / day' },
        { value: 'Years', label: 'in production' },
      ],
      tags: ['.NET 8', 'Clean Architecture', 'CQRS', 'EF Core', 'PostgreSQL', 'SQLite', 'Docker', 'Windows Services'],
    },
    {
      id: 'iam',
      kicker: 'Go',
      status: 'confidential',
      name: 'Healthcare IAM Platform',
      sub: 'Identity & access for a healthcare product family',
      description:
        'Six Go services on one PostgreSQL schema: gateway, auth, session, token (JWKS), authorization policy decision point and admin. SSO, MFA, step-up auth, mutual-TLS channels, delegated sessions, key rotation and break-glass access.',
      stats: [
        { value: '6', label: 'Go services' },
        { value: '4', label: 'products on SSO' },
      ],
      tags: ['Go', 'OAuth2 / OIDC', 'JWKS', 'mTLS', 'PostgreSQL', 'Redis', 'OpenTelemetry', 'Prometheus'],
    },
    {
      id: 'kiosell',
      kicker: 'Owner',
      status: 'in progress',
      name: 'KioSell',
      sub: 'Multi-tenant commerce & reservation SaaS',
      description:
        'A .NET 10 modular monolith with an OpenIddict auth server, PostgreSQL row-level-security multi-tenancy, Redpanda/Kafka outbox-inbox messaging, full OpenTelemetry tracing and Testcontainers integration tests. Go gRPC gateways and a Next.js monorepo on the edges.',
      tags: ['.NET 10', 'OpenIddict', 'Kafka', 'Redis', 'MinIO', 'OpenTelemetry', 'Testcontainers', 'Go', 'Next.js'],
    },
    {
      id: 'uber',
      kicker: 'Open source',
      status: 'open source',
      name: 'Uber Data Intelligence Platform',
      sub: 'End-to-end data platform on .NET Aspire',
      description:
        'Medallion-architecture lakehouse on PostgreSQL, semantic search with Qdrant, a local LLM through Ollama and a React + Tailwind front end, orchestrated with .NET Aspire.',
      tags: ['.NET Aspire', 'PostgreSQL', 'Qdrant', 'Ollama', 'React'],
      repo: 'https://github.com/AliSoleimaniNet/Uber-Data-Intelligence-Platform',
    },
    {
      id: 'quizdsl',
      kicker: 'Open source',
      status: 'open source',
      name: 'QuizDSL Studio',
      sub: 'LLM-assisted model-driven development',
      description:
        'An Xtext DSL plus a .NET 10 service that turns natural-language prompts into DSL models and generates working quiz applications from them.',
      tags: ['Xtext', 'MDSD', '.NET 10', 'LLM'],
      repo: 'https://github.com/AliSoleimaniNet/QuizDSL-Studio',
    },
  ],

  stack: <{ group: string; items: StackItem[] }[]>[
    {
      group: 'Backend',
      items: [
        { label: 'C#', icon: 'csharp' }, { label: '.NET 9 / 10', icon: 'dot-net' }, { label: 'ASP.NET Core', icon: 'dotnetcore' },
        { label: 'Go', icon: 'go' }, { label: 'gRPC', icon: 'grpc' }, { label: 'EF Core', short: 'EF' }, { label: 'Dapper', short: 'Dp' },
        { label: 'MediatR / CQRS', short: 'CQ' }, { label: 'YARP', short: 'YP' }, { label: 'Hangfire', short: 'HF' }, { label: 'OpenIddict', short: 'OI' }, { label: 'Python', icon: 'python' },
      ],
    },
    {
      group: 'Data & Messaging',
      items: [
        { label: 'PostgreSQL', icon: 'postgresql' }, { label: 'SQL Server', icon: 'microsoftsqlserver' }, { label: 'SQLite', icon: 'sqlite' },
        { label: 'Redis', icon: 'redis' }, { label: 'RabbitMQ', icon: 'rabbitmq' }, { label: 'Kafka / Redpanda', icon: 'apachekafka' },
        { label: 'MassTransit', short: 'MT' }, { label: 'MinIO', icon: 'minio' }, { label: 'Qdrant', icon: 'qdrant' },
      ],
    },
    {
      group: 'Infra & Observability',
      items: [
        { label: 'Docker', icon: 'docker' }, { label: 'Kubernetes', icon: 'kubernetes' }, { label: 'nginx', icon: 'nginx' }, { label: 'Linux', icon: 'linux' },
        { label: 'GitLab CI', icon: 'gitlab' }, { label: 'GitHub Actions', icon: 'githubactions' }, { label: 'Grafana', icon: 'grafana' },
        { label: 'Prometheus', icon: 'prometheus' }, { label: 'OpenTelemetry', icon: 'opentelemetry' }, { label: 'Testcontainers', short: 'TC' },
      ],
    },
    {
      group: 'Frontend & Tooling',
      items: [
        { label: 'TypeScript', icon: 'typescript' }, { label: 'Next.js', icon: 'nextjs' }, { label: 'React', icon: 'react' },
        { label: 'Tailwind', icon: 'tailwindcss' }, { label: 'Three.js', icon: 'threejs' }, { label: 'Git', icon: 'git' }, { label: 'Ollama', icon: 'ollama' },
      ],
    },
  ],

  githubFallback: {
    followers: 11,
    public_repos: 23,
    repos: [
      { name: 'Uber-Data-Intelligence-Platform', description: '.NET Aspire data platform: medallion lakehouse, Qdrant semantic search, local LLM.', language: 'JavaScript', stargazers_count: 0, html_url: 'https://github.com/AliSoleimaniNet/Uber-Data-Intelligence-Platform', pushed_at: '2026-02-18T00:00:00Z' },
      { name: 'QuizDSL-Studio', description: 'LLM-powered MDSD framework with Xtext and .NET 10.', language: 'Java', stargazers_count: 0, html_url: 'https://github.com/AliSoleimaniNet/QuizDSL-Studio', pushed_at: '2026-02-18T00:00:00Z' },
      { name: 'ProxyChainer', description: 'Xray-core config builder chaining VLESS traffic through SOCKS proxies.', language: 'Python', stargazers_count: 2, html_url: 'https://github.com/AliSoleimaniNet/ProxyChainer', pushed_at: '2026-03-12T00:00:00Z' },
      { name: 'ExpressFinder', description: 'Automates the ExpressVPN CLI to find working locations.', language: 'Python', stargazers_count: 2, html_url: 'https://github.com/AliSoleimaniNet/ExpressFinder', pushed_at: '2026-05-27T00:00:00Z' },
      { name: 'ShamsiDate', description: 'Persian (Shamsi) calendar events and holidays.', language: 'C#', stargazers_count: 0, html_url: 'https://github.com/AliSoleimaniNet/ShamsiDate', pushed_at: '2022-02-18T00:00:00Z' },
      { name: 'Chess', description: 'WinForms chess with online play and chat.', language: 'C#', stargazers_count: 0, html_url: 'https://github.com/AliSoleimaniNet/Chess', pushed_at: '2022-03-14T00:00:00Z' },
    ],
  },
};

export type Profile = typeof profile;
