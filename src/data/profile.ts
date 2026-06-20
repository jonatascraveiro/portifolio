export type Project = {
  name: string;
  description: string;
  stack: string[];
  link?: string;
};

export type Profile = {
  name: string;
  title: string;
  bio: string;
  links: {
    github: string;
    linkedin: string;
    email: string;
  };
  projects: Project[];
};

export const profile: Profile = {
  name: "Jonatas Craveiro",
  title: "Desenvolvedor Full Stack",
  bio: "Profissional formado em Sistemas para Internet, com experiência na Secretaria de Saúde do Município de Campo Grande/MS, atuando com Sistemas de Informação em Saúde. Atuo no desenvolvimento de aplicações web utilizando React.js e TypeScript, com conhecimentos em Next.js, consumo de APIs REST/GraphQL, versionamento com Git, estilização com CSS, Tailwind e Bootstrap.",
  links: {
    github: "https://github.com/jonatascraveiro",
    linkedin: "https://www.linkedin.com/in/jonatascraveiro",
    email: "jonatascraveiro@gmail.com",
  },
  projects: [
    {
      name: "Projeto Exemplo 1",
      description: "Descrição breve do projeto exemplo 1. Substitua pelo seu projeto real.",
      stack: ["React", "TypeScript", "Tailwind CSS"],
      link: "https://github.com/jonatascraveiro",
    },
    {
      name: "Projeto Exemplo 2",
      description: "Descrição breve do projeto exemplo 2. Substitua pelo seu projeto real.",
      stack: ["Next.js", "Node.js", "PostgreSQL"],
      link: "https://github.com/jonatascraveiro",
    },
    {
      name: "Projeto Exemplo 3",
      description: "Descrição breve do projeto exemplo 3. Substitua pelo seu projeto real.",
      stack: ["TypeScript", "API REST"],
    },
  ],
};
