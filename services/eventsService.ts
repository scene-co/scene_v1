/**
 * Events Service
 * Handles all events operations (creation, participation, searches)
 */

import { supabase } from '../lib/supabase';

export interface Event {
  id: string;
  host_id: string;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  location: string;
  category: 'sports' | 'academic' | 'social' | 'cultural' | 'technical' | 'other';
  max_participants: number | null;
  current_participants: number;
  images: string[];
  status: 'active' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface CreateEventData {
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  location: string;
  category: 'sports' | 'academic' | 'social' | 'cultural' | 'technical' | 'other';
  max_participants?: number;
  images: string[];
}

export interface EventParticipant {
  id: string;
  event_id: string;
  user_id: string;
  status: 'attending' | 'maybe' | 'not_attending';
  joined_at: string;
}

// ============================================
// EVENT OPERATIONS
// ============================================

/**
 * Create a new event
 */
export const createEvent = async (
  eventData: CreateEventData
): Promise<{ success: boolean; event?: Event; error?: string }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data, error } = await supabase
      .from('events')
      .insert({
        host_id: user.id,
        ...eventData,
        status: 'active',
        current_participants: 0,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating event:', error);
      return { success: false, error: error.message };
    }

    return { success: true, event: data };
  } catch (error: any) {
    console.error('Error in createEvent:', error);
    return { success: false, error: error.message || 'Failed to create event' };
  }
};

/**
 * Get all events with filters
 */
export const getEvents = async (
  category?: string,
  status: 'active' | 'cancelled' | 'completed' = 'active',
  limit: number = 20,
  offset: number = 0
): Promise<{ events: Event[]; total: number }> => {
  try {
    let query = supabase
      .from('events')
      .select('*', { count: 'exact' })
      .eq('status', status)
      .order('event_date', { ascending: true })
      .range(offset, offset + limit - 1);

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching events:', error);
      return { events: [], total: 0 };
    }

    return { events: data || [], total: count || 0 };
  } catch (error) {
    console.error('Error in getEvents:', error);
    return { events: [], total: 0 };
  }
};

/**
 * Get a single event by ID
 */
export const getEventById = async (eventId: string): Promise<{ success: boolean; event?: Event; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    if (error) {
      console.error('Error fetching event:', error);
      return { success: false, error: error.message };
    }

    return { success: true, event: data };
  } catch (error: any) {
    console.error('Error in getEventById:', error);
    return { success: false, error: error.message || 'Failed to fetch event' };
  }
};

/**
 * Get user's hosted events
 */
export const getUserHostedEvents = async (userId?: string): Promise<Event[]> => {
  try {
    let targetUserId = userId;

    if (!targetUserId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      targetUserId = user.id;
    }

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('host_id', targetUserId)
      .order('event_date', { ascending: false });

    if (error) {
      console.error('Error fetching user hosted events:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getUserHostedEvents:', error);
    return [];
  }
};

/**
 * Get events user is participating in
 */
export const getUserParticipatingEvents = async (): Promise<Event[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('event_participants')
      .select('events(*)')
      .eq('user_id', user.id)
      .eq('status', 'attending');

    if (error) {
      console.error('Error fetching user participating events:', error);
      return [];
    }

    return (data || []).map((item: any) => item.events).filter(Boolean);
  } catch (error) {
    console.error('Error in getUserParticipatingEvents:', error);
    return [];
  }
};

/**
 * Update an event
 */
export const updateEvent = async (
  eventId: string,
  updates: Partial<CreateEventData>
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', eventId);

    if (error) {
      console.error('Error updating event:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error in updateEvent:', error);
    return { success: false, error: error.message || 'Failed to update event' };
  }
};

/**
 * Cancel an event
 */
export const cancelEvent = async (eventId: string): Promise<{ success: boolean; error?: string }> => {
  return updateEvent(eventId, { status: 'cancelled' } as any);
};

/**
 * Mark event as completed
 */
export const completeEvent = async (eventId: string): Promise<{ success: boolean; error?: string }> => {
  return updateEvent(eventId, { status: 'completed' } as any);
};

/**
 * Search events
 */
export const searchEvents = async (
  searchQuery: string,
  category?: string
): Promise<Event[]> => {
  try {
    let query = supabase
      .from('events')
      .select('*')
      .eq('status', 'active')
      .or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
      .order('event_date', { ascending: true })
      .limit(20);

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error searching events:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in searchEvents:', error);
    return [];
  }
};

// ============================================
// PARTICIPATION OPERATIONS
// ============================================

/**
 * Join an event
 */
export const joinEvent = async (
  eventId: string,
  status: 'attending' | 'maybe' = 'attending'
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Check if event is full
    const { data: event } = await supabase
      .from('events')
      .select('max_participants, current_participants')
      .eq('id', eventId)
      .single();

    if (event?.max_participants && event.current_participants >= event.max_participants) {
      return { success: false, error: 'Event is full' };
    }

    const { error } = await supabase
      .from('event_participants')
      .upsert({
        event_id: eventId,
        user_id: user.id,
        status,
      }, {
        onConflict: 'event_id,user_id',
      });

    if (error) {
      console.error('Error joining event:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error in joinEvent:', error);
    return { success: false, error: error.message || 'Failed to join event' };
  }
};

/**
 * Leave an event
 */
export const leaveEvent = async (eventId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { error } = await supabase
      .from('event_participants')
      .delete()
      .eq('event_id', eventId)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error leaving event:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Error in leaveEvent:', error);
    return { success: false, error: error.message || 'Failed to leave event' };
  }
};

/**
 * Get event participants
 */
export const getEventParticipants = async (eventId: string): Promise<EventParticipant[]> => {
  try {
    const { data, error } = await supabase
      .from('event_participants')
      .select('*')
      .eq('event_id', eventId)
      .eq('status', 'attending');

    if (error) {
      console.error('Error fetching event participants:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getEventParticipants:', error);
    return [];
  }
};

/**
 * Check if user is participating in event
 */
export const isUserParticipating = async (eventId: string): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('event_participants')
      .select('id')
      .eq('event_id', eventId)
      .eq('user_id', user.id)
      .eq('status', 'attending')
      .single();

    return !!data && !error;
  } catch (error) {
    return false;
  }
};
