import { ProjectColor } from "@prisma/client";

export const projectColorMap: {
  name: string;
  value: ProjectColor;
  tailwind: string;
}[] = [
  { name: "Red", value: "RED", tailwind: "bg-accent-red" },
  { name: "Orange", value: "ORANGE", tailwind: "bg-accent-orange" },
  { name: "Yellow", value: "YELLOW", tailwind: "bg-accent-yellow" },
  { name: "Lime", value: "LIME", tailwind: "bg-accent-lime" },
  { name: "Blue", value: "BLUE", tailwind: "bg-accent-blue" },
  { name: "Purple", value: "PURPLE", tailwind: "bg-accent-purple" },
  { name: "Pink", value: "PINK", tailwind: "bg-accent-pink" },
  { name: "Teal", value: "TEAL", tailwind: "bg-accent-teal" },
  { name: "Coral", value: "CORAL", tailwind: "bg-accent-coral" },
  { name: "Gold", value: "GOLD", tailwind: "bg-accent-gold" },
  { name: "Deep Blue", value: "DEEP_BLUE", tailwind: "bg-accent-deep-blue" },
  { name: "Rose", value: "ROSE", tailwind: "bg-accent-rose" },
  { name: "Light Red", value: "LIGHT_RED", tailwind: "bg-accent-light-red" },
  { name: "Brick", value: "BRICK", tailwind: "bg-accent-brick" },
  { name: "Slate", value: "SLATE", tailwind: "bg-accent-slate" },
];
