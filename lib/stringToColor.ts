const stringToColor = (str: string) => {
  let hash = 0;

  // 使用字串的每個字符計算 hash
  for (let i = 0; i < str.length; i++) {
    // 獲取字串中每個字符的 Unicode 編碼
    hash = str.charCodeAt(i) + ((hash << 5) - hash); // << 將 charCodeAt() 出的位數左移 5 位
    // 減去原始的 hash
  }

  // 將 hash 轉換為 hex
  const c = (hash & 0x00ffffff).toString(16).toUpperCase(); // 生成 hex 代碼範圍內的整數

  // 碼確保生成的 hex 代碼永遠是 6 位數
  return "#" + "00000".substring(0, 6 - c.length) + c; // c 的長度小於 6 位數，使用 "00000" 在開頭補齊
};

export default stringToColor;
