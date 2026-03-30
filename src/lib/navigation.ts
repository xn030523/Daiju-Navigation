import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

export type NavigationItem = {
  name: string;
  href: string;
  tag: string;
  description: string;
};

export type NavigationGroup = {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  items: NavigationItem[];
};

export type NavigationDocument = {
  title: string;
  summary: string;
  groups: NavigationGroup[];
};

export type SiteMeta = {
  title: string;
  summary: string;
  description: string;
  keywords: string[];
  siteUrl: string;
};

type Frontmatter = Record<string, string>;

const contentRoot = path.join(process.cwd(), "src", "content", "navigation");
const itemPattern = /^-\s+\[(.+)\]\((https?:\/\/.+)\)\s+\|\s+(.+?)\s+\|\s+(.+)$/;

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

function parseFrontmatter(raw: string) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);

  if (!match) {
    return {
      frontmatter: {} as Frontmatter,
      body: raw.trim(),
    };
  }

  const frontmatter = match[1]
    .split(/\r?\n/)
    .reduce<Frontmatter>((result, line) => {
      const separatorIndex = line.indexOf(":");

      if (separatorIndex === -1) {
        return result;
      }

      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim();
      result[key] = value;
      return result;
    }, {});

  return {
    frontmatter,
    body: match[2].trim(),
  };
}

async function readMarkdownFile(filePath: string) {
  const raw = await readFile(filePath, "utf8");
  return parseFrontmatter(raw);
}

function parseKeywords(raw?: string) {
  return raw
    ?.split(",")
    .map((item) => item.trim())
    .filter(Boolean) ?? [];
}

function parseItems(body: string) {
  return body
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.match(itemPattern))
    .filter((match): match is RegExpMatchArray => match !== null)
    .map((match) => ({
      name: match[1].trim(),
      href: match[2].trim(),
      tag: match[3].trim(),
      description: match[4].trim(),
    }));
}

export async function getSiteMeta(): Promise<SiteMeta> {
  const metaFile = await readMarkdownFile(path.join(contentRoot, "_meta.md"));

  return {
    title: metaFile.frontmatter.title ?? "呆橘导航站",
    summary: metaFile.frontmatter.summary ?? "Daiju Navigation",
    description:
      metaFile.frontmatter.description ??
      metaFile.body ??
      "呆橘导航站，收录设计、开发、效率与运营工具。",
    keywords: parseKeywords(metaFile.frontmatter.keywords),
    siteUrl: metaFile.frontmatter.siteUrl ?? "https://daiju.example.com",
  };
}

// 功能入口：按目录读取模块 Markdown，每个模块一个 index.md，便于大规模维护。
export async function getNavigationDocument(): Promise<NavigationDocument> {
  const siteMeta = await getSiteMeta();
  const directories = await readdir(contentRoot, { withFileTypes: true });

  const groupEntries = await Promise.all(
    directories
      .filter((entry) => entry.isDirectory())
      .map(async (entry) => {
        const directoryPath = path.join(contentRoot, entry.name);
        const moduleFile = await readMarkdownFile(path.join(directoryPath, "index.md"));

        return {
          id: slugify(moduleFile.frontmatter.title ?? entry.name),
          title: moduleFile.frontmatter.title ?? entry.name,
          eyebrow: moduleFile.frontmatter.eyebrow ?? "分类",
          description: moduleFile.frontmatter.description ?? moduleFile.body,
          order: Number(moduleFile.frontmatter.order ?? "9999"),
          items: parseItems(moduleFile.body),
        };
      }),
  );

  const groups = groupEntries
    .sort((left, right) => left.order - right.order)
    .map((group) => ({
      id: group.id,
      title: group.title,
      eyebrow: group.eyebrow,
      description: group.description,
      items: group.items,
    }));

  return {
    title: siteMeta.title,
    summary: siteMeta.summary,
    groups,
  };
}

export async function getNavigationGroup(slug: string) {
  const document = await getNavigationDocument();
  return document.groups.find((group) => group.id === slug) ?? null;
}

export async function getNavigationGroupSlugs() {
  const document = await getNavigationDocument();
  return document.groups.map((group) => group.id);
}
