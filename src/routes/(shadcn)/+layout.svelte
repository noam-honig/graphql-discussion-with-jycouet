<script lang="ts">
  import MainNav from '$components/layouts/MainNav.svelte'
  import Search from '$components/layouts/Search.svelte'
  import { Avatar, AvatarFallback, AvatarImage } from '$components/ui/avatar'

  import '../../app.postcss'
</script>

<div class="md:hidden">
  <center class="mt-24 text-3xl"> Too small? </center>
  <!-- <img
    src="/examples/dashboard-light.png"
    width={1280}
    height={866}
    alt="Dashboard"
    class="block dark:hidden"
  />
  <img
    src="/examples/dashboard-dark.png"
    width={1280}
    height={866}
    alt="Dashboard"
    class="hidden dark:block"
  /> -->
</div>
<div class="hidden flex-col md:flex">
  <div class="border-b">
    <div class="flex h-16 items-center px-4">
      <MainNav class="mx-6" />
      <div class="ml-auto flex items-center space-x-4">
        <Search />
        <Avatar className="h-8 w-8">
          <AvatarImage src="/avatars/01.png" alt="@shadcn" />
          <AvatarFallback>JYC</AvatarFallback>
        </Avatar>
      </div>
    </div>
  </div>
  <div class="flex-1 space-y-4 p-8 pt-6">
    <slot />
  </div>
</div>
