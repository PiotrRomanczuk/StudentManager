"use client";

// import { useState, useEffect } from 'react';
// import { createClient } from '@/utils/supabase/clients/client';
// import Auth from './Auth';
// import Account from './Account';
// import { Session } from '@supabase/supabase-js';

import HeroHome from "@/components/landingPage/hero/HeroHome";
import Feature from "@/components/landingPage/feature/Feature";
import Team from "@/components/landingPage/team/Team";

export default function Page() {
  // const supabase = createClient();
  // const [session, setSession] = useState<Session | null>(null);

  // useEffect(() => {
  // 	supabase.auth.getSession().then(({ data: { session } }) => {
  // 		setSession(session);
  // 	});

  // 	supabase.auth.onAuthStateChange((_event, session) => {
  // 		setSession(session);
  // 	});
  // }, []);

  // return (
  // 	<div className='container' style={{ padding: '50px 0 100px 0' }}>
  // 		{!session ? (
  // 			<Auth />
  // 		) : (
  // 			<Account key={session?.user?.id} session={session} />
  // 		)}
  // 	</div>
  // );

  return (
    <div>
      <HeroHome />
      <Feature />
      <Team />
    </div>
  );
}
