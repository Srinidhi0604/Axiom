import { PapersBrowser } from "@/components/PapersBrowser";
import type { PaperTrack } from "@/data/papers";
import { PapersWrapper } from "@/components/PapersWrapper";

type ActiveTrack = PaperTrack | "all";

function parseTrack(track: string | string[] | undefined): ActiveTrack {
  const value = Array.isArray(track) ? track[0] : track;
  if (value === "ml" || value === "biology" || value === "chemistry" || value === "electrical" || value === "electronics") return value;
  if (value === "hardware") return "electronics";
  return "all";
}

export default async function PapersPage({
  searchParams,
}: {
  searchParams: Promise<{ track?: string | string[] }>;
}) {
  const params = await searchParams;
  const initialTrack = parseTrack(params.track);

  return (
    <PapersWrapper>
      <PapersBrowser initialTrack={initialTrack} />
    </PapersWrapper>
  );
}
