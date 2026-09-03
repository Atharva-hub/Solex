import { createContext } from 'react';

// Just the context object. Kept in its own plain file (no JSX, no
// component) so AuthProvider.jsx and useAuth.js can each stay a
// single-export file - that's what keeps React Fast Refresh happy.
const AuthContext = createContext(null);

export default AuthContext;
