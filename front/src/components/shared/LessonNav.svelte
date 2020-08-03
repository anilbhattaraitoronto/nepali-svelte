<script>
  import active from "svelte-spa-router/active";
  import { user } from "../../stores/authStore.js";
</script>

<style>
  nav {
    text-align: center;
  }
  .lesson-link {
    display: inline-block;
    text-align: right;
    padding: 0 8px;
  }
  :global(a.active) {
    color: red;
  }
</style>

<nav>
  <a
    href="#/letters"
    class="lesson-link"
    use:active={{ path: '/letters', className: 'active' }}>
    Letters
  </a>
  <a
    href="#/words"
    class="lesson-link"
    use:active={{ path: '/words', className: 'active' }}>
    Words
  </a>
  <a
    href="#/sentences"
    class="lesson-link"
    use:active={{ path: '/sentences', className: 'active' }}>
    Sentences
  </a>
  <a
    href="#/blogs"
    class="lesson-link"
    use:active={{ path: '/blogs', className: 'active' }}>
    Blogs
  </a>
  {#if parseFloat(JSON.parse($user).status) === 1}
    <a
      href="#/addBlogs"
      class="lesson-link"
      use:active={{ path: '/addBlogs', className: 'active' }}>
      Add Blogs
    </a>
  {/if}
</nav>
