export interface GithubComment {
    body_html: string;
    user: {
        login: string;
        avatar_url: string;
    };
    author_association: string;
    created_at: string;
}
export interface ParsedGithubComment {
    body: {
        __html: string;
    };
    user: {
        username: string;
        avatarUrl: string;
        isRepositoryOwner: boolean;
    };
    createdAt: string;
}
export interface PaginationHeaders {
    next: number | undefined;
    previous: number | undefined;
    first: number | undefined;
    last: number | undefined;
}
