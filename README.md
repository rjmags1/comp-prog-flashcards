# Competitive Programming Flashcards
- Easy querying of questions by topics
- Ability to organize questions into 'decks'
- Clean, ergonomic UI
- Render and edit question prompts and solutions in markdown

__See docs folder for design and implementation documentation__

### Run the dev build
- Clone and go to project root:
```
$ git clone https://github.com/rjmags1/comp-prog-flashcards.git
$ cd comp-prog-flashcards
```

- Install tauri CLI:
```
$ npm install --save-dev @tauri-apps/cli
```

- Build and run:
```
$ npm run tauri dev
```

- The initial build will take a minute but future dev builds will be much quicker. If you are on Mac you may experience random crashes due to an unresolved issue with WebKit WebView (tauri dependency). Just rerun `npm run tauri dev`. This bug is not present on production builds.