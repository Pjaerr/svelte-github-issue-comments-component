# Svelte Github Issue Comments Component

A Svelte component that uses a Github issue as a no-backend comment system for static sites/blogs

## Overview

This is a Svelte component that allows you to use an existing Github issue as a comment system intended for use on static sites/blogs.

It essentially recreates the github issues feed for a given issue url but on your website. You can find an example of this on any of my blogposts at https://joshuaj.co.uk/blog

**Example screenshot:**
![Screenshot of component](https://user-images.githubusercontent.com/11336751/74345835-98b30380-4da6-11ea-9f1d-31ffe5731712.png)


**Example of "Show Comments" button and loading spinner:**
![Example of Show Comments Button and loading spinner](https://user-images.githubusercontent.com/11336751/74346127-03fcd580-4da7-11ea-8ffa-53addf1ccd10.gif)

## Why
I wanted to have a static blog, but still allow some form of communication method, on my first blog post I just linked to a github issue and so I figured why not just show the comments from the Github issue instead.

## Caveats
- Your users can't actually use this to leave a comment, instead they are redirected to the comment box on the github issue itself. This is because the Github API for actually posting a comment is blocked by CORS and so without a backend/proxy we can't do this from the client side. If you have a backend and want to extend this component to allow posting, you can follow the API [here](https://developer.github.com/v3/).

- This won't work in IE because it uses `fetch()` and CSS variables.

## Usage

1. Install the package `npm i svelte-github-issue-comments-component` (https://www.npmjs.com/package/svelte-github-issue-comments-component)

2. Import it anywhere Svelte components are supported like: `import GithubIssueComments from "svelte-github-issue-comments-component/GithubIssueComments/GithubIssueComments.svelte";`

### Example Usage
```jsx
<GithubIssueComments
    issueUri="sveltejs/svelte/issues/2546"
    commentsPerPage={5}
    useShowCommentsButton={false}
    allowRefreshingComments={false}
/>
```

### Props

|Name|Type|Description|
|---|---|---|
|issueUri|`string`|The URI of the github issue you want to load comments from. Using the following structure: `USER/REPOSITORY_NAME/issues/ISSUE_NUMBER`|
|useShowCommentsButton|`boolean` (optional)|Should the component be hidden behind a "Show Comments" button. True if no value is provided.|
|commentsPerPage|`number` (optional)|How many comments should be shown per page, will show pagination if there is more than 1 page and will show 100 comments per page if no value is provided.|
|allowRefreshingComments|`boolean` (optional)|Should the user be shown a "Check for new comments" button? True if no value is provided.|

## Styling the component
The default styles closely follow github's own styles for issue comments, but if this does not fit within your site's styles:

1. All of the styles live under the `.github-issue-comments` namespace so you can easily override these in your own CSS

2. Alternatively, most of the common styles are provided as CSS variables so they can be changed in your own CSS (for example when setting up a dark theme that matches your site)

### The CSS variables and their default values

```css
.github-issue-comments {
  --github-issue-comments-comment-spacing: 10px;
  --github-issue-comments-avatar-size: 32px;
  --github-issue-comments-text-color: #24292e;
  --github-issue-comments-header-background-color: #f6f8fa;
  --github-issue-comments-header-owner-background-color: #f1f8ff;
  --github-issue-comments-body-background-color: #ffffff;
  --github-issue-comments-border-color: rgba(149, 157, 165, 0.5);
  --github-issue-comments-header-commented-date-text-color: #586069;

  --github-issue-comments-blockquote-text-color: #6a737d;
  --github-issue-comments-blockquote-border-color: #dfe2e5;
  --github-issue-comments-code-background-color: rgba(175, 184, 193, 0.2);
  --github-issue-comments-code-text-color: rgb(36, 41, 47);

  --github-issue-comments-new-comment-button-background-color: #28a745;
  --github-issue-comments-new-comment-button-text-color: #ffffff;
  --github-issue-comments-new-comment-button-width: 180px;
  --github-issue-comments-new-comment-button-height: 40px;

  --github-issue-comments-show-comments-button-width: 180px;
  --github-issue-comments-show-comments-button-height: 40px;

  --github-issue-comments-loading-icon-background-color: #6a737d;

  --github-issue-comments-show-comments-button-background-color: #ffffff;
  --github-issue-comments-show-comments-button-text-color: #586069;

  --github-issue-comments-meta-button-text-color: #586069;
}
```

## Contributing
Although this component was made for myself, I am happy to accept contributions. Simply raise an issue or a pull request.

**Getting Setup Locally**

1. Clone the repo

2. Run `npm install`

3. Run `npm run dev`

The component can be found in `src/lib/GithubIssueComments` and to adjust the props the component takes in the test environment you can edit the `src/routes/index.svelte` file.
