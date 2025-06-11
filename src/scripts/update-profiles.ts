import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Error: Missing required environment variables.');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY are set in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function updateProfiles() {
  // Get all profiles where firstName or lastName is null
  const { data: profiles, error: fetchError } = await supabase
    .from('profiles')
    .select('*')
    .or('firstName.is.null,lastName.is.null');

  if (fetchError) {
    console.error('Error fetching profiles:', fetchError);
    return;
  }

  if (!profiles || profiles.length === 0) {
    console.log('No profiles need updating');
    return;
  }

  console.log(`Found ${profiles.length} profiles to update`);

  // Update each profile
  for (const profile of profiles) {
    const emailName = profile.email.split('@')[0];
    const firstName = emailName.split('.')[0] || emailName;
    const lastName = emailName.split('.')[1] || 'User';

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
        lastName: lastName.charAt(0).toUpperCase() + lastName.slice(1),
      })
      .eq('user_id', profile.user_id);

    if (updateError) {
      console.error(`Error updating profile ${profile.user_id}:`, updateError);
    } else {
      console.log(`Updated profile for ${profile.email}`);
    }
  }
}

// Run the update
updateProfiles().catch(console.error); 