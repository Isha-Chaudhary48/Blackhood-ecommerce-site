export async function GetCurrentUser()
{
    const res = await fetch('api/me',
        {
            credentials: "include",
        }

    )
    if(!res.ok)
    {
        return null;
    }
    const data = await res.json();
    return data.user;
}