import { getNavigationDocument } from "@/lib/navigation";
import { SearchableNavigation } from "@/components/searchable-navigation";

// 功能入口：首页按“左侧目录 + 右侧分类内容”组织，贴近参考站的信息架构，同时保留更克制的极简风格。
export default async function Home() {
  const document = await getNavigationDocument();

  return (
    <main className="grain flex-1 px-3 py-3 text-foreground sm:px-4 sm:py-4 lg:px-5">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4">
        <SearchableNavigation document={document} />
      </div>
    </main>
  );
}
