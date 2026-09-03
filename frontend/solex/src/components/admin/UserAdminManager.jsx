import React, { useEffect, useState } from 'react';

// Lets a logged-in admin grant (or revoke) admin access for any registered
// user with a single click, instead of opening MongoDB and flipping the
// isAdmin field by hand.
const UserAdminManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const currentUser = JSON.parse(localStorage.getItem('userInfo'));

  const getToken = () => currentUser?.token;

  const fetchUsers = async () => {
    setError('');
    const token = getToken();
    if (!token) {
      setError('You must be logged in as an admin to view users.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (response.ok) {
        setUsers(Array.isArray(data.users) ? data.users : []);
      } else {
        setError(data.message || 'Failed to fetch users.');
      }
    } catch (err) {
      setError('Server error. Could not fetch users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;

    (async () => {
      setError('');
      const token = getToken();
      if (!token) {
        if (!ignore) {
          setError('You must be logged in as an admin to view users.');
          setLoading(false);
        }
        return;
      }

      try {
        const response = await fetch('/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (ignore) return;

        if (response.ok) {
          setUsers(Array.isArray(data.users) ? data.users : []);
        } else {
          setError(data.message || 'Failed to fetch users.');
        }
      } catch (err) {
        if (!ignore) setError('Server error. Could not fetch users.');
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleAdmin = async (user) => {
    setError('');
    const token = getToken();
    if (!token) {
      setError('You must be logged in as an admin to do this.');
      return;
    }

    const nextIsAdmin = !user.isAdmin;
    const confirmed = window.confirm(
      nextIsAdmin
        ? `Make "${user.name}" (${user.email}) an admin?`
        : `Remove admin access from "${user.name}" (${user.email})?`
    );
    if (!confirmed) return;

    try {
      setUpdatingId(user._id);
      const response = await fetch(`/api/users/${user._id}/admin`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isAdmin: nextIsAdmin }),
      });

      const data = await response.json();

      if (response.ok) {
        setUsers((prev) => prev.map((u) => (u._id === data._id ? { ...u, isAdmin: data.isAdmin } : u)));
      } else {
        setError(data.message || 'Failed to update admin status');
      }
    } catch (err) {
      setError('Server error. Could not update admin status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const term = search.trim().toLowerCase();
    if (!term) return true;
    return u.name?.toLowerCase().includes(term) || u.email?.toLowerCase().includes(term);
  });

  if (loading) return <div className="text-center py-5">Loading users...</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <h2 className="fw-bold mb-0">Manage Admins</h2>
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-outline-secondary btn-sm" onClick={fetchUsers}>Refresh</button>
        </div>
      </div>

      <p className="text-muted">
        Grant admin access to any registered user below. They'll be able to manage shoes
        and other admins the next time they log in — no database edits required.
      </p>

      {error && <div className="alert alert-danger">{error}</div>}

      {filteredUsers.length === 0 ? (
        <p className="text-muted">No users found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const isSelf = currentUser && String(currentUser._id) === String(user._id);
                return (
                  <tr key={user._id}>
                    <td>{user.name} {isSelf && <span className="text-muted">(you)</span>}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge ${user.isAdmin ? 'text-bg-success' : 'text-bg-secondary'}`}>
                        {user.isAdmin ? 'Admin' : 'Customer'}
                      </span>
                    </td>
                    <td className="text-end">
                      <button
                        className={`btn btn-sm ${user.isAdmin ? 'btn-outline-danger' : 'btn-outline-success'}`}
                        onClick={() => toggleAdmin(user)}
                        disabled={updatingId === user._id || (isSelf && user.isAdmin)}
                        title={isSelf && user.isAdmin ? "You can't remove your own admin access" : ''}
                      >
                        {updatingId === user._id
                          ? 'Updating...'
                          : user.isAdmin
                            ? 'Remove Admin'
                            : 'Make Admin'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserAdminManager;
