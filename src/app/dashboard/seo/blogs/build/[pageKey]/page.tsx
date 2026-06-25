import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { ContentPageModel } from "@/models/ContentPage";
import { BuildClient } from "./BuildClient";
import type { BuilderPageData } from "./shared/saveBlog";

export const dynamic = "force-dynamic";

type PageProps = {
  params: { pageKey: string };
  searchParams: { mode?: string };
};

export default async function BlogBuildPage({ params, searchParams }: PageProps) {
  const decodedKey = decodeURIComponent(params.pageKey);
  if (!decodedKey.startsWith("blog/")) {
    notFound();
  }

  await connectDB();
  const doc = await ContentPageModel.findOne({ pageKey: decodedKey }).lean();
  if (!doc) {
    notFound();
  }

  const page: BuilderPageData = {
    pageKey: doc.pageKey,
    status: doc.status === "published" ? "published" : "draft",
    meta: doc.meta as BuilderPageData["meta"],
    sections: (doc.sections ?? []) as BuilderPageData["sections"],
  };

  return (
    <BuildClient page={page} mode={searchParams.mode ?? "choose"} />
  );
}
