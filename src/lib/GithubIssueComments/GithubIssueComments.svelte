<script lang="ts">
	import type { PaginationHeaders, GithubComment, ParsedGithubComment } from './types';
	import { parseLinkHeaders } from './utils';

	export let issueUri: string;
	export let useShowCommentsButton = true;
	export let allowRefreshingComments = true;
	export let commentsPerPage = 100;

	let showComments = !useShowCommentsButton;

	let comments: ParsedGithubComment[] = [];

	let commentsHaveLoaded = false;

	let paginationHeaders: PaginationHeaders | null = null;

	let page = 1;

	$: numberOfPages = paginationHeaders?.last ? paginationHeaders.last : page;

	let refreshCommentsCooldown = false;

	const loadComments = async () => {
		commentsHaveLoaded = false;

		try {
			const res = await fetch(
				`https://api.github.com/repos/${issueUri}/comments?page=${page}&per_page=${commentsPerPage}`,
				{
					method: 'GET',
					headers: {
						Accept: 'application/vnd.github.v3.html+json'
					}
				}
			);

			const link = res.headers.get('link');

			if (link) {
				paginationHeaders = parseLinkHeaders(link);
			}

			const data = await res.json();

			if (data.message === 'Not Found') {
				throw Error(`The issueUri: "${issueUri}" doesn't exist`);
			}

			if (data.message) {
				throw Error(data.message);
			}

			comments = data.map((comment: GithubComment) => {
				return {
					body: { __html: comment['body_html'] },
					user: {
						username: comment.user.login,
						avatarUrl: comment.user['avatar_url'],
						isRepositoryOwner: comment['author_association'] === 'OWNER'
					},
					createdAt: comment['created_at']
				};
			});

			commentsHaveLoaded = true;
		} catch (e) {
			// Log error but don't do anything as comments will infinitely load
			console.error(e);
		}
	};

	$: {
		if (page || issueUri) {
			loadComments();
		}
	}

	const refreshComments = () => {
		refreshCommentsCooldown = true;

		loadComments();

		setTimeout(() => (refreshCommentsCooldown = false), 1000);
	};

	const removeEmailContent = (node: HTMLElement) => {
		if (node !== null) {
			const emailElements = [
				node.querySelector('.email-hidden-toggle'),
				node.querySelector('.email-hidden-reply')
			];

			emailElements.forEach((element) => {
				if (element) {
					node.removeChild(element);
				}
			});
		}
	};
</script>

<section class="github-issue-comments">
	{#if showComments}
		{#if commentsHaveLoaded}
			{#each comments as { user, body, createdAt }}
				<div class="github-issue-comments__comment">
					<a
						class="github-issue-comments__comment-user-avatar"
						href={`https://github.com/${user.username}`}
						target="_blank"
						rel="noopener noreferrer"
					>
						<img src={user.avatarUrl} alt={`Avatar of ${user.username}`} />
					</a>

					<div class="github-issue-comments__comment-box">
						<div
							class={user.isRepositoryOwner
								? 'github-issue-comments__comment-box-header github-issue-comments__comment-box-header--is-owner'
								: 'github-issue-comments__comment-box-header'}
						>
							<b class="github-issue-comments__comment-box-header-username">
								{user.username}
								<span>
									{' '}
									commented on {new Date(createdAt).toLocaleDateString()}
								</span>
							</b>
						</div>
						<div class="github-issue-comments__comment-box-body" use:removeEmailContent>
							{@html body.__html}
						</div>
					</div>
				</div>
			{:else}
				<p class="github-issue-comments__no-comments-found">
					No comments found <span role="img" aria-label="Smiley Face Emoji"> 🙁 </span>
				</p>
			{/each}

			{#if paginationHeaders}
				<div class="github-issue-comments__pagination">
					{#each Array(numberOfPages) as _, i}
						<button
							class="github-issue-comments__pagination-button {page === i + 1 &&
								'github-issue-comments__pagination-button-active'}"
							on:click={() => {
								page = i + 1;
							}}
						>
							{i + 1}
						</button>
					{/each}
				</div>
			{/if}
		{:else}
			<div class="github-issue-comments__loading-icon" />
		{/if}

		{#if allowRefreshingComments}
			<button
				class="github-issue-comments__refresh-comments-button"
				disabled={refreshCommentsCooldown}
				onClick={refreshComments}
			>
				Check for new comments
			</button>
		{/if}

		<a
			class="github-issue-comments__new-comment-button"
			href={`https://github.com/${issueUri}#issue-comment-box`}
			target="_blank"
			rel="noopener noreferrer"
		>
			Write a Comment via Github
		</a>
	{:else}
		<button
			class="github-issue-comments__show-comments-button"
			onClick={() => (showComments = true)}
		>
			Show Comments
		</button>
	{/if}
</section>

<style>
	/*Component Container*/
	.github-issue-comments {
		display: flex;
		flex-direction: column;
		width: 100%;

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

	/*Comment Container*/
	.github-issue-comments__comment {
		display: flex;
		flex-direction: row;
		margin-top: var(--github-issue-comments-comment-spacing);
		margin-bottom: var(--github-issue-comments-comment-spacing);
	}

	/*Comment Profile Avatar*/
	.github-issue-comments__comment-user-avatar {
		max-width: var(--github-issue-comments-avatar-size);
		max-height: var(--github-issue-comments-avatar-size);
		margin-right: 5px;
	}

	.github-issue-comments__comment-user-avatar > img {
		width: 100%;
		height: 100%;
		border-radius: 3px;
	}

	/*Comment Box*/
	.github-issue-comments__comment-box {
		border: 1px solid var(--github-issue-comments-border-color);
		border-radius: 3px;
		color: var(--github-issue-comments-text-color);
		width: 100%;
		overflow: hidden;
	}

	/*Comment Box Header*/
	.github-issue-comments__comment-box-header {
		border-bottom: 1px solid var(--github-issue-comments-border-color);
		background-color: var(--github-issue-comments-header-background-color);
		height: 32px;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding: 8px;
	}

	.github-issue-comments__comment-box-header--is-owner {
		background-color: var(--github-issue-comments-header-owner-background-color);
	}

	.github-issue-comments__comment-box-header-username {
		font-weight: bold;
	}

	.github-issue-comments__comment-box-header-username span {
		font-weight: normal;
		color: var(--github-issue-comments-header-commented-date-text-color);
	}

	/*Comment Box Body*/
	.github-issue-comments__comment-box-body {
		background-color: var(--github-issue-comments-body-background-color);
		padding: 14px;
	}

	.github-issue-comments__comment-box-body :global(p) {
		overflow-wrap: break-word;
	}

	.github-issue-comments__comment-box-body :global(blockquote) {
		margin: 0;
		padding: 0 1em;
		color: var(--github-issue-comments-blockquote-text-color);
		border-left: 0.25em solid var(--github-issue-comments-blockquote-border-color);
	}

	.github-issue-comments__comment-box-body :global(p) :global(pre),
	:global(code) {
		overflow-x: auto;
		padding: 4px;
		border-radius: 6px;
		background-color: var(--github-issue-comments-code-background-color);
		color: var(--github-issue-comments-code-text-color);
		line-height: 2;
	}

	/*Comment Button*/
	.github-issue-comments__new-comment-button {
		display: flex;
		justify-content: center;
		align-items: center;
		min-width: var(--github-issue-comments-new-comment-button-width);
		min-height: var(--github-issue-comments-new-comment-button-height);
		padding-left: 8px;
		padding-right: 8px;
		margin: 0 auto;
		margin-top: var(--github-issue-comments-comment-spacing);
		border-radius: 3px;
		background-color: var(--github-issue-comments-new-comment-button-background-color);
		color: var(--github-issue-comments-new-comment-button-text-color);
		text-align: center;
		font-weight: bold;
		text-decoration: none;
	}

	/*Loading Icon Animation*/
	.github-issue-comments__loading-icon {
		width: 40px;
		height: 40px;
		background-color: var(--github-issue-comments-loading-icon-background-color);
		margin: 0 auto;
		margin-top: 30px;
		-webkit-animation: sk-rotateplane 1.5s infinite ease-in-out;
		animation: sk-rotateplane 1.5s infinite ease-in-out;
	}

	@-webkit-keyframes sk-rotateplane {
		0% {
			-webkit-transform: perspective(120px);
		}
		50% {
			-webkit-transform: perspective(120px) rotateY(180deg);
		}
		100% {
			-webkit-transform: perspective(120px) rotateY(180deg) rotateX(180deg);
		}
	}

	@keyframes sk-rotateplane {
		0% {
			transform: perspective(120px) rotateX(0deg) rotateY(0deg);
			-webkit-transform: perspective(120px) rotateX(0deg) rotateY(0deg);
		}
		50% {
			transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg);
			-webkit-transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg);
		}
		100% {
			transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
			-webkit-transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
		}
	}

	/*No Comments Found*/
	.github-issue-comments__no-comments-found {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 16px;
	}

	/*Show Comments Button*/
	.github-issue-comments__show-comments-button {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0 auto;
		width: var(--github-issue-comments-show-comments-button-width);
		height: var(--github-issue-comments-show-comments-button-height);
		padding-left: 8px;
		padding-right: 8px;
		border: 1px solid var(--github-issue-comments-show-comments-button-text-color);
		border-radius: 3px;
		background-color: var(--github-issue-comments-show-comments-button-background-color);
		color: var(--github-issue-comments-show-comments-button-text-color);
		transition: background-color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.github-issue-comments__show-comments-button:hover {
		background-color: var(--github-issue-comments-show-comments-button-text-color);
		color: var(--github-issue-comments-show-comments-button-background-color);
	}

	/*Refresh Comments Button*/
	.github-issue-comments__refresh-comments-button {
		border: none;
		background: none;
		margin: 0 auto;
		display: flex;
		justify-content: center;
		align-items: center;
		color: var(--github-issue-comments-meta-button-text-color);
		text-decoration: underline;
		padding: 16px;
	}

	.github-issue-comments__refresh-comments-button:hover {
		cursor: pointer;
	}

	.github-issue-comments__refresh-comments-button:disabled {
		text-decoration: none;
		transition: opacity 0.2s ease-in-out;
		opacity: 0.2;
	}

	/*Pagination*/
	.github-issue-comments__pagination {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		padding: 18px;
	}

	.github-issue-comments__pagination-button {
		border: none;
		background: none;
		color: var(--github-issue-comments-meta-button-text-color);
	}

	.github-issue-comments__pagination-button:hover {
		cursor: pointer;
	}

	.github-issue-comments__pagination-button-active {
		text-decoration: underline;
		font-weight: bold;
	}
</style>
