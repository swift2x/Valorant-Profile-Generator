# ascent-profile-gen

JavaScript profile generator for **Ascent** private-server style inventories.

Generates a full unlock profile:

- all agents
- skins per weapon (catalog-based)
- sprays, buddies, cards, titles
- loadout defaults
- currency maxed
- optional backend user document shape

Not affiliated with Riot Games. Does not modify the live Valorant client.

## Use

```bash
node src/cli.js --name Swift --tag ASC --agent Fade --out profile.json
node src/cli.js --backend --name Swift --out user.json
node src/cli.js --count 5 --out players.json
```

## Library

```js
import { generateProfile, generateBackendUser } from "./src/index.js";

const profile = generateProfile({ name: "Swift", tag: "ASC", mainAgent: "Jett" });
const user = generateBackendUser({ name: "Swift", tag: "ASC" });
```

## License

MIT
