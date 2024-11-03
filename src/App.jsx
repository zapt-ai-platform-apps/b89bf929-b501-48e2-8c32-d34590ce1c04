import { createSignal, onMount, createEffect, For, Show } from 'solid-js';
import { supabase } from './supabaseClient';
import { Auth } from '@supabase/auth-ui-solid';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import Pusher from 'pusher-js';

function App() {
  const [user, setUser] = createSignal(null);
  const [currentPage, setCurrentPage] = createSignal('login');
  const [messages, setMessages] = createSignal([]);
  const [newMessage, setNewMessage] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  const [onlineUsers, setOnlineUsers] = createSignal([]);

  const checkUserSignedIn = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
      setCurrentPage('homePage');
    }
  };

  onMount(() => {
    checkUserSignedIn();

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser(session.user);
        setCurrentPage('homePage');
      } else {
        setUser(null);
        setCurrentPage('login');
      }
    });

    return () => {
      authListener?.unsubscribe();
    };
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setCurrentPage('login');
  };

  // Fetch messages
  const fetchMessages = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const response = await fetch('/api/getMessages', {
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      }
    });
    if (response.ok) {
      const data = await response.json();
      setMessages(data);
    } else {
      console.error('Error fetching messages:', response.statusText);
    }
  };

  createEffect(() => {
    if (!user()) return;
    fetchMessages();

    // Setup Pusher
    const pusher = new Pusher(import.meta.env.VITE_PUBLIC_PUSHER_KEY, {
      cluster: import.meta.env.VITE_PUBLIC_PUSHER_CLUSTER,
      authEndpoint: '/api/pusher/auth',
      auth: {
        headers: {
          'Authorization': `Bearer ${supabase.auth.session()?.access_token}`,
        },
      },
    });

    const channel = pusher.subscribe('presence-chat');

    channel.bind('message', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    channel.bind('pusher:subscription_succeeded', (members) => {
      const users = [];
      members.each((member) => {
        users.push(member.info.name || member.id);
      });
      setOnlineUsers(users);
    });

    channel.bind('pusher:member_added', (member) => {
      setOnlineUsers((prevUsers) => [...prevUsers, member.info.name || member.id]);
    });

    channel.bind('pusher:member_removed', (member) => {
      setOnlineUsers((prevUsers) => prevUsers.filter((user) => user !== (member.info.name || member.id)));
    });

    return () => {
      pusher.unsubscribe('presence-chat');
    };
  });

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage()) return;
    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();

    try {
      const response = await fetch('/api/postMessage', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: newMessage() })
      });

      if (response.ok) {
        setNewMessage('');
      } else {
        console.error('Error sending message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="min-h-screen bg-gray-100 p-4">
      <Show
        when={currentPage() === 'homePage'}
        fallback={
          <div class="flex items-center justify-center min-h-screen">
            <div class="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
              <h2 class="text-3xl font-bold mb-6 text-center text-purple-600">Sign in with ZAPT</h2>
              <a
                href="https://www.zapt.ai"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-500 hover:underline mb-6 block text-center"
              >
                Learn more about ZAPT
              </a>
              <Auth
                supabaseClient={supabase}
                appearance={{ theme: ThemeSupa }}
                providers={['google', 'facebook', 'apple']}
                magicLink={true}
                view="magic_link"
                showLinks={false}
                authView="magic_link"
              />
            </div>
          </div>
        }
      >
        <div class="max-w-4xl mx-auto h-full flex flex-col">
          <div class="flex justify-between items-center mb-4">
            <h1 class="text-2xl font-bold text-purple-600">Real-Time Chat</h1>
            <div>
              <span class="text-gray-600 mr-4">Online Users: {onlineUsers().length}</span>
              <button
                class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </div>
          </div>
          <div class="flex-1 bg-white rounded-lg shadow-md p-4 overflow-auto mb-4">
            <For each={messages()}>
              {(message) => (
                <div class={`mb-2 ${message.userId === user().id ? 'text-right' : 'text-left'}`}>
                  <div class={`inline-block rounded-lg px-4 py-2 ${message.userId === user().id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                    <p>{message.content}</p>
                  </div>
                  <div class="text-xs text-gray-500 mt-1">
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              )}
            </For>
          </div>
          <form onSubmit={sendMessage} class="flex items-center">
            <input
              type="text"
              placeholder="Type your message..."
              value={newMessage()}
              onInput={(e) => setNewMessage(e.target.value)}
              class="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
            />
            <button
              type="submit"
              class={`ml-4 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-6 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${loading() ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading()}
            >
              {loading() ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      </Show>
    </div>
  );
}

export default App;