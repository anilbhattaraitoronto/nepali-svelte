<script>
  import axios from "axios";
  import { push } from "svelte-spa-router";
  import { user } from "../../stores/authStore.js";
  let email = "";
  let password = "";
  let confirmPassword = "";

  let responseMessage = "";

  async function signup() {
    if (!$user) {
      const response = await axios
        .post("https://nepali.playingpets.com/api/users/signup", {
          email,
          password,
          confirmPassword
        })
        .then(response => {
          if (response.status === 200) {
            responseMessage = response.data.message;
            email = "";
            password = "";
            confirmPassword = "";
            push("/");
          } else if (response.status === 403) {
            console.log(response.status);
            responseMessage =
              ". The user with that email already exists. Please try to register with another email. ";
            email = "";
            password = "";
            confirmPassword = "";
            push("/register");
          }
        });
    } else {
      $user = localStorage.getItem("user");
    }
  }
</script>

<style>
  form {
    width: 100%;
    max-width: 650px;
    margin: 40px auto;
    padding: 20px;
    background: rgb(235, 226, 226);
  }
  h3 {
    padding: 20px 0;
  }
</style>

{#if !$user}
  <form on:submit|preventDefault={signup}>
    <p>{responseMessage}</p>
    <h3>Register</h3>
    <label for="email">Email</label>
    <input type="email" id="email" required bind:value={email} />
    <label for="password">Password</label>
    <input type="password" id="password" required bind:value={password} />
    <label for="confirmPassword">Password</label>
    <input
      type="password"
      id="confirmPassword"
      required
      bind:value={confirmPassword} />
    <input type="submit" value="Register" />
    <p>
      Already registered?
      <a href="#/">Please Login</a>
    </p>

  </form>
{/if}
