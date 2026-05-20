import { notFound } from "next/navigation";
import { CollegeWorkspace } from "@/app/college/CollegeWorkspace";
import { getCollegeTopic } from "@/lib/college";

export default async function CollegeTopicPage({ params }: { params: Promise<{ course: string; module: string; topic: string }> }) {
  const { course, module, topic } = await params;
  const result = getCollegeTopic(course, module, topic);
  if (!result) notFound();

  return <CollegeWorkspace course={result.course} module={result.module} topic={result.topic} />;
}
