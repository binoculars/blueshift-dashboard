import { ReactNode } from "react";
import { PathContentProvider } from "@/app/contexts/PathContentContext";
import PathContextNotice from "@/app/components/PathsContent/PathContextNotice";

interface PathContentLayoutProps {
  children: ReactNode;
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export default async function PathContentLayout({
  children,
  params,
}: PathContentLayoutProps) {
  const { slug } = await params;

  return (
    <PathContentProvider pathSlug={slug}>
      <PathContextNotice pathSlug={slug} />
      {children}
    </PathContentProvider>
  );
}
