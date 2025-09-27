// Design System Constants
export const DESIGN_SYSTEM = {
  colors: {
    background: '#F6F8FC',
    primary: '#1E2A38',
    accent: {
      blue: '#3A86FF',
      blueDark: '#1E5BFF',
      green: '#06C755',
      greenDark: '#05A84A'
    }
  },
  
  // Typography
  typography: {
    heading: 'font-extrabold text-[#1E2A38] font-inter',
    subheading: 'font-bold text-[#1E2A38]',
    body: 'text-[#1E2A38]',
    bodyLight: 'text-[#1E2A38]/70',
    label: 'text-sm font-medium text-[#1E2A38]'
  },
  
  // Spacing & Layout
  spacing: {
    container: 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8',
    cardPadding: 'p-8',
    sectionGap: 'space-y-8'
  },
  
  // Cards
  card: {
    base: 'bg-white rounded-[20px] shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-gray-100',
    hover: 'hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] hover:-translate-y-2 transition-all duration-500 ease-out'
  },
  
  // Buttons
  button: {
    primary: {
      blue: 'bg-[#3A86FF] text-white hover:bg-[#1E5BFF] shadow-[0_4px_15px_rgba(58,134,255,0.3)] hover:shadow-[0_6px_20px_rgba(58,134,255,0.4)]',
      green: 'bg-[#06C755] text-white hover:bg-[#05A84A] shadow-[0_4px_15px_rgba(6,199,85,0.3)] hover:shadow-[0_6px_20px_rgba(6,199,85,0.4)]'
    },
    secondary: 'bg-gray-100 text-[#1E2A38] hover:bg-gray-200',
    base: 'px-4 py-3 rounded-[12px] font-medium transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed'
  },
  
  // Form Elements
  input: {
    base: 'w-full border border-gray-300 rounded-[12px] px-4 py-3 focus:ring-2 focus:border-transparent transition-all duration-300',
    focus: {
      blue: 'focus:ring-[#3A86FF] focus:border-[#3A86FF]',
      green: 'focus:ring-[#06C755] focus:border-[#06C755]'
    }
  },
  
  // Icons
  icon: {
    container: {
      blue: 'bg-[#3A86FF]/10',
      green: 'bg-[#06C755]/10'
    },
    color: {
      blue: 'text-[#3A86FF]',
      green: 'text-[#06C755]'
    }
  },
  
  // Links
  link: {
    primary: 'text-[#1E2A38] hover:text-[#3A86FF] transition-colors duration-300',
    accent: 'text-[#3A86FF] hover:text-[#1E5BFF] font-medium transition-colors duration-300'
  }
};

// Helper function to get button classes
export function getButtonClasses(variant: 'primary-blue' | 'primary-green' | 'secondary', additionalClasses = '') {
  const baseClasses = DESIGN_SYSTEM.button.base;
  const variantClasses = {
    'primary-blue': DESIGN_SYSTEM.button.primary.blue,
    'primary-green': DESIGN_SYSTEM.button.primary.green,
    'secondary': DESIGN_SYSTEM.button.secondary
  };
  
  return `${baseClasses} ${variantClasses[variant]} ${additionalClasses}`;
}

// Helper function to get input classes
export function getInputClasses(focusColor: 'blue' | 'green' = 'blue', additionalClasses = '') {
  return `${DESIGN_SYSTEM.input.base} ${DESIGN_SYSTEM.input.focus[focusColor]} ${additionalClasses}`;
}
