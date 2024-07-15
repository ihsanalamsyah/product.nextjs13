
export function getCookie(name: string) {
  try{
    if (typeof window !== 'undefined'){
      const cookieValue = document.cookie.split('; ').find(row => row.startsWith(name))?.split('=')[1];
      return cookieValue ? decodeURIComponent(cookieValue) : null;
    }
    else{
      console.error("di render di lingkungan server document gak bisa di akses");
    }
   
  }
  catch (err){
    console.error(err);
  } 
}

export function setCookie(name: string, value: string, days: number) {
  if(typeof window !== 'undefined'){
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
  }
  else{
    console.error("di render di lingkungan server document gak bisa di akses");
  }
 
}

export function deleteCookie(name: string) {
  if(typeof window !== 'undefined'){
    document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
  else{
    console.error("di render di lingkungan server document gak bisa di akses");
  }
 
}

export function deleteLocalStorage(name: string){
  
  if(typeof window !== 'undefined'){
    localStorage.removeItem(name);
  }
  else{
    console.error("di render di lingkungan server document gak bisa di akses");
  }
  
}