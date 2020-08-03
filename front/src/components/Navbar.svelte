<script>
  import active from "svelte-spa-router/active";
  import { push } from "svelte-spa-router";
  import { user } from "../stores/authStore.js";

  function logout() {
    if ($user) {
      localStorage.removeItem("user");
      $user = null;
      push("/");
    } else {
      console.log("There is no logged in user.");
    }
  }
</script>

<style>
  nav {
    width: 100%;
    max-width: 1200px;
    margin: auto;
    box-shadow: 1px 1px 1px rgb(199, 189, 189);
    text-align: right;
    position: relative;
    padding: 12px 4px;
    background: rgb(235, 226, 226);
  }
  h1 {
    position: absolute;
    top: 4px;
    left: 4px;
  }
  h1 > a {
    color: rgb(0, 100, 200);
  }
  .main-link {
    display: inline-block;
    cursor: pointer;
    padding: 0 8px;
    background: white;
    transition: all ease-in-out 200ms;
  }

  .main-link:hover,
  :global(a.active) {
    color: rgb(43, 28, 28);
    text-decoration: underline;
  }
  button {
    all: unset;
    cursor: pointer;
  }
</style>

<nav>
  <h1>
    <a href="#/">Learn Nepali</a>
  </h1>

  {#if !$user}
    <a
      href="#/"
      use:active={{ path: '/', className: 'active' }}
      class="main-link">
      Login
    </a>
    <a
      href="#/register"
      use:active={{ path: '/register', className: 'active' }}
      class="main-link">
      Register
    </a>
  {:else}
    <!-- <button class="main-link">Welcome {JSON.parse($user).email}</button> -->
    <button on:click={logout} class="main-link">Logout</button>
  {/if}
</nav>
