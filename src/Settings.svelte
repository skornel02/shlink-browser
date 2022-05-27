<script lang="ts">
  import { isSettingsValid, ShlinkSettings } from "./SettingsHelper";

  let loading = true;
  let apiSecret: string = "";
  let apiUrl: string = "";

  chrome.storage.sync.get("shlinkSettings", (result) => {
    console.trace("Value of shlinkSettings:", result);
    const settings: Partial<ShlinkSettings> = result.shlinkSettings ?? {};

    if (typeof settings.apiSecret === "string") {
      apiSecret = settings.apiSecret;
    } 
    if (typeof settings.apiUrl === "string") {
      apiUrl = settings.apiUrl;
    } 
    loading = false;
  });

  const handleSettingsChange = (event: Event) => {
    const settingsToSave: ShlinkSettings = {
      apiSecret: apiSecret,
      apiUrl: apiUrl,
    };
    chrome.storage.sync
      .set({
        shlinkSettings: settingsToSave,
      })
      .then(() => {
        console.log("Settings saved", settingsToSave, isSettingsValid(settingsToSave));
      });
  };
</script>

{#if loading}
  <div>
    <p>Loading...</p>
  </div>
{:else}
  <main>
    <h1>Hello name!</h1>
    <p>
      Visit the <a href="https://svelte.dev/tutorial">Svelte tutorial</a> to learn
      how to build Svelte apps.
    </p>
    <p>
      API key: <input
        type="text"
        bind:value={apiSecret}
        on:change={handleSettingsChange}
      />
    </p>
    <p>
      Server URL: <input
        type="text"
        bind:value={apiUrl}
        on:change={handleSettingsChange}
      />
    </p>
  </main>
{/if}

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
