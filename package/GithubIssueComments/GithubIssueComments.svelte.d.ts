import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        issueUri?: string | undefined;
        useShowCommentsButton?: boolean | undefined;
        allowRefreshingComments?: boolean | undefined;
        commentsPerPage?: number | undefined;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {};
};
export type GithubIssueCommentsProps = typeof __propDef.props;
export type GithubIssueCommentsEvents = typeof __propDef.events;
export type GithubIssueCommentsSlots = typeof __propDef.slots;
export default class GithubIssueComments extends SvelteComponentTyped<GithubIssueCommentsProps, GithubIssueCommentsEvents, GithubIssueCommentsSlots> {
}
export {};
