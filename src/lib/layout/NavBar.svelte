<script>
  import { signOut } from '@auth/sveltekit/client'
</script>

<div class="navbar bg-base-200">
  <div class="flex-none" />
  <div class="flex-1">
    <a class="btn btn-ghost normal-case text-xl" href="/">Remult & SvelteKit</a>
  </div>
  <div class="flex-none">
    <div class="dropdown dropdown-end">
      <sapn tabindex="-1" class="btn btn-ghost btn-circle avatar">
        <div class="w-10 rounded-full">
          <img src="https://avatars.githubusercontent.com/u/5312607?v=4" alt="avatar" />
        </div>
      </sapn>
      <ul
        tabindex="-1"
        class="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-200 rounded-box w-52"
      >
        <li><button on:click={signOut}>Logout</button></li>
      </ul>
    </div>
  </div>
</div>
