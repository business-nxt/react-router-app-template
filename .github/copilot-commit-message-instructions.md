## Commit Style

messages must follow the Dias format:

{type}({scope}): {subject}
<BLANK LINE>
{body}
<BLANK LINE>
{footer}

## Subject Line

The first line of a commit message is its subject. It contains a brief description of the change, no longer than 50 characters.

These {types} are allowed:

    feat -> feature
    fix -> bug fix
    docs -> documentation
    style -> formatting
    ref -> refactoring code
    test -> adding missing tests
    chore -> maintenance

The {scope} specifies the location of the change, such as “controller,” “Dockerfiles,” or ”.gitignore”. The {subject} should use an imperative, present-tense verb: “change,” not “changes” or “changed.” Don’t capitalize the verb or add a period (.) at the end of the subject line.

Try not to use "index" or "src" for scope, but then rather the parent folder name, or something more meaningful.

## Message Body

Separate the message body from the subject with a blank line. The body can have lines up to 72 characters long. It includes the motivation for the change and points out differences from previous behavior. The body and the footer should be written as full sentences.
Message Footer

Separate a footer from the message body with a blank line. Mention any breaking change along with the justification and migration notes. If the changes cannot be tested by Deis’ test scripts, include specific instructions for manual testing.
