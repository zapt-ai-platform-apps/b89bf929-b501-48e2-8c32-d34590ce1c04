import { createSignal, onMount, For, Show } from 'solid-js';
import { supabase } from '../supabaseClient';

function UserList(props) {
  const [users, setUsers] = createSignal([]);
  const [loading, setLoading] = createSignal(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data: { users }, error } = await supabase.auth.admin.listUsers();
      if (error) {
        console.error('Error fetching users:', error.message);
      } else {
        const otherUsers = users.filter(user => user.id !== props.currentUser.id);
        setUsers(otherUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  onMount(fetchUsers);

  return (
    <div>
      <Show when={!loading()} fallback={<p>Loading users...</p>}>
        <For each={users()}>
          {(user) => (
            <div
              class="flex items-center p-4 mb-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
              onClick={() => props.setChatUserId(user.id)}
            >
              <div class="flex-1">
                <p class="font-semibold">{user.email}</p>
              </div>
              {/* Presence indicator would go here */}
            </div>
          )}
        </For>
      </Show>
    </div>
  );
}

export default UserList;