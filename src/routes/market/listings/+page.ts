import { getListings } from "$lib/services/listings";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({params}) => {
    const {listings}  = await getListings();

    return {
        listings
    }
}