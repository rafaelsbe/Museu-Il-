import { NextResponse } from "next/server";

type Area = {
  slug: string;
  title: string;
  description: string;
  colorToken: string;
  images: { src: string; alt: string }[];
};

const DETAILS: Record<string, Area> = {
  historia: {
    slug: "historia",
    title: "História",
    description: "Detalhes sobre a história do barracão e do espaço.",
    colorToken: "--area-1-color",
    images: [
      { src: "/images/historia-1.jpg", alt: "História 1" },
    ],
  },
  religiao: {
    slug: "religiao",
    title: "Religião",
    description: "Textos e arquivos sobre práticas religiosas.",
    colorToken: "--area-2-color",
    images: [
      { src: "/images/religiao-1.jpg", alt: "Religião 1" },
    ],
  },
  arte: {
    slug: "arte",
    title: "Arte",
    description: "Acervo artístico e exposições.",
    colorToken: "--area-3-color",
    images: [
      { src: "/images/arte-1.jpg", alt: "Arte 1" },
    ],
  },
  memoria: {
    slug: "memoria",
    title: "Memória",
    description: "Depoimentos e arquivos de memória.",
    colorToken: "--area-4-color",
    images: [
      { src: "/images/memoria-1.jpg", alt: "Memória 1" },
    ],
  },
};

export async function GET(_request: Request, { params }: { params: Promise<{ area: string }> }) {
  const { area } = await params;
  const data = DETAILS[area];
  if (!data) return NextResponse.json({ error: "Área não encontrada" }, { status: 404 });
  return NextResponse.json(data);
}
