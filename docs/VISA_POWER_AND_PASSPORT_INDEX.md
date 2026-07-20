# MoveReady Visa Power and Passport Index

## Purpose

Visa Power and Travel Benefits is the MoveReady feature for users who already hold strong visas and want to know whether those visas create extra travel opportunities.

It belongs inside MoveReady because many users already have a Canada, U.S., UK, Schengen, Australia, or Japan visa but do not understand that some third countries may accept those visas for tourism or simplified entry.

## User problem

Users often ask:

- I have a Canadian visitor visa. Can it help me enter Mexico, Costa Rica, Panama, or the Dominican Republic?
- I have a U.S. visa. Does it reduce visa requirements elsewhere?
- Is my visa useful only for the issuing country, or can it open other safe travel options?
- What conditions do I need to check before I buy a ticket?

## MVP feature name

Public feature name:

**Visa Power and Travel Benefits**

Internal module family:

**Passport Index**

## What the feature should show

For each user, MoveReady should capture:

- Passport country
- Existing visas held
- Whether the visa is valid
- Whether the visa is multiple-entry
- Whether the visa has already been used where that condition matters
- Visa expiry date later
- Travel purpose later

The result should show:

- Destination country
- Whether a separate visa may be needed
- Maximum stay note
- Conditions
- Official source
- Last verified date
- Confidence level
- Safety notes

## Current frontend MVP

The frontend preview is now live at:

`/visa-power`

It currently includes source-reviewed starter records for:

- Mexico
- Dominican Republic
- Panama
- Costa Rica

It supports selected existing visas such as:

- Canada visitor visa
- U.S. visitor visa
- UK visitor visa
- Schengen visitor visa
- Australia visitor visa
- Japan visitor visa

## Business model

This should be a premium feature because the rule data changes and requires ongoing official-source monitoring.

Possible paid packaging:

- Free: view 2-4 sample destinations
- Starter paid: unlock full visa stack results
- Premium: watch rules and get alerts when visa-benefit conditions change
- Expert add-on: review a travel plan before ticket purchase

## Safety rules

MoveReady must never say that a user is guaranteed entry.

Every result should say:

- This is planning guidance only.
- Final entry is decided by the destination country, airline checks, and border officers.
- The user must check official sources before travel.
- The visa must still be valid at the time of travel.
- Extra conditions may apply, including multiple-entry status, previous use, passport validity, return ticket, funds, accommodation, and travel purpose.

## Future backend work

The backend should later store visa-benefit rules in tables such as:

- `visa_power_documents`
- `visa_power_destination_rules`
- `visa_power_rule_sources`
- `visa_power_user_checks`
- `visa_power_watchlist`

Each rule should have:

- Destination country
- Eligible passport groups or nationality restrictions
- Accepted third-country visas or residence permits
- Visa type accepted
- Multiple-entry requirement
- Previous-use requirement
- Minimum remaining validity
- Maximum stay
- Travel purpose
- Official source URL
- Last verified date
- Source confidence
- Reviewer ID
- Rule status

## Why this strengthens MoveReady

This feature makes MoveReady more valuable because it helps users use what they already have before spending money on another application.

It also supports the wider relocation journey because short exploratory trips, conferences, interviews, school visits, and route scouting can be part of relocation planning.
