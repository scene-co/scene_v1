import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface VoteButtonProps {
  score: number;
  userVote: 'up' | 'down' | null;
  onUpvote: () => void;
  onDownvote: () => void;
}

export function VoteButton({ score, userVote, onUpvote, onDownvote }: VoteButtonProps) {
  const formatScore = (num: number): string => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num.toString();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.voteButton}
        onPress={onUpvote}
        activeOpacity={0.6}
      >
        <Ionicons
          name={userVote === 'up' ? 'arrow-up' : 'arrow-up-outline'}
          size={20}
          color={userVote === 'up' ? '#000' : '#999'}
        />
      </TouchableOpacity>

      <Text
        style={[
          styles.score,
          userVote === 'up' && styles.scoreUpvoted,
          userVote === 'down' && styles.scoreDownvoted,
        ]}
      >
        {formatScore(score)}
      </Text>

      <TouchableOpacity
        style={styles.voteButton}
        onPress={onDownvote}
        activeOpacity={0.6}
      >
        <Ionicons
          name={userVote === 'down' ? 'arrow-down' : 'arrow-down-outline'}
          size={20}
          color={userVote === 'down' ? '#999' : '#CCC'}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    width: 40,
  },
  voteButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  score: {
    fontSize: 13,
    fontWeight: '700',
    color: '#666',
    marginVertical: 2,
  },
  scoreUpvoted: {
    color: '#000',
  },
  scoreDownvoted: {
    color: '#999',
  },
});
