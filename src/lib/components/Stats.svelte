<script>
	import CustomContainer from "./CustomContainer.svelte";

</script>

<CustomContainer>
    <div class="mb-3">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-semibold text-light-gray">Stats</h2>
      </div>
  
      <!-- Total Playtime Card -->
        <div class="flex flex-col p-6 text-light-gray">
            <div class="flex justify-between items-center">
                <h6 class="text-sm font-medium tracking-wider text-white uppercase mb-2">Total Playtime</h6>
                <svg class="w-12 h-12 text-light-gray" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="2" fill="none"></circle>
                    <line x1="12" y1="12" x2="12" y2="8" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line>
                    <line x1="12" y1="12" x2="14" y2="14" stroke="currentColor" stroke-width="2" stroke-linecap="round"></line>
                </svg> 
            </div>

            <ul class="space-y-2">
                <li class="text-lg text-light-gray font-semibold">
                    <p class="text-lg text-white font-semibold">52 Hours</p>
                    <p class="text-sm text-light-gray">Total</p>
                </li>
                <li class="text-lg text-light-gray font-semibold">
                    <p class="text-xl text-white font-semibold">20 Hours</p>
                    <p class="text-sm text-light-gray">This Month</p>
                </li>
                <li class="text-lg text-light-gray font-semibold">
                    <p class="text-xl text-white font-semibold">8 Hours</p>
                    <p class="text-sm text-light-gray">This Week</p>
                </li>
                <li class="text-lg text-light-gray font-semibold">
                    <p class="text-xl text-white font-semibold">2 Hours</p>
                    <p class="text-sm text-light-gray">Today</p>
                </li>
            </ul>
        </div>
  
      <!-- Top 5 Playlists -->
      <div class="flex flex-col shadow p-6 text-dark-gray">
        <h6 class="text-sm font-medium tracking-wider text-white uppercase mb-2">Top 10 Playlists</h6>
        
        <ul class="space-y-2">
            <li class="text-lg text-light-gray font-semibold">
                <p class="text-lg text-white font-semibold">1. Playlist</p>
                <p class="text-sm text-light-gray">100 plays</p>
            </li>
            <li class="text-lg text-light-gray font-semibold">
                <p class="text-lg text-white font-semibold">2. Playlist</p>
                <p class="text-sm text-light-gray">90 plays</p>
            </li>
            <li class="text-lg text-light-gray font-semibold">
                <p class="text-lg text-white font-semibold">3. Playlist</p>
                <p class="text-sm text-light-gray">80 plays</p>
            </li>
            <li class="text-lg text-light-gray font-semibold">
                <p class="text-lg text-white font-semibold">4. Playlist</p>
                <p class="text-sm text-light-gray">70 plays</p>
            </li>
            <li class="text-lg text-light-gray font-semibold">
                <p class="text-lg text-white font-semibold">5. Playlist</p>
                <p class="text-sm text-light-gray">60 plays</p>
            </li>
        </ul>
      </div>
  
      <!-- Top 5 Most Played Songs -->
      <div class="flex flex-col shadow p-6 text-dark-gray">
        <h6 class="text-sm font-medium tracking-wider text-white uppercase mb-2">Top 10 Most Played Songs</h6>
        <ul class="space-y-2">
            <li class="text-lg text-light-gray font-semibold">
                <p class="text-lg text-white font-semibold">1. Song</p>
                <p class="text-sm text-light-gray">100 plays</p>
            </li>
            <li class="text-lg text-light-gray font-semibold">
                <p class="text-lg text-white font-semibold">2. Song</p>
                <p class="text-sm text-light-gray">90 plays</p>
            </li>
            <li class="text-lg text-light-gray font-semibold">
                <p class="text-lg text-white font-semibold">3. Song</p>
                <p class="text-sm text-light-gray">80 plays</p>
            </li>
            <li class="text-lg text-light-gray font-semibold">
                <p class="text-lg text-white font-semibold">4. Song</p>
                <p class="text-sm text-light-gray">70 plays</p>
            </li>
            <li class="text-lg text-light-gray font-semibold">
                <p class="text-lg text-white font-semibold">5. Song</p>
                <p class="text-sm text-light-gray">60 plays</p>
            </li>
        </ul>
      </div>
    </div>
</CustomContainer>