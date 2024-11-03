import { createSignal, onMount, createEffect, For } from 'solid-js';
import { supabase } from '../supabaseClient';
import { format } from 'date-fns';

function Chat(props) {
  const [messages, setMessages] = createSignal([]);
  const [newMessage, setNewMessage] = createSignal('');
  const [loading, setLoading] = createSignal(false);

  const fetchMessages = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(`/api/getMessages?chatUserId=${props.chatUserId}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        console.error('Error fetching messages:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage()) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch('/api/sendMessage', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newMessage(),
          recipientId: props.chatUserId,
        }),
      });
      if (response.ok) {
        const message = await response.json();
        setMessages([...messages(), message]);
        setNewMessage('');
      } else {
        console.error('Error sending message:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  let pollingInterval;

  onMount(() => {
    fetchMessages();
    pollingInterval = setInterval(fetchMessages, 3000); // Poll every 3 seconds
  });

  createEffect(() => {
    if (props.chatUserId) {
      fetchMessages();
    }
  });

  // Clean up interval when component is unmounted
  createEffect(() => {
    return () => {
      clearInterval(pollingInterval);
    };
  });

  const formatTimestamp = (timestamp) => {
    return format(new Date(timestamp), 'hh:mm a');
  };

  return (
    <div class="flex flex-col h-full">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl font-bold text-purple-600">Chat</h2>
      </div>
      <div class="flex-1 overflow-y-auto mb-4">
        <For each={messages()}>
          {(message) => (
            <div
              class={`mb-2 p-2 rounded-lg ${
                message.senderId === props.currentUser.id ? 'bg-purple-100 self-end' : 'bg-gray-100 self-start'
              }`}
            >
              <p class="text-sm">{message.content}</p>
              <p class="text-xs text-gray-500 text-right">{formatTimestamp(message.createdAt)}</p>
            </div>
          )}
        </For>
      </div>
      <div class="flex">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage()}
          onInput={(e) => setNewMessage(e.target.value)}
          class="flex-1 p-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
        />
        <button
          onClick={sendMessage}
          class="bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-r-lg transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;