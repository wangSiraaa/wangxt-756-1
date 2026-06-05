# Trae Preflight

This folder is prepared for `wangxt-756-1`.

Use `.env` for stable local ports and compose project identity:

- APP_PORT: 18056
- API_PORT: 19056
- WEB_PORT: 20056
- DB_PORT: 21056
- REDIS_PORT: 22056

Smoke entry:

```bash
bash scripts/smoke.sh
```

The preflight files are environment scaffolding only. The generated business
project can replace or extend them when needed.
