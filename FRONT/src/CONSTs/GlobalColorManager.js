export const GLOABL_COLOR_MANAGER = () => {
  const DARK_THEME = {
    onhover_forground: "#494949",
    hidden_forground: "#383838",
    deep_hidden_forground: "#1E1E1E",
    background: "#181818",

    player_1_checker: "#49577A",
    player_2_checker: "#AB6B1A",
  };
  const LIGHT_THEME = {
    onhover_forground: "#E38B29",
    hidden_forground: "#F1A661",
    deep_hidden_forground: "#E1D7C6",
    background: "#E7DFD1",

    player_1_checker: "#6F4E37",
    player_2_checker: "#C39898",
  };

  return { DARK_THEME: DARK_THEME, LIGHT_THEME: LIGHT_THEME };
};
