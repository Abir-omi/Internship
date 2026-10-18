// Formatter utilities for BDT Currency and Bangla/English text

export const formatBDT = (amount: number, showSymbol: boolean = true): string => {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return showSymbol ? '৳ 0' : '0';
  }
  
  // Format with South Asian numbering system (lakh, crore)
  const isNegative = amount < 0;
  const absVal = Math.abs(Math.round(amount));
  const str = absVal.toString();
  
  let formatted = '';
  if (str.length <= 3) {
    formatted = str;
  } else {
    const lastThree = str.substring(str.length - 3);
    const rest = str.substring(0, str.length - 3);
    const withCommas = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    formatted = withCommas + ',' + lastThree;
  }
  
  const sign = isNegative ? '-' : '';
  return showSymbol ? `${sign}৳ ${formatted}` : `${sign}${formatted}`;
};

export const formatDate = (dateStr?: string): string => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
};

export const numberToEnglishWords = (num: number): string => {
  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const n = Math.floor(Math.abs(num));
  if (n === 0) return 'Zero Taka Only';

  const convertGroup = (val: number): string => {
    let out = '';
    if (val >= 100) {
      out += a[Math.floor(val / 100)] + ' Hundred ';
      val %= 100;
    }
    if (val >= 20) {
      out += b[Math.floor(val / 10)] + ' ';
      val %= 10;
    }
    if (val > 0) {
      out += a[val] + ' ';
    }
    return out.trim();
  };

  let words = '';
  // South Asian scale: Crore (1,00,00,000), Lakh (1,00,000), Thousand (1,000), Rest
  const crore = Math.floor(n / 10000000);
  const remainderCrore = n % 10000000;
  const lakh = Math.floor(remainderCrore / 100000);
  const remainderLakh = remainderCrore % 100000;
  const thousand = Math.floor(remainderLakh / 1000);
  const remainderThousand = remainderLakh % 1000;

  if (crore > 0) words += convertGroup(crore) + ' Crore ';
  if (lakh > 0) words += convertGroup(lakh) + ' Lakh ';
  if (thousand > 0) words += convertGroup(thousand) + ' Thousand ';
  if (remainderThousand > 0) words += convertGroup(remainderThousand) + ' ';

  return words.trim() + ' Taka Only';
};

export const generateId = (prefix: string = 'ID'): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${timestamp}-${rand}`;
};
