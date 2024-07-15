import { supabase } from '@/utils/supabase';

export async function auth(token: string) {
    let isAuthenticated = false;
    
    try{      
        if (token == null || token == ""){
            console.log('Token is null or string empty');
        }
        const { data, error } = await supabase.auth.getUser(token);
        if (error) {
            console.log('Error fetching user with token:', error.message);
        }
        if(data.user?.role == "authenticated"){
            isAuthenticated = true;
        }   
    }
    catch (err){
        console.log("failed authenticate", err);
    } 
    return isAuthenticated;
}
  