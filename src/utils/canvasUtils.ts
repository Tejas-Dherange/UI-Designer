import { canmore } from '@chatgpt/api'; 

export const updateCanvas = (code: string) => {
  canmore.update_textdoc({
    updates: [{ pattern: ".*", multiple: true, replacement: code }],
  });
};
