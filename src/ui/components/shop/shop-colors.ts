// Shop color configuration - black and white theme
export const shopColors = {
  // Primary colors
  primary: {
    black: '#000000',
    white: '#ffffff',
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827'
    }
  },
  
  // Background colors
  background: {
    primary: '#ffffff',
    secondary: '#f9fafb',
    dark: '#000000',
    muted: '#f3f4f6'
  },
  
  // Text colors
  text: {
    primary: '#000000',
    secondary: '#374151',
    muted: '#6b7280',
    inverse: '#ffffff'
  },
  
  // Border colors
  border: {
    primary: '#e5e7eb',
    secondary: '#d1d5db',
    dark: '#000000'
  },
  
  // Button variants
  button: {
    primary: {
      bg: '#000000',
      text: '#ffffff',
      hover: '#374151',
      border: '#000000'
    },
    secondary: {
      bg: '#ffffff',
      text: '#000000',
      hover: '#f9fafb',
      border: '#000000'
    },
    outline: {
      bg: 'transparent',
      text: '#000000',
      hover: '#000000',
      hoverText: '#ffffff',
      border: '#000000'
    }
  },
  
  // Status colors
  status: {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6'
  }
};

// Tailwind class mappings
export const shopClasses = {
  // Backgrounds
  bg: {
    primary: 'bg-white',
    secondary: 'bg-gray-50',
    dark: 'bg-black',
    muted: 'bg-gray-100'
  },
  
  // Text
  text: {
    primary: 'text-black',
    secondary: 'text-gray-700',
    muted: 'text-gray-500',
    inverse: 'text-white'
  },
  
  // Borders
  border: {
    primary: 'border-gray-200',
    secondary: 'border-gray-300',
    dark: 'border-black'
  },
  
  // Buttons
  button: {
    primary: 'bg-black text-white hover:bg-gray-800 border-black',
    secondary: 'bg-white text-black hover:bg-gray-50 border-black border-2',
    outline: 'bg-transparent text-black hover:bg-black hover:text-white border-black border-2'
  }
};