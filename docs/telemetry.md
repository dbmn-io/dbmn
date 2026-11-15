---
title: Usage telemetry
layout: default
nav_order: 11
parent: Documentation
---

# Usage telemetry

Sharing usage counts with DBMN is optional, and happens only while you are signed in to a DBMN account. They are what **Hub → Account → Weekly Usage** and **Total Usage** show you.

## The switch
{: #the-switch }

Added in v0.4.0
{: .label .label-green }

**Hub → Account → Weekly Usage → Share usage counts with DBMN**, or the setting `dbmn.telemetry.enabled`. It is on by default for a signed-in account. Off means nothing leaves the machine and nothing is kept waiting to be sent; Weekly Usage then says *Turn on usage sharing to see this*.

Signed out, nothing is sent, whatever the switch says. VS Code's own telemetry setting turned off (`telemetry.telemetryLevel`: `off`) turns this off too.

Only DBMN for VS Code sends usage counts. The web app and the desktop app send none.

## What is sent
{: #what-is-sent }

One total per day, for everything you ran that day, whichever environment or API it was against:

- the day;
- requests sent, batches started, the rows those batches held, and how many batch requests succeeded or failed;
- the time spent waiting on the API;
- which features were used that day, as flags. Today the only one is *Puppy School opened*;
- Dobermann's version, VS Code's version and the operating system name.

## What is never sent

An environment's address, an API's method or path, a request or response body, a header, a variable value, a token, an id from your data, a file, or the name of a saved endpoint.

The exact fields, with examples, are in [`TELEMETRY.md`](https://github.com/dbmn-io/dobermann/blob/main/TELEMETRY.md) in the Dobermann [source repository](/docs/open-source/), and a test there fails if the code and that file disagree.
