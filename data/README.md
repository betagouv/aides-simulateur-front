# Form Submissions Data Directory

This directory contains JSON files of form submissions and calculation results from the simulateur.

## Structure

Each file is named using the pattern: `{simulateurId}_{timestamp}_{randomString}.json`

The JSON files contain:
- `timestamp`: When the form was submitted
- `simulateurId`: The ID of the simulator used
- `answers`: The user's answers to the form questions
- `results`: The calculation results from OpenFisca

## Purpose

This data is stored for:
1. Analytics and statistics on form usage
2. Debugging and troubleshooting
3. Improving the simulator based on real user data

## Management

Files in this directory are not automatically cleaned up. Consider implementing a retention policy or cleanup script if the number of files grows too large.
