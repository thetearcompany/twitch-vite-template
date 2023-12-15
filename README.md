# Twitch Panel Extension Template with Vite + Typescript + React

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.
Note: if you are in dark mode the text in the pages will be hard to see. I didn't apply styling.

This was created with the basic command:
`npm create vite@latest twitch-template -- --template react-ts`

There are 4 entry points:

- `config.html` - broadcaster configuration page.
- `live_config.html` - live config page launched from the dashboard.
- `panel.html` - the viewer panel below the stream.
- `mobile.html` - the mobile page but it points to the same tsx as the panel.html (easier to design one UI for both panel/mobile but you can split them up.)

There are two settings in the vite.config.ts that differ from the default project:

- `basicSsl()` which adds ssl to your local dev server.
  - You will need to open the page up and click "proceed anyway" or provide your own trusted cert/domain.
- Disabling module preloading
  - this breaks twitch because you're not allowed to load things before the helper is loaded.

This works in local testing and hosted testing using the defaults that twitch has setup for panel/mobile enabled extensions.

To test local:

- `npm run dev`

To deploy to hosted test:

- `npm run build`
- zip the contents of the dist folder (not the dist folder itself just everything inside it)
  - `cd dist`
  - `zip dist.zip * -r`
  - upload dist.zip to twitch
  - move to hosted test
