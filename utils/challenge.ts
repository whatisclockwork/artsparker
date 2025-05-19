import { getSupabaseClient } from './supabase';

type Submission = {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  userId: string;
  challengeId: string;
  votes: number;
  createdAt: string;
};

type SubmitArtworkParams = {
  challengeId: string;
  title: string;
  description: string;
  imageUri: string;
};

export async function getChallengeData() {
  try {
    const supabase = await getSupabaseClient();
    
    const { data: challenges, error: challengeError } = await supabase
      .from('challenges')
      .select('*')
      .gte('end_date', new Date().toISOString())
      .order('start_date', { ascending: true })
      .limit(1);

    if (challengeError || !challenges?.length) {
      return {
        id: 'placeholder',
        prompt: 'A mystical dragon is gardening in a crystal cave',
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        submissions: []
      };
    }

    const challenge = challenges[0];

    // Get all submissions for the challenge
    const { data: submissions = [], error: submissionsError } = await supabase
      .from('submissions')
      .select(`
        id,
        image_url,
        title,
        description,
        votes,
        user_id,
        created_at
      `)
      .eq('challenge_id', challenge.id)
      .order('votes', { ascending: false });

    if (submissionsError) {
      console.error('Error fetching submissions:', submissionsError);
      throw submissionsError;
    }

    // Get current user's votes
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    let userVotes: Record<string, boolean> = {};
    if (userId) {
      const { data: votes } = await supabase
        .from('votes')
        .select('submission_id')
        .eq('user_id', userId);
      
      userVotes = (votes || []).reduce((acc: Record<string, boolean>, vote) => {
        acc[vote.submission_id] = true;
        return acc;
      }, {});
    }

    return {
      id: challenge.id,
      prompt: challenge.prompt,
      endDate: new Date(challenge.end_date),
      submissions: submissions.map(sub => ({
        id: sub.id,
        imageUrl: sub.image_url,
        title: sub.title || 'Untitled',
        author: {
          id: sub.user_id,
          name: 'Artist'
        },
        likes: sub.votes,
        hasLiked: !!userVotes[sub.id]
      }))
    };
  } catch (error) {
    console.error('Error in getChallengeData:', error);
    return {
      id: 'placeholder',
      prompt: 'A mystical dragon is gardening in a crystal cave',
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      submissions: []
    };
  }
}

export async function submitArtwork({
  challengeId,
  title,
  description,
  imageUri,
}: SubmitArtworkParams): Promise<Submission> {
  try {
    if (challengeId === 'placeholder') {
      throw new Error('Submissions are currently closed. Please wait for the next challenge.');
    }

    const supabase = await getSupabaseClient();

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      throw new Error('User must be logged in to submit artwork');
    }

    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.jpg`;
    const bucket = 'community';

    let blob: Blob;

    if (imageUri.startsWith('data:')) {
      const base64 = imageUri.split(',')[1];
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      blob = new Blob([byteArray], { type: 'image/jpeg' });
    } else {
      const response = await fetch(imageUri);
      blob = await response.blob();
    }

    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from(bucket)
      .createSignedUploadUrl(filename);

    if (signedUrlError || !signedUrlData) {
      throw new Error('Failed to get signed upload URL');
    }

    const uploadResponse = await fetch(signedUrlData.signedUrl, {
      method: 'PUT',
      body: blob,
      headers: {
        'Content-Type': blob.type || 'image/jpeg',
      },
    });

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload file');
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(signedUrlData.path);

    if (!publicUrlData) {
      throw new Error('Failed to get public URL');
    }

    const { data: submission, error: insertError } = await supabase
      .from('submissions')
      .insert({
        challenge_id: challengeId,
        user_id: session.user.id,
        title: title || 'Untitled',
        description,
        image_url: publicUrlData.publicUrl,
        votes: 0,
      })
      .select('*')
      .single();

    if (insertError) {
      await supabase.storage.from(bucket).remove([filename]);
      throw insertError;
    }

    return {
      id: submission.id,
      imageUrl: submission.image_url,
      title: submission.title,
      description: submission.description,
      userId: submission.user_id,
      challengeId: submission.challenge_id,
      votes: submission.votes,
      createdAt: submission.created_at,
    };
  } catch (error) {
    console.error('Error in submitArtwork:', error);
    throw error;
  }
}

export async function likeArtwork(submissionId: string): Promise<void> {
  try {
    const supabase = await getSupabaseClient();
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      throw new Error('Must be logged in to vote');
    }

    const { data: existingVote } = await supabase
      .from('votes')
      .select()
      .eq('submission_id', submissionId)
      .eq('user_id', session.user.id)
      .maybeSingle();

    if (existingVote) {
      // Remove the vote
      const { error: deleteError } = await supabase
        .from('votes')
        .delete()
        .eq('submission_id', submissionId)
        .eq('user_id', session.user.id);

      if (deleteError) throw deleteError;
    } else {
      // Add the vote
      const { error: insertError } = await supabase
        .from('votes')
        .insert({
          submission_id: submissionId,
          user_id: session.user.id,
        });

      if (insertError) throw insertError;
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
}