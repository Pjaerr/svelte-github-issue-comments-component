<script>
  import GithubIssueComments from "../lib/GithubIssueComments/GithubIssueComments.svelte";

  const issueUri = "Pjaerr/Svelte-Electron-Desktop-App/issues/1";
  const commentsPerPage = 3;
  const useShowCommentsButton = false;
  const allowRefreshingComments = true;
</script>

<h1>Github Issue Comments Dummy App</h1>

<GithubIssueComments
  {issueUri}
  {commentsPerPage}
  {useShowCommentsButton}
  {allowRefreshingComments}
/>
