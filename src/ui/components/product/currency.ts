const USD_TO_LKR = 320;

export function formatLKR(usdPrice: number): string {
  const lkr = Math.round(usdPrice * USD_TO_LKR);
  return `LKR ${lkr.toLocaleString("en-US")}`;
}
