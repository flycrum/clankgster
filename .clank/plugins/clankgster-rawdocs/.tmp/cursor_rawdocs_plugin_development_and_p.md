# Rawdocs plugin development and planning
_Exported on 3/28/2026 at 09:54:20 CDT from Cursor (2.6.21)_

---

**User**

I want to add a new concept to our @.clank/plugins/clankgster-capo , which as a reminder, does this @.clank/plugins/clankgster-capo/.claude-plugin/plugin.json:4 currently. The new idea is called "rawdocs/`. Here's the gist:
- this is going to be a new plugin located in @.clank/plugins 
- the name of the plugin will be `clankgster-rawdocs`
- it is closely related and dependent upon the @.clank/plugins/clankgster-capo plugin and its content (it's not ideal to cross-reference or use markdown links across different plugin boundaries, but we'll make an exception in this case)
- the high-level intent behind this plugin will be to aid in the organization of a user-created plugin (e.g. @.clank/plugins/clankgster-capo/rules/common-organizing-content.md) and even related to some of the decision making that @.clank/plugins/clankgster-capo/skills/common-triage-context-type/SKILL.md 
- but first, I want to note that EVERYTHING in these directions should be captured any documented in a `docs/rawdocs-internal-planning-notes.md` file within its `docs/` folder (too much is beter than too little for documenting our conversation, in that file)
- the purpose of this system, which I want clearly documented, is to allow users to create a plugin but not have to organize and split out the contents themself
- instead, the user would have 1 or more docs in a new `rawdocs/` directory 
- the user would opt into this system, implicitly, by having/creating this `rawdocs/` directory within their plugin -- which would be colocated with these the folders mentioned in this doc: @.clank/plugins/clankgster-capo/rules/common-organizing-content.md:17-22 (in other words, on the same level as them)
- the files in the `rawdocs/` directory would never, never be referenced/linked by other files in its plugin -- hard boundary rule (i.e. `rules/`, `skills/`, `docs/`, `references/`, etc could not and would not ever link to files in this `rawdocs/` directory (EVER, so we need to scream this, maybe make it a `rules/rawdocs-internal-linking.md`)
- the idea is that the files in `rawdocs/` are the "raw input that `clankgster-capo` can take, interpret, organize, split out, and output into a well structured series of plugin folders and files representing the intended context of the raw documents made up in "rawdocs/" but organized into a 'plugin' structure that follows best practices, is efficient, and is effective"
- this also can help the challenge of scaling documentation as to how to organize or architect a plugin of growing content is less of a burden on developers as they can effectively dump information into a file in this `rawdocs/` directory, not worry about structure or how to organize content, and then this `rawdocs` system will take that, process it, and thoughtfull ouput it into well organized plugins content and context

so, a few important things to note:
- our 'rawdocs' system will be powered by skills defined in its own plugin

the primary skill should be named `docsraw-sync-run` will:
1. run the following in a new sub-agent to take either the user's input to their target plugin path OR `rawdocs/` path as INPUT (e.g. using @.clank/plugins/clankgster-capo/skills/skills-write-context/docs/skill-asking-for-user-input.md ...for example like this @.clank/plugins/clankgster-capo/skills/skills-audit-full-suite-skill/resources/skills-target-input.md...but not exactly...we can write our own steps and context for this). And make sure to track the path the user provides as the user's "target plugin" path -- as we'll be referencing it thorough this skill and will need to use it again in later steps.
2. then this skill will run in a new sub-agent (so the context doesn't bleed into the rest of the skill's context window...it needs to be isolated) and will analyze **only** the user's custom plugin's **`rawdocs/`** directory and its contents and context (including nested files). Restricting the analyze step to only this `rawdocs/` is absolutely critical to the success of the OUTPUT. This analyze step, which should be running in a sub-agent, should be done as a separate skill from this `docsraw-sync-run` one and we should name this new analyze skill `docsraw-analyze-raw`. It's job is to:
  a. REFERENCE CAPO: reference the `clankgster-capo` docs on how to create, organize, and write a plugin (it should link to the following markdown files: @.clank/plugins/clankgster-capo/skills/plugins-write-context/SKILL.md )
  b. READ RAWDOCS: read the raw, unstructured file contents (for any text-based file format; don't try to read non-text files like images, binary, zip, etc) within the target plugin's `rawdocs/` directory and determine the high-level themes and objectives from the raw docs (e.g. typescript, convert figma to code, ui design, testing, publish to npm, deploy to CI, monorepo conventions, error debugging, security compliance, security scanning, frontend playbook, backend playbook, git pr workflows, how to documentation, database design, database migration, codebase cleanup, accessibility and compliance...just to name a few). Pay attention and note the writing style (very important), tone, habits, preference for single-quotes vs double-quotes for code, how section headers are written, and more so we can capture this and use it to guide future writing steps.
  c. RESEARCH THEME: do a web research for how others have written similar plugins for the theme and objectives as determined in the prior step
  d. ANALYZE RAWDOCS: now analyze the raw `rawdocs/` contents from the perspective of how it can be organized, how certain content can be logically grouped together, how to break out content into logical files with reasonably focused content, and how to organize the contents of each file in a logical and effective manner. and all of this should be down through the lens and guidance of our `clankgster-capo` plugin's skill on how to write a plugin found here @.clank/plugins/clankgster-capo/skills/plugins-write-context/reference.md ). And you should highly respect the way this content is written. the goal here is not for you be a wordsmith and edit the content. your creativity factor when porting content over from `rawdocs/` should be virtually zero! So, you're "temperature" should be near 0, too. That said, you should feel free to consider spelling and grammar changes, but be very judicious with this and don't over reach & stay in your lane. If it was written a certain way in `rawdocs/` there's a 99.99% chance it was meant to be written that way.
   e. OUTPUT: The output from this sub-agents must be extensive and complete so it can be used in later steps.
3. simultaneously, we can run a separate new sub-agent (so the context doesn't bleed into the rest of the skill's context window...it needs to be isolated) and will read all other contents and context (including nested), within that same custom plugin, excluding the **`rawdocs/`** directory. Restricting which folders/files in this analyze step is equally as important as the last to make sure not to re-analyze the `rawdocs/` directory from the prior step). This analyze step, which should be running in a sub-agent, should be done as a separate skill from this `docsraw-sync-run` one and we should name this new analyze skill `docsraw-analyze-existing`. It's job is to:
  a. IDENTIFY THE PLUGIN'S CURRENT STRUCTURE: recursively scan and formulate a site-map of the current file structure for the files/folders in the target plugin (VERY IMPORTANT: excluding the `rawdocs/` directory, never scan or include the `rawdocs/`) and determine the high-level organization and themes. Note: it is perfect acceptable and even expected that a plugin may be empty or near empty -- except for the `rawdocs/` directory (which we don't read or factor into this step...we need to treat it as if it doesn't exist) for a variety of reasons (it's new, it's immature, it didn't have much content before). This is okay, and if the directory is empty, we should skip the following sub-steps and return the final OUTPUT back from this sub-agent to its parent agent that this plugin is "New and or empty" and that it should proceed with the rest of the sync "from scratch"
  b. READ THE REST OF THE PLUGIN: if the rest of the plugin is empty (aside from the `rawdocs/`, which is excluded from being processed or considered here) then skip this step. Otherwise, recursively read and understand all the folders and each text-based file's general outline, context, purpose, organization style within a file, writing style (very important), tone, habits, preference for single-quotes vs double-quotes for code, how section headers are written, etc (this is only for text-based files; don't try to read non-text files like images, binary, zip, etc) . The goal here is to collect as much high-level information to maintain consistency when we try to apply new additions/changes/removals to existing files/folders. And it's very important to maintain the same writing style! But, very importantly, the goal here is NOT to retain the specific contents and textual details within files (aside from those mentioned before like sections headers and purpose). In fact, I explicitly forbid from including too many specific textual inclusions from existing files in the final OUTPUT -- except for those that capture & describe the file's general purpose, outline of section headers, and other critical notes (as you deem necessary).
   c. OUTPUT: The output from this sub-agents must be extensive and complete so it can be used in later steps.
4. It's important that in this step in the skill that we wait for the results of the last two skills. Together, those two prior analyze steps (the first analyze step: only the `rawdocs/` directory for the target plugin; the second analyze step: all folders/files except for `rawdocs/` for the target plugin) should collectively analyze all the folders/files and their contents (nested/recursively), without overlap of which files/folders each analyze step reads, and form the complete picture of the target plugin the user provided via the first step's input. 
5. Once we have the final response OUTPUT from both of the two analyze steps, `docsraw-analyze-raw` and `docsraw-analyze-existing`, it's time to THOUGHTFULLY combine them into a single plan to:
  - update all of the files/folders/contents of all of the target plugin EXCEPT the `rawdocs/` (which we should as-is, unaltered, unmodified)
  - this means treating the contents, as read and analyzed from `docsraw-analyze-raw`, as the source of truth, but not its folder/file structure (which we don't want to reflect the `rawdocs/` directory's organization of files in this step). And you should highly respect the way this content is written. the goal here is not for you be a wordsmith and edit the content. your creativity factor when porting content over from `rawdocs/` should be virtually zero! So, you're "temperature" should be near 0, too. That said, you should feel free to consider spelling and grammar changes, but be very judicious with this and don't over reach & stay in your lane. If it was written a certain way in `rawdocs/` there's a 99.99% chance it was meant to be written that way.
  - and this means respecting and treating the existing plugin's file structure and organization, as read and analyzed in `docsraw-analyze-existing`, as the guiding light for our updates. I want you to be strategic here. We want to use the existing plugin's file structure and organization for reference because it's important to **provide consistency and continuity** from sync to sync as we execute this `docsraw-sync-run` skill over and over again, but it's important that it can **evolve and scale** as the contents in `rawdocs/` grows and changes over time. So, you need to decide when to restructure content, adust file structure, move things around, combine content into a file, split out previous file into separate-focused files, change names, re-express purpose, etc. Think like a software architect who's looking out for the long term, always reevaluating how things should be organized and documented, but while also understanding and valuing consistency and continuity.
6. Once we've formed the plan, we need to do a second "refinement" pass at the formed plan. This "refinement" step should be highly stategic with an eye towards continuity between syncs skills execution for the existing folders/files so the final OUTPUT from this sync is consistent, feels like an extension of what came before, respects the prior general structure of folders/files as well as specific file's general outline of content and purpose, but also identifies when it's time to scale and evolve. And please respect writing style (very important), tone, habits, preference for single-quotes vs double-quotes for code, how section headers are written, etc.
7. Now that we have our final refined plan, it's time to make sure we remove the risk of the old, existing files/folders/contents bleeding into our new change. To do this, recursively remove all of the folders/files of the user's target plugin path (aka, the path as provided as user input at the start of our `docsraw-sync-run` skill's steps) except for the `rawdocs/` (it's extremely important that we don't delete `rawdocs/` !!!)
8. Now that our user's target plugin directory is clear/clean, with just the `rawdocs/` folders and its contents remaining, it's time to write its new folders/files and content from the final refined plan.
9. Once complete, 

You may notice that I repeated bring up and remind the LLM for that the `rawdocs/` is to be excluded from consideration for a particular step. This is important to keep, so don't remove those just because they're redundant, please.

I want these skills to be extremely thorough and extensive. Don't cut out any context or purpose or specifics that we talk about! Over documenting is better than under for this effort! I want all skills and documentation created here to be verbose and thorough. I'm okay with it not being concise just for the sake of being concise!

Once you've generated a plan, do another pass of refinement following all of the directions above with special guidance and respect given to the precise instructions given and taking particular care in documentating all of it. I will want to save this plan and I want a lot of my exact words and intentions included. In fact, I'd suggest you write the plan how you normally would, but include a transcript of my original instructions at the bottom (this should be a nearly verbatim transcript of this prompt, but I would like you to make small spelling and grammar corrections...or if I said one thing, but you know I meant something slightly different based on surrounding context)

---

**Cursor**

I’m going to gather structure and convention context first so the plan matches this repo’s plugin patterns exactly, then I’ll draft a detailed implementation plan plus a refined pass and a near-verbatim instruction transcript section as requested.

I found the main conventions and there are no existing `rawdocs` artifacts yet, so next I’m pulling a few source files directly to anchor the plan against exact plugin patterns and guardrails.

---

**User**

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

**Cursor**

I’m starting implementation now and will work through every existing to-do in order, marking each `in_progress`/`completed` as I go. First I’m loading the plugin-writing skill guidance so the new `clankgster-rawdocs` plugin follows repo conventions exactly.

I’ve started the first to-do and marked it in progress. Next I’m scaffolding the new plugin files/folders and aligning manifests/README style to existing plugins before moving to rules and skills.

I confirmed `clankgster-rawdocs` doesn’t exist yet, so I’m now creating the plugin skeleton and metadata files first, then I’ll move to hard-boundary rules and the three skills.

Bootstrap files are in place (`README` + both manifests). I’m now implementing the two hard-boundary rule files so the “never link to `rawdocs/`” and “never delete/modify `rawdocs/` during sync” constraints are encoded first.

The first two to-dos are complete. I’m now writing `docsraw-analyze-raw` with a strict rawdocs-only scope guard, an extensive output schema, and explicit capo-reference requirements.

`docsraw-analyze-raw` is complete. I’m now building `docsraw-analyze-existing` with an explicit “exclude rawdocs entirely” contract and the required “New and or empty” fast-path behavior.

`docsraw-analyze-existing` is complete. I’m now implementing `docsraw-sync-run` plus its resource/contracts/checklists, including the isolated parallel sub-agent pattern and the protected delete/rewrite flow.

Orchestrator + support docs are done. I’m now creating the long-form internal planning notes file with detailed rationale and a near-verbatim transcript section based on your original instructions.

I’ve finished the planning-notes doc with the transcript appendix. I’m now running validation checks for links/frontmatter/boundary rules, then I’ll close the final to-do and report the full result.

Implemented the full plan end-to-end without modifying the plan file, and all existing to-dos are now marked `completed`.
