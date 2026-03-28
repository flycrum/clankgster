# Common steps: external links audit

1. Resolve target and collect markdown files.
2. Extract external URLs and deduplicate.
3. Fetch each unique URL and classify:
   - OK
   - Redirect
   - Not Found
   - Error
   - Auth Required
4. Report grouped by URL with source file mapping.
