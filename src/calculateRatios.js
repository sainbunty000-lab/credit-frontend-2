export function calculateRatios(data) {
  const bs = data.balance_sheet;
  const pnl = data.pnl;

  return {
    current_ratio: bs.current_assets / bs.current_liabilities || 0,
    net_margin: pnl.net_profit / pnl.revenue || 0
  };
}
