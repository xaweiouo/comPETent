// options.js
export const SITTER_SERVICE_OPTIONS = [
  { value: '陪伴散步', label: '陪伴散步' },
  { value: '寵物安親', label: '寵物安親' },
  { value: '洗澡美容', label: '洗澡美容' },
  { value: '到府照顧', label: '到府照顧' },
  { value: '寄宿', label: '寄宿' },
  { value: '訓練', label: '訓練' },
]

export const PET_SPECIES_OPTIONS = [
  { value: 'dog', label: '狗' },
  { value: 'cat', label: '貓' },
  { value: 'bird', label: '鳥' },
  { value: 'fish', label: '魚' },
  { value: 'rabbit', label: '兔子' },
  { value: 'rodent', label: '鼠' },   // 例如：倉鼠、天竺鼠
  { value: 'reptiles', label: '爬蟲' }, // 例如：烏龜、蜥蜴
  { value: 'others', label: '其他' },
]

export const WEEKDAY_OPTIONS=[
  {value:'mon',label:'星期一'},
  {value:'tue',label:'星期二'},
  {value:'wed',label:'星期三'},
  {value:'thu',label:'星期四'},
  {value:'fri',label:'星期五'},
  {value:'sat',label:'星期六'},
  {value:'sun',label:'星期日'},
]

export const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => {
  const formatted = i.toString().padStart(2, "0");
  return { value: formatted, label: formatted };
});

export const MINUTE_OPTIONS = [
  { value: '00', label: '00' },
  { value: '30', label: '30' },
]

