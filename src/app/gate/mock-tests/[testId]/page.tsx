import { notFound } from "next/navigation";
import { MockTestClient } from "@/components/gate/MockTestClient";
import { getGateMock, getGateQuestion, type GateQuestion } from "@/data/gate";

export default async function GateMockEnginePage({ params }: { params: Promise<{ testId: string }> }) {
  const { testId } = await params;
  const mock = getGateMock(testId);
  if (!mock) notFound();
  const questions = mock.questions
    .map((id) => getGateQuestion(id))
    .filter((question): question is GateQuestion => Boolean(question));
  return <MockTestClient mock={mock} questions={questions} />;
}
