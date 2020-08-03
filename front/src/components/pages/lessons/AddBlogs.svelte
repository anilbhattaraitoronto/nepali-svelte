<script>
  import { user } from "../../../stores/authStore.js";
  import { blogs } from "../../../stores/blogStore.js";
  import axios from "axios";
  import { push } from "svelte-spa-router";
  import PageTitle from "../../shared/PageTitle.svelte";
  let title = "";
  let author = "";
  let content = "";

  async function addBlog() {
    if ($user && parseInt(JSON.parse($user).status) === 1) {
      const blog = {
        title: title,
        author: author,
        content: content
      };
      const response = await axios.post(
        "https://nepali.playingpets.com/api/posts/create",
        blog,
        {
          headers: {
            "x-access-token": JSON.parse($user).accessToken
          }
        }
      );

      if (response.status === 200) {
        if ($blogs) {
          $blogs = [response.data, ...$blogs];
        } else {
          $blogs = [response.data];
        }

        console.log("Blogs are: ", $blogs);
      } else {
        let errorMessage = "Something went wrong in adding post.";
      }

      //reset the values
      title = "";
      author = "";
      content = "";
      push("/");
    } else {
      console.log("You are not authorized to add post.");
      title = "";
      author = "";
      content = "";
      push("/");
    }
  }
</script>

<style>
  main {
    background: rgb(235, 226, 226);
    padding: 20px;
    margin: 20px auto;
  }
  form {
    max-width: 750px;
    margin: auto;
    padding: 20px;
    background: rgb(240, 236, 236);
  }
  label,
  input,
  textarea {
    display: block;
    width: 100%;
  }
  label {
    padding-bottom: 8px;
  }
  input[type="submit"] {
    cursor: pointer;
    max-width: 150px;
  }
</style>

{#if $user && parseInt(JSON.parse($user).status) === 1}
  <main class="writing-page">

    <form class="add-blog-form" on:submit|preventDefault={addBlog}>
      <PageTitle pageTitle="Add New Blogs" />
      <label for="title">Title:</label>
      <input type="text" id="title" required bind:value={title} />
      <label for="author">Author</label>
      <input type="text" id="author" required bind:value={author} />
      <label for="content">Content</label>
      <textarea
        id="content"
        cols="30"
        rows="10"
        required
        bind:value={content} />
      <input type="submit" value="Add Blog" />
    </form>

  </main>
{/if}
