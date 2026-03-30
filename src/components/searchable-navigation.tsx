"use client";

import Image from "next/image";
import Link from "next/link";
import { useDeferredValue, useId, useState } from "react";

import type { NavigationDocument, NavigationGroup } from "@/lib/navigation";

type SearchableNavigationProps = {
  document: NavigationDocument;
};

function getHostname(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}

function filterGroups(groups: NavigationGroup[], keyword: string) {
  const normalizedKeyword = keyword.trim().toLowerCase();

  if (!normalizedKeyword) {
    return groups;
  }

  // 关键逻辑：优先过滤站点项；如果分类标题或简介命中，则保留整个分类，方便快速浏览。
  return groups
    .map((group) => {
      const groupText = [group.title, group.eyebrow, group.description]
        .join(" ")
        .toLowerCase();

      if (groupText.includes(normalizedKeyword)) {
        return group;
      }

      const items = group.items.filter((item) =>
        [item.name, item.tag, item.description, item.href]
          .join(" ")
          .toLowerCase()
          .includes(normalizedKeyword),
      );

      return items.length > 0 ? { ...group, items } : null;
    })
    .filter((group): group is NavigationGroup => group !== null);
}

export function SearchableNavigation({ document }: SearchableNavigationProps) {
  const inputId = useId();
  const [keyword, setKeyword] = useState("");
  const deferredKeyword = useDeferredValue(keyword);
  const filteredGroups = filterGroups(document.groups, deferredKeyword);
  const totalLinks = filteredGroups.reduce((count, group) => count + group.items.length, 0);

  return (
    <>
      <section className="hero-panel glass-card rounded-[24px] px-4 py-4 sm:px-5 sm:py-5">
        <div className="grid gap-4 lg:grid-cols-[minmax(240px,0.8fr)_minmax(0,1.8fr)] lg:items-center">
          <div className="min-w-0">
            <h1 className="section-title text-3xl leading-none font-semibold sm:text-5xl">
              {document.title}
            </h1>
            <p className="mt-2 text-sm text-muted">{document.summary}</p>
          </div>
          <div className="search-panel rounded-[20px] border border-line bg-white/58 p-3">
            <label htmlFor={inputId} className="sr-only">
              搜索导航
            </label>
            <div className="search-shell flex items-center gap-3 rounded-[16px] border border-line bg-[#fcfaf6] px-4 py-2.5">
              <span className="search-icon text-muted" aria-hidden="true">
                ⌕
              </span>
              <input
                id={inputId}
                type="search"
                value={keyword}
                placeholder="搜索站点、标签、描述"
                onChange={(event) => setKeyword(event.target.value)}
                className="search-input h-8 w-full bg-transparent text-sm outline-none placeholder:text-[#9c968c]"
              />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted">
              <span>{filteredGroups.length} 个栏目 · {totalLinks} 条结果</span>
              {deferredKeyword ? (
                <span className="status-pill status-pill-active rounded-full px-2.5 py-1 text-xs">
                  {deferredKeyword}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[200px_minmax(0,1fr)]">
        <aside className="glass-card rounded-[20px] p-2.5">
          <div className="lg:sticky lg:top-4">
            <nav className="space-y-2">
              {filteredGroups.map((group, index) => (
                <a
                  key={group.id}
                  className="sidebar-link flex items-center justify-between rounded-[14px] px-3 py-2.5"
                  href={`#${group.id}`}
                >
                  <span className="text-sm">{group.title}</span>
                  <span className="text-xs text-muted">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <div className="space-y-4">
          {filteredGroups.length === 0 ? (
            <section className="glass-card rounded-[20px] p-6 text-sm text-muted">
              没有匹配结果，换个关键词试试。
            </section>
          ) : null}

          {filteredGroups.map((group) => (
            <section
              id={group.id}
              key={group.id}
              className="glass-card rounded-[20px] p-4 sm:p-5"
            >
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-line pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="section-title text-2xl font-semibold">{group.title}</h3>
                    <Link
                      href={`/category/${group.id}`}
                      className="text-xs text-muted underline-offset-4 hover:underline"
                    >
                      分类页
                    </Link>
                  </div>
                  <p className="max-w-2xl text-sm text-muted">{group.description}</p>
                </div>
                <span className="rounded-full border border-line px-3 py-1 text-xs text-muted">
                  {group.items.length} 个
                </span>
              </div>

              <div className="grid gap-3 xl:grid-cols-2">
                {group.items.map((item) => (
                  <a
                    key={item.name}
                    className="link-tile rounded-[18px] border border-line bg-white/35 p-4"
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="icon-shell flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-line bg-white/80">
                            {/* 边界与异常：favicon 走远程源，统一关闭优化，避免静态导出被外部域名配置卡住。 */}
                            <Image
                              src={`https://icons.duckduckgo.com/ip3/${getHostname(item.href)}.ico`}
                              alt={`${item.name} icon`}
                              className="h-5 w-5"
                              width={20}
                              height={20}
                              unoptimized
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-base font-semibold">{item.name}</span>
                              <span className="rounded-full bg-black/[0.05] px-2.5 py-1 text-[11px] uppercase tracking-[0.22em] text-muted">
                                {item.tag}
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-muted">{getHostname(item.href)}</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted">{item.description}</p>
                      </div>
                      <span className="text-sm text-muted">↗</span>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </>
  );
}
