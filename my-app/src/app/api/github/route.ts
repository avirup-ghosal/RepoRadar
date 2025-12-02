import {NextRequest, NextResponse} from "next/server";
import axios from "axios";

export async function GET(req:NextRequest){
    const searchParams=req.nextUrl.searchParams;

    const query=searchParams.get("q");
    const sort=searchParams.get("sort") || "stars";
    const order=searchParams.get("order") || "desc";
    const per_page=searchParams.get("per_page") || "10";
    
    if(!query){
        return NextResponse.json({error:"Query parameter 'q' is required"},{status:400});
    }

    try{
        const response=await axios.get("https://api.github.com/search/repositories",{
            params:{
                q:query,
                sort,
                order,
                per_page,
            },
            headers:{
                "Accept":"application/vnd.github.v3+json",
                "Authorization":`Bearer ${process.env.REPO_TOKEN}`,
            },
        });

        return NextResponse.json(response.data);
    }catch(error: unknown){
        if(axios.isAxiosError(error) && error.response){
            return NextResponse.json(
                {error: error.response.data.message || error.message},
                {status:error.response.status}
            );
        }

        return NextResponse.json({error: "Internal Server Error"},{status:500});
    }
}