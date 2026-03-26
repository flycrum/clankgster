/** Shared helper functions used by markdown sync-fs content pipeline. */
export const syncFsContentPipelineConfig = {
  /** Restores escaped template delimiters from markdown stringification. */
  restoreEscapedTemplateTokens(markdown: string): string {
    return markdown.replace(/\\\[\\\[\\\[([\s\S]*?)]]]/g, (_match, inner) => {
      const restoredInner = String(inner).replace(/\\_/g, '_').replace(/\\\]/g, ']');
      return `[[[${restoredInner}]]]`;
    });
  },
};
