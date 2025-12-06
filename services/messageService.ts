/**
 * Message Service
 * Handles all messaging operations (conversations, messages)
 */

import { supabase } from '../lib/supabase';

export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  name?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'image' | 'file';
  attachment_url?: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface ConversationWithParticipants extends Conversation {
  participants: string[];
  last_message?: Message;
  unread_count: number;
}

// ============================================
// CONVERSATION OPERATIONS
// ============================================

/**
 * Create a new conversation
 */
export const createConversation = async (
  type: 'direct' | 'group',
  participantIds: string[],
  name?: string
): Promise<{ success: boolean; conversation?: Conversation; error?: string }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // For direct messages, check if conversation already exists
    if (type === 'direct' && participantIds.length === 1) {
      const existingConversation = await getDirectConversation(participantIds[0]);
      if (existingConversation) {
        return { success: true, conversation: existingConversation };
      }
    }

    // Create conversation
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .insert({
        type,
        name,
        created_by: user.id,
      })
      .select()
      .single();

    if (convError) {
      console.error('Error creating conversation:', convError);
      return { success: false, error: convError.message };
    }

    // Add participants (including creator)
    const allParticipants = [user.id, ...participantIds];
    const participants = allParticipants.map(userId => ({
      conversation_id: conversation.id,
      user_id: userId,
    }));

    const { error: participantsError } = await supabase
      .from('conversation_participants')
      .insert(participants);

    if (participantsError) {
      console.error('Error adding participants:', participantsError);
      // Rollback: delete the conversation
      await supabase.from('conversations').delete().eq('id', conversation.id);
      return { success: false, error: participantsError.message };
    }

    return { success: true, conversation };
  } catch (error: any) {
    console.error('Error in createConversation:', error);
    return { success: false, error: error.message || 'Failed to create conversation' };
  }
};

/**
 * Get direct conversation with a specific user
 */
export const getDirectConversation = async (otherUserId: string): Promise<Conversation | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Find conversations where both users are participants
    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        conversation_participants!inner(user_id)
      `)
      .eq('type', 'direct')
      .eq('conversation_participants.user_id', user.id);

    if (error || !data) return null;

    // Filter to find conversation with exactly these two users
    for (const conv of data) {
      const { data: participants } = await supabase
        .from('conversation_participants')
        .select('user_id')
        .eq('conversation_id', conv.id);

      if (participants && participants.length === 2) {
        const userIds = participants.map(p => p.user_id);
        if (userIds.includes(user.id) && userIds.includes(otherUserId)) {
          return conv;
        }
      }
    }

    return null;
  } catch (error) {
    console.error('Error in getDirectConversation:', error);
    return null;
  }
};

/**
 * Get all conversations for current user
 */
export const getUserConversations = async (): Promise<ConversationWithParticipants[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // Get conversations where user is a participant
    const { data: participations, error } = await supabase
      .from('conversation_participants')
      .select('conversation_id, last_read_at')
      .eq('user_id', user.id);

    if (error || !participations) return [];

    const conversations: ConversationWithParticipants[] = [];

    for (const participation of participations) {
      // Get conversation details
      const { data: conv } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', participation.conversation_id)
        .single();

      if (!conv) continue;

      // Get all participants
      const { data: participants } = await supabase
        .from('conversation_participants')
        .select('user_id')
        .eq('conversation_id', conv.id);

      // Get last message
      const { data: lastMessage } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conv.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // Get unread count
      const { count: unreadCount } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('conversation_id', conv.id)
        .gt('created_at', participation.last_read_at)
        .neq('sender_id', user.id);

      conversations.push({
        ...conv,
        participants: participants?.map(p => p.user_id) || [],
        last_message: lastMessage || undefined,
        unread_count: unreadCount || 0,
      });
    }

    // Sort by most recent activity
    conversations.sort((a, b) => {
      const aTime = a.last_message?.created_at || a.created_at;
      const bTime = b.last_message?.created_at || b.created_at;
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });

    return conversations;
  } catch (error) {
    console.error('Error in getUserConversations:', error);
    return [];
  }
};

// ============================================
// MESSAGE OPERATIONS
// ============================================

/**
 * Send a message
 */
export const sendMessage = async (
  conversationId: string,
  content: string,
  messageType: 'text' | 'image' | 'file' = 'text',
  attachmentUrl?: string
): Promise<{ success: boolean; message?: Message; error?: string }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content,
        message_type: messageType,
        attachment_url: attachmentUrl,
      })
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      return { success: false, error: error.message };
    }

    return { success: true, message: data };
  } catch (error: any) {
    console.error('Error in sendMessage:', error);
    return { success: false, error: error.message || 'Failed to send message' };
  }
};

/**
 * Get messages for a conversation
 */
export const getMessages = async (
  conversationId: string,
  limit: number = 50,
  offset: number = 0
): Promise<Message[]> => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getMessages:', error);
    return [];
  }
};

/**
 * Mark conversation as read
 */
export const markConversationAsRead = async (conversationId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { error } = await supabase
      .from('conversation_participants')
      .update({ last_read_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error marking as read:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error in markConversationAsRead:', error);
    return { success: false, error: error.message || 'Failed to mark as read' };
  }
};

/**
 * Subscribe to new messages in a conversation
 */
export const subscribeToMessages = (
  conversationId: string,
  callback: (message: Message) => void
) => {
  return supabase
    .channel(`messages:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload) => {
        callback(payload.new as Message);
      }
    )
    .subscribe();
};

/**
 * Unsubscribe from messages
 */
export const unsubscribeFromMessages = async (conversationId: string) => {
  await supabase.channel(`messages:${conversationId}`).unsubscribe();
};
