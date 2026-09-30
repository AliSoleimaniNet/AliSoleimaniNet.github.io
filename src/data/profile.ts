// All site content lives here. Edit this file; the rendering and 3D code never needs to change.
// Rule: products are described by their public purpose, my role and general stack only. No internals.

export interface Project {
  id: string;
  kicker: string;
  status: 'production' | 'launching' | 'in progress' | 'open source';
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
    title: 'Tech Lead & Software Architect · .NET & Go',
    url: 'https://alisoleimaninet.github.io/',
    location: 'Isfahan, Iran',
    timeZone: 'Asia/Tehran',
    email: 'AliSoleimaniWorks@gmail.com',
    github: 'https://github.com/AliSoleimaniNet',
    linkedin: 'https://www.linkedin.com/in/ali-soleimani-net/',
  },

  hero: {
    eyebrow: 'Tech Lead & Software Architect @ Helpsy',
    roles: ['Tech Lead', 'Software Architect', 'System Designer', 'Backend .NET & Go Engineer'],
    tagline:
      'I lead teams and design the systems behind healthcare platforms, identity services, fitness products and payment kiosks: scalable, observable and built to last.',
    chips: ['.NET 9 / 10', 'Go', 'PostgreSQL', 'Kafka & RabbitMQ', 'gRPC', 'Docker'],
  },

  // Labels attached to nodes of the 3D mesh: the generic building blocks I work with.
  meshLabels: [
    'api gateway', 'identity', 'booking', 'billing', 'notifications', 'reporting',
    'postgresql', 'redis', 'message broker', 'job scheduler', 'grpc', 'opentelemetry', 'kiosk agent', 'ci/cd',
  ],

  about: {
    bio: [
      'I am a backend engineer who likes the hard parts: <strong>distributed systems, identity, payments and the infrastructure that keeps them honest</strong>. At <strong>Helpsy</strong> I am tech lead and architect of a mental-health clinic platform: I designed its system architecture, lead the backend and frontend teams, and run the servers and delivery pipeline behind it.',
      'Alongside .NET I write <strong>Go</strong>. For <strong>Barnabus</strong> I designed and built the identity and access platform that signs users into their healthcare products. I am also co-founder of <strong>Gymivo</strong>, a fitness platform launching soon, where I lead the backend. Before all that I designed, built and still operate a self-service payment kiosk network that has processed thousands of transactions a day for years. It all started when I was a teenager, building websites for companies and online stores and hosting them myself.',
      'I am also a graduate student in Software Engineering at the University of Isfahan, and I care a lot about clean architecture, developer tooling and documentation that engineers actually read.',
    ],
    facts: [
      { icon: 'lead', title: 'Tech Lead & Architect @ Helpsy', sub: 'Architecture, teams, servers & delivery · since 2024' },
      { icon: 'code', title: 'System design · .NET & Go', sub: 'Microservices, event-driven systems, identity' },
      { icon: 'edu', title: 'M.Sc. Software Engineering', sub: 'University of Isfahan · in progress' },
      { icon: 'pin', title: 'Isfahan, Iran', sub: 'Open to remote collaboration' },
    ],
  },

  principles: [
    { title: 'Boring infrastructure, interesting products', text: 'PostgreSQL, Redis and a message broker cover most problems. Novelty goes into the domain, not the plumbing.' },
    { title: 'Outbox or it did not happen', text: 'Every cross-service side effect goes through a transactional outbox with retries and a dead-letter queue. No fire-and-forget.' },
    { title: 'Fail closed at the edge', text: 'The gateway rate-limits, validates and denies by default. Services trust the gateway, never the client.' },
    { title: 'Measure before tuning', text: 'Traces and dashboards first. I only optimise what a p99 or a dashboard panel proves is slow.' },
    { title: 'Docs are part of the code', text: 'Architecture decisions, runbooks and team commands live in the repo, next to the code they describe.' },
    { title: 'Offline is a feature', text: 'Kiosks, mobile clients and flaky networks taught me store-and-forward, idempotency keys and reconciliation jobs.' },
  ],

  experience: [
    {
      role: 'Tech Lead & Software Architect',
      org: 'Helpsy',
      orgUrl: 'https://helpsy.ir',
      period: 'Aug 2024 — Present',
      bullets: [
        'Designed the system architecture of a multi-tenant healthcare platform: .NET microservices behind a gateway, gRPC between services and message-driven integration with a transactional outbox.',
        'Lead the backend and frontend teams, set the engineering standards, code review and documentation practices, and turn product requirements into technical plans.',
        'Run the infrastructure end to end: Linux servers, data stores, CI/CD pipelines, containerised deployments across environments, observability and the shared development server.',
      ],
    },
    {
      role: 'Co-founder & Backend Lead',
      org: 'Gymivo',
      orgUrl: 'https://gymivo.ir',
      period: 'Sep 2025 — Present',
      bullets: [
        'Co-founded Gymivo, a fitness platform that connects athletes with coaches for workout plans, progress tracking and challenges, launching soon at gymivo.ir.',
        'Designed and own the backend: an ASP.NET Core 10 API with Clean Architecture, EF Core on PostgreSQL, JWT auth, a media pipeline and integration tests, shipped with Docker.',
        'Work design-to-API with the product and frontend team, turning Figma flows into endpoints the Next.js app consumes.',
      ],
    },
    {
      role: 'Go Engineer · Identity & Access Platform',
      org: 'Barnabus',
      orgUrl: 'https://barnabus.ai',
      period: '2026',
      bullets: [
        'Designed and built the Go identity and access platform for the Barnabus healthcare products: single sign-on, MFA and OAuth2 / OIDC flows on PostgreSQL and Redis.',
        'Instrumented everything with OpenTelemetry and Prometheus, and delivered the admin and login front ends around it.',
      ],
    },
    {
      role: 'Full-Stack Developer',
      org: 'Bar1',
      orgUrl: 'https://bar1.ir',
      period: 'Oct 2023 — Apr 2024',
      bullets: [
        'Worked full stack on the internal panels of a freight-transport single-window platform: shipping workflows, bank B2B API integration and internal tooling in .NET.',
      ],
    },
    {
      role: 'Teaching Assistant',
      org: 'University of Isfahan',
      period: 'Sep 2022 — Mar 2023',
      bullets: ['Assisted computer engineering courses, grading and lab sessions.'],
    },
    {
      role: 'Co-founder · where it started',
      org: 'OjeAmoozesh',
      orgUrl: 'https://ojeamoozesh.ir',
      period: '2016 — 2019',
      bullets: [
        'Co-founded OjeAmoozesh, an online study-planning and university-entrance counseling platform, and built its early versions.',
        'As a teenager, built websites for companies and online stores and ran a small hosting reseller business, hosting and maintaining client sites myself.',
      ],
    },
  ],

  education: [
    { degree: 'M.Sc. Software Engineering', org: 'University of Isfahan', period: '2025 — Present' },
    { degree: 'B.Sc. Computer Engineering', org: 'University of Isfahan', period: '2020 — 2024' },
  ],

  projects: <Project[]>[
    {
      id: 'helpsy',
      kicker: 'Tech Lead & Architect',
      status: 'production',
      name: 'Helpsy',
      sub: 'Mental-health clinic & therapy platform',
      description:
        'A multi-tenant platform for clinics, therapists and organizations: online booking, payments, psychology tests, ticketing, SMS notifications and per-tenant sites. I designed its architecture and lead the backend, frontend and infrastructure.',
      tags: ['.NET', 'gRPC', 'RabbitMQ', 'PostgreSQL', 'Redis', 'Docker', 'Next.js', 'GitLab CI'],
      link: 'https://helpsy.ir',
      featured: true,
    },
    {
      id: 'barnabus',
      kicker: 'Go',
      status: 'production',
      name: 'Barnabus IAM',
      sub: 'Identity & access for the Barnabus healthcare platform',
      description:
        'The Go identity provider behind the Barnabus healthcare products: single sign-on, multi-factor authentication and OAuth2 / OIDC flows, multi-tenant and fully audited, instrumented with OpenTelemetry and Prometheus.',
      tags: ['Go', 'OAuth2 / OIDC', 'PostgreSQL', 'Redis', 'OpenTelemetry', 'Prometheus'],
      link: 'https://barnabus.ai',
    },
    {
      id: 'gymivo',
      kicker: 'Co-founder',
      status: 'launching',
      name: 'Gymivo',
      sub: 'Fitness platform connecting athletes and coaches',
      description:
        'Find a coach, get a workout plan, follow the exercises and see your progress, with challenges and coach chat along the way. I co-founded Gymivo and build its backend: an ASP.NET Core 10 API behind a Next.js app. Launching soon at gymivo.ir.',
      tags: ['.NET 10', 'ASP.NET Core', 'Clean Architecture', 'EF Core', 'PostgreSQL', 'JWT', 'Docker', 'Next.js'],
      link: 'https://gymivo.ir',
    },
    {
      id: 'kiosk',
      kicker: 'Owner & Architect',
      status: 'production',
      name: 'Kiosk Management',
      sub: 'Self-service payment kiosks for a public-sector client',
      description:
        'Designed and built end to end, in use as the self-service kiosks behind varzesh.kish.ir: a central admin API plus an offline-first kiosk agent with bank POS terminal and receipt-printer integration, local store-and-forward with background sync, fleet auto-update and locked-down Windows kiosk mode.',
      stats: [
        { value: 'Dozens', label: 'of kiosks' },
        { value: '1000s', label: 'transactions / day' },
        { value: 'Years', label: 'in production' },
      ],
      tags: ['.NET 8', 'Clean Architecture', 'CQRS', 'EF Core', 'PostgreSQL', 'SQLite', 'Docker', 'Windows Services'],
      link: 'https://varzesh.kish.ir',
    },
    {
      id: 'kiosell',
      kicker: 'Owner & Architect',
      status: 'in progress',
      name: 'KioSell',
      sub: 'Multi-tenant commerce & reservation SaaS',
      description:
        'A .NET 10 modular monolith with a dedicated auth server, tenant data isolation in PostgreSQL, event-driven messaging with outbox and inbox, OpenTelemetry tracing and container-based integration tests. Go gRPC gateways and a Next.js monorepo on the edges.',
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
