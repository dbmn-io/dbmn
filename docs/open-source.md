---
title: Open Source
layout: default
nav_order: 12
parent: Documentation
---

# Open Source

Added in v0.4.0
{: .label .label-green }

Dobermann is free and open source. Every feature is in the code you can read, with no limits and no account needed in VS Code.

| | |
|---|---|
| **Repository** | [github.com/dbmn-io/dobermann](https://github.com/dbmn-io/dobermann) |
| **Licence** | [GNU Affero General Public License v3.0](https://github.com/dbmn-io/dobermann/blob/main/LICENSE) (AGPL-3.0) |
| **Issues and ideas** | [Issues](https://github.com/dbmn-io/dobermann/issues), [Discussions](https://github.com/dbmn-io/dobermann/discussions) |
| **Security reports** | [`SECURITY.md`](https://github.com/dbmn-io/dobermann/blob/main/SECURITY.md): tell us privately first |

## What is in the repository
{: #whats-open }

- **The app**: the VS Code extension and the web app, from one code base.
- **The engine**: Run API, Run Batch, pagination, Chain, Compare and the Console.
- **The backend the app needs**: one schema and a seed, to host yourself.
- **The telemetry code**, with every field it sends listed in [`TELEMETRY.md`](https://github.com/dbmn-io/dobermann/blob/main/TELEMETRY.md). See [Usage telemetry](/docs/telemetry/).

Everything in the repository works without a DBMN account. A free account adds your endpoints and environments kept in your account, the web app at [app.dbmn.io](https://app.dbmn.io), [Puppy School](/puppy-school/) on The Training Ground, Weekly Usage and Standard Systems.

## What the licence means
{: #licence }

Use Dobermann freely, at home or at work, against any API. If you change it and offer it to other people, including as a hosted service, share your changes under the same licence. The [licence text](https://github.com/dbmn-io/dobermann/blob/main/LICENSE) is what counts; this is only a summary.

The names *DBMN* and *Dobermann* and the logo are trademarks and are not part of the licence: a fork needs its own name. See [`TRADEMARKS.md`](https://github.com/dbmn-io/dobermann/blob/main/TRADEMARKS.md).

## Build it yourself
{: #build }

```
git clone https://github.com/dbmn-io/dobermann.git
cd dobermann
npm ci
npm run build
```

Press <kbd>F5</kbd> in VS Code to run it, or `npm run package:prod` for a `.vsix` to install. The web app is `npm run web:install` then `npm run web:dev`.

## Host the backend yourself
{: #self-host }

The app talks to a Supabase project. The `supabase/` folder holds the schema, a seed and a config:

```
cd supabase && supabase start
```

The repository's `README.md` says how to point a build at it.

## Contribute
{: #contribute }

Bug reports, ideas and pull requests are welcome. Read [`CONTRIBUTING.md`](https://github.com/dbmn-io/dobermann/blob/main/CONTRIBUTING.md) first. A pull request needs the contributor agreement ([`CLA.md`](https://github.com/dbmn-io/dobermann/blob/main/CLA.md)) signed once.

## Related Topics

- [Your Data & Privacy](/docs/your-data/) — where data is stored and what leaves your machine
- [Usage telemetry](/docs/telemetry/) — what is sent, and the switch
- [Changelog](/docs/changelog/) — release history
