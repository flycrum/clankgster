# Common steps: source freshness audit

1. Resolve target and extract documentation URLs from markdown.
2. Capture local claim context around each source URL.
3. Fetch current source content.
4. Compare and classify drift:
   - Changed
   - Removed
   - Added
   - Unchanged
5. Produce urgency-ranked recommendations.
