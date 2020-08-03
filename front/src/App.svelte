<script>
  import { onMount } from "svelte";
  import Router, { wrap, push } from "svelte-spa-router";
  import axios from "axios";
  import { vowels, roots, compounds } from "./data/data.js";
  import Navbar from "./components/Navbar.svelte";
  import Footer from "./components/Footer.svelte";
  import Login from "./components/auth/Login.svelte";
  import Register from "./components/auth/Register.svelte";
  import LessonNav from "./components/shared/LessonNav.svelte";
  import Letters from "./components/pages/lessons/Letters.svelte";
  import Words from "./components/pages/lessons/Words.svelte";
  import Sentences from "./components/pages/lessons/Sentences.svelte";
  import Blogs from "./components/pages/lessons/Blogs.svelte";
  import AddBlogs from "./components/pages/lessons/AddBlogs.svelte";
  import { user } from "./stores/authStore.js";
  import { blogs } from "./stores/blogStore.js";

  const routes = {
    "/": Login,
    "/register": wrap(Register, { reason: "authenticated" }, () => !$user),
    "/letters": wrap(Letters, { reason: "unauthenticated" }, () => $user),
    "/words": wrap(Words, { reason: "unauthenticated" }, () => $user),
    "/sentences": wrap(Sentences, { reason: "unauthenticated" }, () => $user),
    "/blogs": wrap(Blogs, { reason: "unauthenticated" }, () => $user),
    "/addBlogs": wrap(
      AddBlogs,
      { reason: "notAdmin" },
      () => parseInt(JSON.parse($user).status) === 1
    )
  };
  function conditionsFailed(event) {
    const { reason } = event.detail.userData;
    switch (reason) {
      case "unauthenticated":
        return push("/");
      case "authenticated":
        return push("/letters");
      case "notAdmin":
        return push("/");
    }
  }
</script>

<style>
  nav {
    background: rgb(235, 226, 226);
    padding: 8px 0;
  }
  main {
    width: 98%;
    max-width: 1200px;
    margin: 0 auto;
  }
  :global(a.active) {
    color: red;
  }
</style>

<nav>
  <Navbar />
</nav>
<main>

  {#if $user}
    <LessonNav />
  {/if}
  <!-- The pages are rendered through router -->
  <Router {routes} on:conditionsFailed={conditionsFailed} />
  <Footer />
</main>
