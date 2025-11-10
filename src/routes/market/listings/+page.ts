import { getListings } from "$lib/services/listings";

export const load = async () => {
    const {listings}  = await getListings();

    return {
        listings
    }
}