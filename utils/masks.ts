export const formatCurrency = (value: string): string => {
  const numbers = value.replace(/[^\d]/g, '');
  
  if (!numbers) return '';
  
  const cents = parseInt(numbers, 10);
  const reais = cents / 100;
  
  return reais.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const formatCurrencyInput = (text: string): string => {
  const numbers = text.replace(/[^\d]/g, '');
  
  if (!numbers) return '';
  
  const cents = parseInt(numbers, 10);
  const reais = cents / 100;
  
  return reais.toFixed(2).replace('.', ',');
};

export const parseCurrency = (value: string): number => {
  const cleanValue = value.replace(/[^\d,]/g, '').replace(',', '.');
  return parseFloat(cleanValue) || 0;
};

export const formatDate = (value: string): string => {
  const numbers = value.replace(/[^\d]/g, '');
  
  if (!numbers) return '';
  
  if (numbers.length <= 2) {
    return numbers;
  }
  
  if (numbers.length <= 4) {
    const day = numbers.slice(0, 2);
    const month = numbers.slice(2);
    if (parseInt(day) > 31) return numbers.slice(0, 1);
    return `${day}/${month}`;
  }
  
  const day = numbers.slice(0, 2);
  const month = numbers.slice(2, 4);
  const year = numbers.slice(4, 8);
  
  if (parseInt(day) > 31) return numbers.slice(0, 1);
  if (parseInt(month) > 12) return `${day}/${numbers.slice(3, 4)}`;
  
  return `${day}/${month}${year ? '/' + year : ''}`;
};


export const formatDateToAPI = (value: string): string => {
  const numbers = value.replace(/[^\d]/g, '');
  
  if (numbers.length === 8) {
    const day = numbers.slice(0, 2);
    const month = numbers.slice(2, 4);
    const year = numbers.slice(4, 8);
    return `${year}-${month}-${day}`;
  }
  
  return value;
};

export const formatDateFromAPI = (value: string): string => {
  if (!value) return '';
  const [year, month, day] = value.split('-');
  return `${day}/${month}/${year}`;
};

export const formatPhone = (value: string): string => {
  const numbers = value.replace(/[^\d]/g, '');
  
  if (!numbers) return '';
  
  if (numbers.startsWith('55')) {
    const countryCode = numbers.slice(0, 2);
    const ddd = numbers.slice(2, 4);
    const firstPart = numbers.slice(4, 9);
    const secondPart = numbers.slice(9, 13);
    
    if (numbers.length <= 2) {
      return `+${countryCode}`;
    }
    
    if (numbers.length <= 4) {
      return `+${countryCode} (${ddd}`;
    }
    
    if (numbers.length <= 9) {
      return `+${countryCode} (${ddd}) ${firstPart}`;
    }
    
    return `+${countryCode} (${ddd}) ${firstPart}-${secondPart}`;
  }
  
  if (numbers.length <= 2) {
    return numbers;
  }
  
  if (numbers.length <= 7) {
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  }
  
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
};

export const parsePhone = (value: string): string => {
  return value.replace(/[^\d+]/g, '');
};

