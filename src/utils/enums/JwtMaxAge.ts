// TODO: Bring back to original
enum JwtMaxAge {
  // Access = 10, // 10s
  // Refresh = 200000, // 20s
  Access = 60 * 15, // 15min
  Refresh = 60 * 60 * 24 * 7, // 1week
}

export { JwtMaxAge };
