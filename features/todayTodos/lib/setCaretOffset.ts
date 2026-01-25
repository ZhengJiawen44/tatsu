export function setCaretOffset(el: HTMLElement, offset: number) {
  const selection = window.getSelection();
  if (!selection) return;

  let current = 0;
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);

  let node: Node | null;
  while ((node = walker.nextNode())) {
    const len = node.textContent?.length ?? 0;

    if (current + len >= offset) {
      const range = document.createRange();
      range.setStart(node, offset - current);
      range.collapse(true);

      selection.removeAllRanges();
      selection.addRange(range);
      return;
    }

    current += len;
  }
}
