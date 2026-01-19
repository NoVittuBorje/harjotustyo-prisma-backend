function formatNumber(num) {
  const sign = Math.sign(num);
  if (sign > 0) {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    }
  }
  if (sign < 0) {
    if (num <= -1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    }
  }

  return num;
}
export default formatNumber;
