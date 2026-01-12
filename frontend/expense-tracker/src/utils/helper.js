export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getInitials = (fullName) => {
  if (!fullName) return "U";

  const words = fullName.split(" ");
  let initials = words[0].charAt(0).toUpperCase();

  for (let i = 1; i < words.length; i++) {
    if (words[i].length > 0 && initials.length < 2) {
      initials += words[i].charAt(0).toUpperCase();
    }
  }

  return initials;
};

export const addThousandSeparators = (number) => {
  if (number == null || isNaN(number)) return "";

  const parts = number.toString().split(".");
  const integerPart = parts[0];
  const fractionalPart = parts[1];

  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  
  return fractionalPart ? `${formattedInteger}.${fractionalPart}` : formattedInteger;
};

// Icon mapping for different categories and sources
export const getCategoryIcon = (category, type) => {
  if (type === 'expense') {
    const categoryMap = {
      'food': '🍔',
      'groceries': '🛒',
      'transportation': '🚗',
      'shopping': '🛍️',
      'entertainment': '🎬',
      'health': '🏥',
      'education': '📚',
      'bills': '📄',
      'rent': '🏠',
      'utilities': '💡',
      'travel': '✈️',
      'gym': '💪',
      'clothing': '👔',
      'insurance': '🛡️',
      'phone': '📱',
      'internet': '🌐',
      'subscriptions': '📺',
      'gifts': '🎁',
      'other': '💰',
    };
    return categoryMap[category?.toLowerCase()] || '💸';
  } else {
    const sourceMap = {
      'salary': '💼',
      'freelance': '💻',
      'business': '🏢',
      'investment': '📈',
      'bonus': '🎉',
      'gift': '🎁',
      'rental': '🏘️',
      'dividends': '💹',
      'interest': '🏦',
      'pension': '👴',
      'refund': '↩️',
      'cashback': '💳',
      'side hustle': '🚀',
      'other': '💰',
    };
    return sourceMap[category?.toLowerCase()] || '💵';
  }
};            
