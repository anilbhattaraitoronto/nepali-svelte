<script>
  import axios from "axios";
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";
  import { user } from "../../stores/authStore.js";
  import { blogs } from "../../stores/blogStore.js";
  //   let user = localStorage.getItem("user");
  let email = "";
  let password = "";
  let data = { email, password };
  async function login() {
    const response = axios
      .post("https://nepali.playingpets.com/api/users/login", {
        email,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
          if (!$user) {
            localStorage.setItem("user", JSON.stringify(response.data));
            let email = "";
            let password = "";
            push("/");
          } else {
            console.log("user already logged in");
            let email = "";
            let password = "";
            push("/");
          }
          $user = localStorage.getItem("user");
          let email = "";
          let password = "";
        }
      })
      .catch(error => Promise.reject("Authentication problem"));
  }

  //get all blogs to display

  onMount(async () => {
    const { data } = await axios.get(
      "https://nepali.playingpets.com/api/posts"
    );
    if (data) {
      $blogs = data;
      console.log("blogs are", $blogs);
    } else {
      console.log("There is no posts yet.");
    }
  });

  //delete post

  async function deletePost(id) {
    if ($user && parseInt(JSON.parse($user).status) === 1) {
      const response = await axios.delete(
        `https://nepali.playingpets.com/api/posts/delete/${id}`,
        {
          headers: {
            "x-access-token": JSON.parse($user).accessToken
          }
        }
      );
      if (response.status === 200) {
        $blogs = $blogs.filter(blog => blog.id !== id);
        push("/letters");
      }
    } else {
      console.log("you are not authorized to delete post");
    }
  }
</script>

<style>
  .landing {
    display: grid;
    grid-template-columns: 2fr 1fr;
    grid-gap: 8px;
    background: rgb(235, 226, 226);
    padding: 20px;
    /* width: 100%;
    max-width: 1200px; */
    margin: 20px auto;
  }
  form {
    width: 100%;
    max-width: 650px;
    margin: 20px auto;
    padding: 20px;
    background: rgb(240, 236, 236);
    box-shadow: 1px 1px 1px rgb(199, 189, 189);
  }
  h3 {
    padding: 20px 0;
  }
  .welcome {
    text-align: right;
  }
  ul {
    padding: 8px 20px;
  }
  li {
    padding-left: 20px;
    list-style-type: none;
  }
  button {
    cursor: pointer;
  }
  @media (max-width: 600px) {
    .landing {
      grid-template-columns: 1fr;
    }
  }
</style>

{#if $user}
  <p class="welcome">Welcome {JSON.parse($user).email}</p>
{/if}
<main class="landing">
  <article class="intro-learn-nepali">
    <h3 class="section-title">
      Welcome to
      <strong>Learn Nepali</strong>
    </h3>
    <div class="intro-text">
      {#if $blogs}
        {#each $blogs as blog (blog.id)}
          <div class="blog">
            <h4 class="blog-title">{blog.title}</h4>
            <p>{blog.author}</p>
            <p>{blog.content}</p>
            {#if $user && parseInt(JSON.parse($user).status) === 1}
              <p>
                <button on:click={() => deletePost(blog.id)}>Delete?</button>
                <button>Update?</button>
              </p>
            {/if}
          </div>
        {/each}
      {/if}
    </div>
  </article>
  <article class="form-content">
    {#if !$user}
      <form on:submit|preventDefault={login}>
        <p class="instruction">You MUST be logged in to access lessons.</p>
        <h3>Login</h3>
        <label for="email">Email</label>
        <input type="email" required bind:value={email} />
        <label for="password">Password</label>
        <input type="password" required bind:value={password} />
        <input type="submit" value="Login" />
        <p>
          If you do not have an account, please
          <a href="#/register">Register</a>
        </p>

      </form>
    {:else}
      <article class="user-details">
        <h4 class="sub-section-title">Dear {JSON.parse($user).email},</h4>
        <ul>
          As a subscribed user, you can:
          <li>Access all lessons</li>
          <li>Change password</li>
        </ul>
      </article>
    {/if}
  </article>

</main>
