import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Fyt Teknoloji Merkezi",
    short_name: "FYT",
    description: "Teknolojide tek adres, çözümde tek merkez.",
    start_url: "/",
    display: "standalone",
    background_color: "#041428",
    theme_color: "#00FF9F",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "64x64",
        type: "image/x-icon",
      },
    ],
  };
}
