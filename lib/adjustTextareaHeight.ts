import React from "react";

const adjustTextareaHeight = (
  textareaRef: React.RefObject<null | HTMLTextAreaElement>
) => {
  const textarea = textareaRef.current;
  if (textarea) {
    console.log(textarea.scrollHeight);

    // Reset height to min to accurately calculate new height
    textarea.style.height = "1rem";
    // Set new height based on scrollHeight
    if (textarea.scrollHeight !== 0)
      textarea.style.height = `${textarea.scrollHeight}px`;
  }
};

export default adjustTextareaHeight;
