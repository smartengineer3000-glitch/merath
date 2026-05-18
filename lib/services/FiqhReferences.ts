export const FIQH_NOTES: Record<string, Record<string, string>> = {
  hanafi: {
    grandfather_with_siblings: "In the Hanafi school, the grandfather blocks all siblings. He takes the entire estate after other sharers.",
    mother_with_father_children: "Mother receives 1/6 if there are children or multiple siblings.",
    spouse_radd: "Hanafi school applies Radd (return) to the spouse if there is leftover estate.",
  },
  maliki: {
    grandfather_with_siblings: "Maliki school uses Musharaka: grandfather shares with siblings, choosing the option most beneficial to him (muqasamah, third, or sixth).",
    mother_with_father_children: "Mother gets 1/6.",
    spouse_radd: "Maliki school applies Radd to the spouse.",
  },
  shafii: {
    grandfather_with_siblings: "Shafi'i school: grandfather blocks siblings completely, taking all that remains.",
    mother_with_father_children: "Mother receives 1/6.",
    spouse_radd: "Shafi'i school does NOT apply Radd to the spouse; surplus goes to the treasury.",
  },
  hanbali: {
    grandfather_with_siblings: "Hanbali school: grandfather shares with siblings via Musharaka.",
    mother_with_father_children: "Mother receives 1/6.",
    spouse_radd: "Hanbali does NOT apply Radd to the spouse.",
  },
};
