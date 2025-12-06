-- Migration: Create Vote Counting Triggers
-- Description: Automatically update vote counts when votes are added/changed/removed

-- Function to update post vote count
CREATE OR REPLACE FUNCTION update_post_vote_count()
RETURNS TRIGGER AS $$
DECLARE
  new_score INTEGER;
  new_upvotes INTEGER;
  new_downvotes INTEGER;
BEGIN
  -- Calculate new vote counts
  SELECT
    COUNT(*) FILTER (WHERE vote_type = 'up'),
    COUNT(*) FILTER (WHERE vote_type = 'down'),
    COUNT(*) FILTER (WHERE vote_type = 'up') - COUNT(*) FILTER (WHERE vote_type = 'down')
  INTO new_upvotes, new_downvotes, new_score
  FROM forum_votes
  WHERE post_id = COALESCE(NEW.post_id, OLD.post_id);

  -- Update the post
  UPDATE forum_posts
  SET
    upvotes = new_upvotes,
    downvotes = new_downvotes,
    score = new_score
  WHERE id = COALESCE(NEW.post_id, OLD.post_id);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Function to update comment vote count
CREATE OR REPLACE FUNCTION update_comment_vote_count()
RETURNS TRIGGER AS $$
DECLARE
  new_score INTEGER;
  new_upvotes INTEGER;
  new_downvotes INTEGER;
BEGIN
  -- Calculate new vote counts
  SELECT
    COUNT(*) FILTER (WHERE vote_type = 'up'),
    COUNT(*) FILTER (WHERE vote_type = 'down'),
    COUNT(*) FILTER (WHERE vote_type = 'up') - COUNT(*) FILTER (WHERE vote_type = 'down')
  INTO new_upvotes, new_downvotes, new_score
  FROM forum_votes
  WHERE comment_id = COALESCE(NEW.comment_id, OLD.comment_id);

  -- Update the comment
  UPDATE forum_comments
  SET
    upvotes = new_upvotes,
    downvotes = new_downvotes,
    score = new_score
  WHERE id = COALESCE(NEW.comment_id, OLD.comment_id);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Function to update comment count on posts
CREATE OR REPLACE FUNCTION update_post_comment_count()
RETURNS TRIGGER AS $$
DECLARE
  new_comment_count INTEGER;
BEGIN
  -- Calculate new comment count
  SELECT COUNT(*)
  INTO new_comment_count
  FROM forum_comments
  WHERE post_id = COALESCE(NEW.post_id, OLD.post_id);

  -- Update the post
  UPDATE forum_posts
  SET comment_count = new_comment_count
  WHERE id = COALESCE(NEW.post_id, OLD.post_id);

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Triggers for post votes
CREATE TRIGGER trigger_update_post_vote_count_on_insert
  AFTER INSERT ON forum_votes
  FOR EACH ROW
  WHEN (NEW.post_id IS NOT NULL)
  EXECUTE FUNCTION update_post_vote_count();

CREATE TRIGGER trigger_update_post_vote_count_on_update
  AFTER UPDATE ON forum_votes
  FOR EACH ROW
  WHEN (NEW.post_id IS NOT NULL)
  EXECUTE FUNCTION update_post_vote_count();

CREATE TRIGGER trigger_update_post_vote_count_on_delete
  AFTER DELETE ON forum_votes
  FOR EACH ROW
  WHEN (OLD.post_id IS NOT NULL)
  EXECUTE FUNCTION update_post_vote_count();

-- Triggers for comment votes
CREATE TRIGGER trigger_update_comment_vote_count_on_insert
  AFTER INSERT ON forum_votes
  FOR EACH ROW
  WHEN (NEW.comment_id IS NOT NULL)
  EXECUTE FUNCTION update_comment_vote_count();

CREATE TRIGGER trigger_update_comment_vote_count_on_update
  AFTER UPDATE ON forum_votes
  FOR EACH ROW
  WHEN (NEW.comment_id IS NOT NULL)
  EXECUTE FUNCTION update_comment_vote_count();

CREATE TRIGGER trigger_update_comment_vote_count_on_delete
  AFTER DELETE ON forum_votes
  FOR EACH ROW
  WHEN (OLD.comment_id IS NOT NULL)
  EXECUTE FUNCTION update_comment_vote_count();

-- Triggers for comment count
CREATE TRIGGER trigger_update_comment_count_on_insert
  AFTER INSERT ON forum_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_post_comment_count();

CREATE TRIGGER trigger_update_comment_count_on_delete
  AFTER DELETE ON forum_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_post_comment_count();
