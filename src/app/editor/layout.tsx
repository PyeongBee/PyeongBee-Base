import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "자소서 에디터 - PyeongBee-Base",
  description: "자소서 작성 및 수정 도구",
};

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="editor-page">
      {children}
    </div>
  );
}
