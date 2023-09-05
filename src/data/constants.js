
const typographyPrefs = {
    fontSize: 10,
    h1: {
      fontSize: 38,
    },
    h2: {
      fontSize: 30,
    },
    h3: {
      fontSize: 23,
    },
    h4: {
      fontSize: 18,
    },
    h5: {
      fontSize: 14,
    },
    h6: {
      fontSize: 12,
    }
};

const materialUITheme =  {
  palette: {
      mode: "light",
      primary: {
          dark: "#B114E6",
          main: "#D26AFF",
          light: "#ECD3FF",
      },
      neutral: {
          dark: "#6E6E6E",
          main: "#858585",
          mediumMain: "#9E9E9E",
          medium: "#B9B9B9",
          light: "#F2F2F2",
      },
      background: {
          default: "#E6E6E6",
          alt: "#FFFFFF",
      }
  },
  typography: typographyPrefs
};

export { materialUITheme};