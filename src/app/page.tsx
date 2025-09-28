import { Card, CardTitle, CardDescription } from "../components/common/Card";
import { SectionTitle, SectionDescription } from "../components/common/Section";
import { Button } from "../components/common/Button";
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/editor");
}
