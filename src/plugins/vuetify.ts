// plugins/vuetify.ts
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { createVuetify } from "vuetify";

const customTheme = {
  dark: false,
  colors: {
    primary: "#526e48",
  },
};

export default createVuetify({
  theme: {
    defaultTheme: "light",
    themes: {
      light: customTheme,
    },
  },
});
