// 设置数据存储
export function saveToLocal (id, key, val) {
  // 用__seller__字段表示一个名称空间，专门用于seller的存储对象
  let seller = window.localStorage.__seller__;
  // 如果这个localStorage中没有__seller__
  if (!seller) {
    seller = {};
    seller[id] = {};
  } else {
    // 因为localStorage存储的是JSON字符串
    seller = JSON.parse(seller);
    console.log('seller');
    console.log(seller);
    // 如果这个localStorage.__seller__中没有seller[id]对象
    if (!seller[id]) {
      seller[id] = {};
    }
  }
  seller[id][key] = val;
  window.localStorage.__seller__ = JSON.stringify(seller);
};
// 读取数据存储
export function loadFromLocal (id, key, def) {
  let seller = window.localStorage.__seller__;
  if (!seller) {
    return def;
  }
  id = JSON.parse(seller)[id];
  if (!id) {
    return def;
  }
  let val = id[key];
  return val || def;
}
