# valorant-profile-gen

JavaScript generator for Valorant profile + route JSON payloads.

```bat
start.bat
```

```bash
node src/cli.js --name Swift --tag ASC --out json
node src/cli.js --count 5 --out json
```

Output goes to `json/<Name>_<Tag>/` with `profile.json`, `user.json`, and `routes/*.json`.
