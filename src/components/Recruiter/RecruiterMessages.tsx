import { MessagesPage } from '../Admin/MessagesPage';

// Reuse the Admin Messages page directly as the logic is role-agnostic (uses AuthService.getCurrentUser())
export function RecruiterMessages() {
    return <MessagesPage />;
}
