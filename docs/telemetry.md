---
title: Usage telemetry
layout: default
nav_order: 11
parent: Documentation
---

# Usage telemetry

Dobermann sends DBMN usage counts, and only while you are signed in to a DBMN account. They are what **Hub → Account → Weekly Usage** and **Total Usage** show you.

## The switch
{: #the-switch }

**Hub → Account → Weekly Usage → Share usage counts with DBMN**, or the setting `dbmn.telemetry.enabled`. It is on by default for a signed-in account. Off means nothing leaves the machine and nothing is kept waiting to be sent; Weekly Usage then says *Turn on usage sharing to see this*.

Signed out, nothing is sent, whatever the switch says.

## What is sent
{: #what-is-sent }

Counts and run time, per environment per day:

- single requests run, batches started, the rows those batches held and how many succeeded or failed, rows exported and imported, and the time spent waiting on the API;
- which features were used that day (flags such as *pagination*);
- for each **saved** endpoint that ran: its method and its **path template** (the configured path before any variable is filled in, with a value typed straight into a path recorded as `{id}`), the number of requests and failures, and the time waiting;
- the environment's address as you saved it, Dobermann's version, VS Code's version and the operating system name.

## What is never sent

A request or response body, a header, a variable value, a token, an id from your data, a file, or the name of a saved endpoint.

The exact fields, with examples, are in `TELEMETRY.md` in the Dobermann source repository, and a test there fails if the code and that file disagree.
