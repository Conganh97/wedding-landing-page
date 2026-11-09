import fs from "fs";
import path from "path";
import { Mau21Page } from "@/components/mau21/Mau21Page";

export default function Home() {
  const html = fs.readFileSync(path.join(process.cwd(), "lib/mau21/body.html"), "utf8");
  return (
    <>
      <link rel="stylesheet" href="/mau21.css?v=5" />
      <Mau21Page html={html} />
    </>
  );
}
