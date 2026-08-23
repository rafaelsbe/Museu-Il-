import { NextResponse } from "next/server";

const AREAS = [
  {
    slug: "historia",
    title: "História",
    description: "Memórias e registros que contam a formação do espaço.",
    colorToken: "--area-1-color",
    images: [],
  },
  {
    slug: "religiao",
    title: "Religião",
    description: "Espaço dedicado às práticas e saberes religiosos.",
    colorToken: "--area-2-color",
    images: [],
  },
  {
    slug: "arte",
    title: "Arte",
    description: "Acervo artístico e registros visuais.",
    colorToken: "--area-3-color",
    images: [],
  },
  {
    slug: "memoria",
    title: "Memória",
    description: "Documentos, depoimentos e arquivos.",
    colorToken: "--area-4-color",
    images: [],
  },
];

export async function GET() {
  return NextResponse.json(AREAS);
}
