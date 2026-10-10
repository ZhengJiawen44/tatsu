import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useRef, useEffect, useState } from "react";

export function useOauthSync({service}:{service:string}){

      const { data: session } = useSession();
      const searchParams = useSearchParams();
      const hasSynced = useRef(false);
      const queryClient = useQueryClient();
      const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
      const [error, setError] = useState<string|null>(null);
      const {toast} = useToast();
    
      useEffect(() => {
        async function oauthCaldavSync(){
          try{
            setStatus("pending");
            const res = await fetch(`/api/calDav/sync?service=${service}`, { method: "POST" });
            if(!res.ok)
              throw new Error("oauth sync service returned "+ res.status);
            await queryClient.invalidateQueries({queryKey:["caldavCalendar"]},{throwOnError:true}) 
            setStatus("success");
          }catch(e){
            setStatus("error")
            if(e instanceof Error){
              setError(String(e));
              setError(e.message)
            }else{
              setError(String(e));
              toast({description:String(e)})
            }
          }finally{
            setTimeout(() => setStatus("idle"), 1500);
          }
        }
        
        const shouldSync = searchParams.get("calendarSync") === "true";
        if (session && shouldSync && !hasSynced.current) {
          hasSynced.current = true;
          oauthCaldavSync()
        }
      }, [session, searchParams]);
      return {status, error}
}