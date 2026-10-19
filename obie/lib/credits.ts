// Credits: what OBIE charges for model work. 1 credit = $0.0015 of model cost.
export const USD_PER_CREDIT = 0.0015;

export function creditsForCost(costUsd: number) {
  return Math.round((costUsd / USD_PER_CREDIT) * 100) / 100;
}

// Up-front estimate per nano task, shown before a plan runs. A writing task is
// one claude-sonnet-5-5 call (~4k tokens in, ~1.5k out, about $0.023); a
// simple one is a claude-haiku-5-5 call.
export const TASK_ESTIMATE = { writing: 16, simple: 2 } as const;

export function formatCredits(n: number) {
  return Math.round(n).toLocaleString();
}
