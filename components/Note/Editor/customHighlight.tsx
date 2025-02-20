import { Highlight } from "@tiptap/extension-highlight";

export const CustomHighlight = Highlight.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      color: {
        default: null,
        parseHTML: (element) => {
          const bgColor = element.style.backgroundColor;
          return bgColor || null;
        },
        renderHTML: (attributes) => {
          if (!attributes.color) return {};
          return {
            style: `background-color: ${attributes.color}; color:inherit`,
          };
        },
      },
      bgOpacity: {
        default: 1,
        parseHTML: (element) => {
          const bgColor = element.style.backgroundColor;
          if (bgColor.startsWith("rgba")) {
            return parseFloat(bgColor.split(",")[3]) || 1;
          }
          return 1;
        },
        renderHTML: (attributes) => {
          if (!attributes.color) return {};
          const rgb = getRGB(attributes.color);
          if (!rgb) {
            return {};
          }
          const [r, g, b] = rgb;
          return {
            style: `background-color: rgba(${r}, ${g}, ${b}, ${attributes.bgOpacity});`,
          };
        },
      },
    };
  },
});

/**
 * Convert HEX or RGB to RGB array
 */
const getRGB = (color: string) => {
  if (color.startsWith("rgb")) {
    return color.match(/\d+/g)?.slice(0, 3);
  } else if (color.startsWith("#")) {
    let r, g, b;
    if (color.length === 4) {
      r = parseInt(color[1] + color[1], 16);
      g = parseInt(color[2] + color[2], 16);
      b = parseInt(color[3] + color[3], 16);
    } else {
      r = parseInt(color.substring(1, 3), 16);
      g = parseInt(color.substring(3, 5), 16);
      b = parseInt(color.substring(5, 7), 16);
    }
    return [r, g, b];
  }
  return [255, 255, 0]; // Default to yellow if color parsing fails
};
