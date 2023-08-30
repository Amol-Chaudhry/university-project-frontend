const colorPalette = {
  app_color1: "#F7F1FF", //50
  app_color2: "#F3E5FF", //100
  app_color3: "#ECD3FF", //200
  app_color4: "#E3BEFF", //300
  app_color5: "#DB9CFF", //400
  app_color6: "#D26AFF", //500
  app_color7: "#C540FF", //600
  app_color8: "#B114E6", //700
  app_color9: "#8F00B4", //800
  app_color10: "#690083", //900
    white: "#FFFFFF",
    black: "#000000",
    gray_1: "#FAFAFA", //10
    gray_2: "#F2F2F2", //50
    gray_3: "#E6E6E6", //100
    gray_4: "#CFCFCF", //200
    gray_5: "#B9B9B9", //300
    gray_6: "#9E9E9E", //400
    gray_7: "#858585", //500
    gray_8: "#6E6E6E", //700
    gray_9:  "#4D4D4D", //800
    gray_10: "#262626" //900
};

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
          dark: colorPalette.app_color8,
          main: colorPalette.app_color6,
          light: colorPalette.app_color1,
      },
      neutral: {
          dark: colorPalette.gray_8,
          main: colorPalette.gray_7,
          mediumMain: colorPalette.gray_6,
          medium: colorPalette.grey_5,
          light: colorPalette.gray_2,
      },
      background: {
          default: colorPalette.gray_3,
          alt: colorPalette.white,
      }
  },
  typography: typographyPrefs
};

export {colorPalette, materialUITheme};