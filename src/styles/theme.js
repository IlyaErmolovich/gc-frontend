const theme = {
  colors: {
    background: '#202020',        // Dark background
    backgroundSecondary: '#1E1E1E',
    text: '#FFFFFF',
    textSecondary: '#AAAAAA',
    primary: '#20B2AA',           // Turquoise color from references
    secondary: '#188F89',         // Darker turquoise for hover states
    error: '#FF5252',
    success: '#4CAF50',
    cardBg: '#2D2D2D',            // Darker card background
    warning: '#FFC107',           // Yellow color for stars
  },
  fonts: {
    primary: "'Roboto', sans-serif",
  },
  fontSizes: {
    small: '0.875rem',      // 14px
    normal: '0.95rem',      // ~15px
    medium: '1rem',         // 16px
    large: '1.25rem',       // 20px
    xlarge: '1.5rem',       // 24px
    xxlarge: '2rem',        // 32px
  },
  breakpoints: {
    mobile: '576px',
    tablet: '768px',
    laptop: '992px',
    desktop: '1200px',
  },
  shadows: {
    small: '0 2px 4px rgba(0, 0, 0, 0.2)',
    medium: '0 4px 8px rgba(0, 0, 0, 0.3)',
    large: '0 8px 16px rgba(0, 0, 0, 0.4)',
  },
  transitions: {
    short: '0.2s',
    medium: '0.4s',
    long: '0.6s',
  },
  radius: {
    small: '4px',
    medium: '8px',
    large: '12px',
    circle: '50%',
  },
};

export default theme; 